import React, { useEffect, useRef, useState } from 'react'

/* A survey plate behind the whole page: a grid of square dots laid over a
   slowly rolling noise terrain, seen at a low angle. Dots that sit on regular
   height bands are drawn brighter, so contour lines emerge from the field the
   way they do on a topographic map. A handful of dots are marked in the
   accent colour. Scrolling carries the terrain towards the camera and lifts
   the view; the pointer adds a little parallax.

   All displacement happens in the vertex shader, so the CPU only updates a
   few uniforms per frame. three.js loads lazily. Phones get a coarser grid;
   under prefers-reduced-motion one static frame is rendered instead. */

const PAPER = [0.922, 0.906, 0.871]   // --fg  #ebe7de
const ACCENT = [0.898, 0.325, 0.239]  // --accent #e5533d

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uTravel;
  uniform float uSize;
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
    vec2 p = position.xz * 0.0045 + vec2(uTime * 0.012, -uTravel);
    float h = (fbm(p) - 0.5) * 160.0;
    vec4 mv = modelViewMatrix * vec4(position.x, h, position.z, 1.0);
    gl_Position = projectionMatrix * mv;

    float dist = -mv.z;
    vAccent = step(0.9965, aSeed);
    gl_PointSize = max(1.0, uSize * (260.0 / dist) * (1.0 + vAccent * 1.6));

    // contour bands every 9 units of height
    float band = abs(fract(h / 9.0) - 0.5);
    float contour = 1.0 - smoothstep(0.0, 0.07, 0.5 - band);
    float near = 1.0 - smoothstep(250.0, 1500.0, dist);
    vAlpha = near * mix(0.16, 0.85, contour);
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
      renderer.setClearColor(0x0d0d0c, 1)
      container.appendChild(renderer.domElement)

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(55, 1, 1, 3000)

      /* the grid: x across, z away from the camera */
      const cols = mobile ? 120 : 230
      const rows = mobile ? 110 : 200
      const width = 2000
      const depth = 1700
      const positions = new Float32Array(cols * rows * 3)
      const seeds = new Float32Array(cols * rows)
      let k = 0
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          positions[k * 3] = (c / (cols - 1) - 0.5) * width
          positions[k * 3 + 1] = 0
          positions[k * 3 + 2] = 250 - (r / (rows - 1)) * depth
          seeds[k] = Math.random()
          k++
        }
      }
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))

      const uniforms = {
        uTime: { value: 0 },
        uTravel: { value: 0 },
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

      /* p: page scroll progress 0..1 */
      function placeCamera(p) {
        camera.position.set(view.x * 40, 95 + p * 140, 330)
        target.set(view.x * 60, -view.y * 20, -420 + p * 120)
        camera.lookAt(target)
      }

      const scrollTarget = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      }

      function resize() {
        renderer.setSize(window.innerWidth, window.innerHeight)
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        if (reduced) { placeCamera(0); renderer.render(scene, camera) }
      }
      resize()
      window.addEventListener('resize', resize)
      setReady(true)

      const disposeScene = () => {
        geometry.dispose()
        material.dispose()
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
        uniforms.uTime.value = clock.elapsedTime
        uniforms.uTravel.value = clock.elapsedTime * 0.01 + progress * 3.2
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
