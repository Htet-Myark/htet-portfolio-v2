import React, { useEffect, useRef, useState } from 'react'
import { loadDays } from './GitHubActivity'

/* The last year of my GitHub contributions, drawn as a survey plate behind
   the whole page. A grid of square dots is laid over a terrain whose central
   ridge is the contribution calendar itself: the seven weekdays run across,
   the weeks run away from the camera with the most recent week nearest, and
   every day's activity raises the ground under it. The land either side is
   quiet noise. Dots on regular height bands are drawn brighter, so contour
   lines form the way they do on a topographic map, and the busiest days are
   marked in the accent colour.

   Scrolling the page walks the camera back through the year; the pointer adds
   a little parallax. If the contribution data can't be fetched, the plate is
   noise alone. All displacement happens in the vertex shader, so the CPU only
   updates a few uniforms per frame. three.js loads lazily. Phones get a
   coarser grid; under prefers-reduced-motion one static frame is rendered. */

const PAPER = [0.114, 0.114, 0.122]   // --text   #1d1d1f (dots on a light page)
const ACCENT = [0.078, 0.157, 0.627]  // --accent #1428a0

const NEAR_Z = 250     // grid edge closest to the camera
const DEPTH = 1700     // grid extent away from the camera
const BAND = 1300      // width of the contribution ridge
const VISIBLE = 0.55   // fraction of the year in view at once
const NOISE = 0.0045   // world units -> noise coordinates

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uOffset;
  uniform float uSize;
  uniform float uHasData;
  uniform sampler2D uData;
  attribute float aSeed;
  varying float vAlpha;
  varying float vAccent;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
    return v;
  }

  void main() {
    // calendar coordinates: x = weekday across the ridge, y = weeks ago
    vec2 uv = vec2(position.x / ${BAND.toFixed(1)} + 0.5,
                   (${NEAR_Z.toFixed(1)} - position.z) / ${DEPTH.toFixed(1)} * ${VISIBLE} + uOffset);
    float inBand = smoothstep(0.0, 0.1, uv.x) * smoothstep(1.0, 0.9, uv.x) * step(uv.y, 1.0);
    float activity = texture2D(uData, clamp(uv, 0.0, 1.0)).r * inBand * uHasData;

    // the noise travels with the calendar so the whole plate moves as one
    float travel = uOffset * ${(DEPTH / VISIBLE * NOISE).toFixed(4)};
    vec2 p = position.xz * ${NOISE} + vec2(uTime * 0.01, -travel);
    float h = (fbm(p) - 0.5) * mix(150.0, 60.0, inBand * uHasData) + activity * 170.0;

    vec4 mv = modelViewMatrix * vec4(position.x, h, position.z, 1.0);
    gl_Position = projectionMatrix * mv;
    float dist = -mv.z;

    // busiest days get marked; a few stray marks elsewhere keep it from looking plotted
    float busy = step(0.62, activity) * step(0.9, aSeed);
    float stray = step(0.9985, aSeed) * (1.0 - inBand);
    vAccent = clamp(busy + stray, 0.0, 1.0);
    gl_PointSize = max(1.0, uSize * (260.0 / dist) * (1.0 + vAccent * 1.4));

    // contour bands every 9 units of height
    float band = abs(fract(h / 9.0) - 0.5);
    float contour = 1.0 - smoothstep(0.0, 0.07, 0.5 - band);
    float near = 1.0 - smoothstep(250.0, 1500.0, dist);
    vAlpha = near * mix(0.14, 0.85, contour);
    vAlpha = max(vAlpha, vAccent * near);
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uPaper;
  uniform vec3 uAccent;
  varying float vAlpha;
  varying float vAccent;

  void main() {
    // points stay square on purpose, like a printed dot screen
    gl_FragColor = vec4(mix(uPaper, uAccent, vAccent), vAlpha);
  }
`

/* Contribution days (oldest first) -> RGBA bytes, 7 columns (Sun..Sat) by one
   row per week, newest week in row 0. Level 0..4 maps onto 0..255. */
function calendarPixels(days) {
  const newestDow = new Date(`${days[days.length - 1].date}T00:00:00`).getDay()
  const weeks = Math.ceil((days.length + 6 - newestDow) / 7)
  const data = new Uint8Array(7 * weeks * 4)
  for (let ago = 0; ago < days.length; ago++) {
    const day = days[days.length - 1 - ago]
    const dow = new Date(`${day.date}T00:00:00`).getDay()
    const week = Math.floor((ago + 6 - newestDow) / 7)
    const i = (week * 7 + dow) * 4
    data[i] = data[i + 1] = data[i + 2] = Math.round((day.level / 4) * 255)
    data[i + 3] = 255
  }
  return { data, weeks }
}

export default function FieldBackground() {
  const mountRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const container = mountRef.current
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = window.innerWidth < 700
    let disposed = false
    let cleanup = () => {}

    import('three').then((THREE) => {
      if (disposed) return

      const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'high-performance' })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2))
      renderer.setClearColor(0xf7f7f7, 1)
      container.appendChild(renderer.domElement)

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(55, 1, 1, 3000)

      /* the grid: x across, z away from the camera */
      const cols = mobile ? 120 : 230
      const rows = mobile ? 110 : 200
      const width = 2000
      const positions = new Float32Array(cols * rows * 3)
      const seeds = new Float32Array(cols * rows)
      let k = 0
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          positions[k * 3] = (c / (cols - 1) - 0.5) * width
          positions[k * 3 + 2] = NEAR_Z - (r / (rows - 1)) * DEPTH
          seeds[k] = Math.random()
          k++
        }
      }
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))

      // 1x1 placeholder until the calendar arrives
      let calendar = new THREE.DataTexture(new Uint8Array(4), 1, 1)
      calendar.needsUpdate = true

      const uniforms = {
        uTime: { value: 0 },
        uOffset: { value: 0 },
        uHasData: { value: 0 },
        uData: { value: calendar },
        uSize: { value: (mobile ? 2.4 : 2.0) * renderer.getPixelRatio() },
        uPaper: { value: new THREE.Vector3(...PAPER) },
        uAccent: { value: new THREE.Vector3(...ACCENT) },
      }
      const material = new THREE.ShaderMaterial({
        uniforms, vertexShader, fragmentShader,
        transparent: true, depthWrite: false,
      })
      const points = new THREE.Points(geometry, material)
      points.frustumCulled = false // the shader moves vertices off their bounds
      scene.add(points)

      const target = new THREE.Vector3()
      const mouse = { x: 0, y: 0 }
      const view = { x: 0, y: 0 }
      let dataTarget = 0

      /* p: page scroll progress 0..1 */
      function placeCamera(p) {
        camera.position.set(view.x * 40, 110 + p * 120, NEAR_Z + 80)
        target.set(view.x * 60, -view.y * 20, -420 + p * 100)
        camera.lookAt(target)
      }

      const scrollTarget = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      }

      const renderStill = () => { placeCamera(0); renderer.render(scene, camera) }

      function resize() {
        renderer.setSize(window.innerWidth, window.innerHeight)
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        if (reduced) renderStill()
      }
      resize()
      window.addEventListener('resize', resize)
      setReady(true)

      loadDays()
        .then((days) => {
          if (disposed || !days.length) return
          const { data, weeks } = calendarPixels(days)
          calendar.dispose()
          calendar = new THREE.DataTexture(data, 7, weeks)
          calendar.magFilter = THREE.LinearFilter
          calendar.minFilter = THREE.LinearFilter
          calendar.needsUpdate = true
          uniforms.uData.value = calendar
          dataTarget = 1
          if (reduced) { uniforms.uHasData.value = 1; renderStill() }
        })
        .catch(() => { /* noise alone is a fine fallback */ })

      const disposeScene = () => {
        geometry.dispose()
        material.dispose()
        calendar.dispose()
        renderer.dispose()
        renderer.domElement.remove()
      }

      if (reduced) {
        cleanup = () => { window.removeEventListener('resize', resize); disposeScene() }
        return
      }

      const onMove = (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1
        mouse.y = (e.clientY / window.innerHeight) * 2 - 1
      }
      window.addEventListener('pointermove', onMove, { passive: true })

      let progress = scrollTarget()
      const clock = new THREE.Clock()
      let frame = 0
      function tick() {
        const dt = Math.min(clock.getDelta(), 0.05)
        progress += (scrollTarget() - progress) * Math.min(1, dt * 2.5) // eased follow
        view.x += (mouse.x - view.x) * Math.min(1, dt * 1.5)
        view.y += (mouse.y - view.y) * Math.min(1, dt * 1.5)
        // the ridge rises out of the noise once the data lands
        uniforms.uHasData.value += (dataTarget - uniforms.uHasData.value) * Math.min(1, dt * 1.2)
        uniforms.uTime.value = clock.elapsedTime
        uniforms.uOffset.value = progress * (1 - VISIBLE)
        placeCamera(progress)
        renderer.render(scene, camera)
        frame = requestAnimationFrame(tick)
      }
      tick()

      cleanup = () => {
        cancelAnimationFrame(frame)
        window.removeEventListener('resize', resize)
        window.removeEventListener('pointermove', onMove)
        disposeScene()
      }
    }).catch((err) => console.error('Background failed to load', err))

    return () => {
      disposed = true
      cleanup()
    }
  }, [])

  return <div ref={mountRef} className={`field-bg${ready ? ' is-ready' : ''}`} aria-hidden="true" />
}
