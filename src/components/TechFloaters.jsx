import React, { useEffect, useRef, useState } from 'react'

/* IT-themed 3D objects — laptop, CPU chip, server rack, database, cloud,
   </> tag, Wi-Fi signal, gear — drifting slowly behind the content.
   The canvas sits above the background video but under the page, so the
   glass cards frost whatever floats past them. Objects tumble gently,
   parallax with scroll and the mouse, and wrap vertically so the whole
   page always has something in view. three.js is imported lazily and the
   layer is skipped under prefers-reduced-motion. */
const CAM_Z = 12
const FOV = 45

/* ---------- object builders (each returns { group, tick? }) ---------- */

function makeMaterials(THREE) {
  return {
    body: new THREE.MeshStandardMaterial({ color: 0xdfe6e4, metalness: 0.5, roughness: 0.3 }),
    dark: new THREE.MeshStandardMaterial({ color: 0x1b2326, metalness: 0.7, roughness: 0.4 }),
    metal: new THREE.MeshStandardMaterial({ color: 0xb8c2c0, metalness: 0.9, roughness: 0.25 }),
    emerald: new THREE.MeshStandardMaterial({
      color: 0x34d399, emissive: 0x34d399, emissiveIntensity: 0.8, metalness: 0.3, roughness: 0.3,
    }),
    violet: new THREE.MeshStandardMaterial({
      color: 0xa78bfa, emissive: 0xa78bfa, emissiveIntensity: 0.8, metalness: 0.3, roughness: 0.3,
    }),
    glass: new THREE.MeshStandardMaterial({
      color: 0xe8fff8, transparent: true, opacity: 0.35, metalness: 0.1, roughness: 0.2,
      emissive: 0x9fe8df, emissiveIntensity: 0.15,
    }),
  }
}

function codeTexture(THREE) {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 512
  const g = c.getContext('2d')
  g.fillStyle = '#0b0b0d'
  g.fillRect(0, 0, c.width, c.height)
  const palette = ['#34d399', '#a78bfa', '#9fe8df', '#52525b', '#f5f5f4']
  let indent = 0
  for (let y = 14; y < c.height; y += 18) {
    if (Math.random() < 0.25) indent = Math.max(0, Math.min(3, indent + (Math.random() < 0.5 ? -1 : 1)))
    let x = 14 + indent * 18
    const tokens = 1 + Math.floor(Math.random() * 4)
    for (let i = 0; i < tokens && x < c.width - 20; i++) {
      const w = 12 + Math.random() * 46
      g.fillStyle = palette[Math.floor(Math.random() * palette.length)]
      g.fillRect(x, y, Math.min(w, c.width - 14 - x), 7)
      x += w + 8
    }
  }
  const tex = new THREE.CanvasTexture(c)
  tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(1, 0.4)
  return tex
}

function laptop(THREE, m) {
  const group = new THREE.Group()
  group.add(new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.07, 1.1), m.body))
  const pad = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.075, 0.3), m.dark)
  pad.position.set(0, 0.002, 0.3)
  group.add(pad)
  const keys = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.075, 0.45), m.dark)
  keys.position.set(0, 0.002, -0.17)
  group.add(keys)

  const hinge = new THREE.Group()
  hinge.position.set(0, 0.035, -0.55)
  hinge.rotation.x = -0.32 // opened a little past vertical
  group.add(hinge)
  const lid = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.05, 0.05), m.body)
  lid.position.y = 0.525
  hinge.add(lid)

  const tex = codeTexture(THREE)
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(1.48, 0.93),
    new THREE.MeshBasicMaterial({ map: tex })
  )
  screen.position.set(0, 0.525, 0.027)
  hinge.add(screen)

  return {
    group,
    tick: (t, dt) => { tex.offset.y -= dt * 0.04 }, // code scrolls up the screen
  }
}

function chip(THREE, m) {
  const group = new THREE.Group()
  group.add(new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.14, 1.1), m.dark))
  const die = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.16, 0.6), m.emerald)
  group.add(die)
  const core = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.18, 0.4), m.dark)
  group.add(core)

  const pinGeo = new THREE.BoxGeometry(0.06, 0.04, 0.22)
  for (let side = 0; side < 4; side++) {
    for (let i = 0; i < 7; i++) {
      const pin = new THREE.Mesh(pinGeo, m.metal)
      const along = -0.45 + i * 0.15
      pin.position.set(along, -0.02, 0.64)
      const wrap = new THREE.Group()
      wrap.rotation.y = (side * Math.PI) / 2
      wrap.add(pin)
      group.add(wrap)
    }
  }
  return {
    group,
    tick: (t) => { m.emerald.emissiveIntensity = 0.6 + Math.sin(t * 2) * 0.25 },
  }
}

function server(THREE, m) {
  const group = new THREE.Group()
  group.add(new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.6, 0.8), m.dark))
  const leds = []
  const ledGeo = new THREE.SphereGeometry(0.035, 10, 8)
  for (let u = 0; u < 4; u++) {
    const y = 0.55 - u * 0.37
    const bay = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.28, 0.04), m.body)
    bay.position.set(0, y, 0.41)
    group.add(bay)
    const vent = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.04, 0.045), m.dark)
    vent.position.set(-0.12, y, 0.415)
    group.add(vent)
    for (let i = 0; i < 3; i++) {
      const color = i === 2 ? 0xa78bfa : 0x34d399
      const mat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1 })
      const led = new THREE.Mesh(ledGeo, mat)
      led.position.set(0.18 + i * 0.09, y, 0.44)
      group.add(led)
      leds.push({ mat, rate: 2 + Math.random() * 7, phase: Math.random() * 10 })
    }
  }
  return {
    group,
    tick: (t) => {
      leds.forEach((l) => { l.mat.emissiveIntensity = Math.sin(t * l.rate + l.phase) > 0.2 ? 1.6 : 0.1 })
    },
  }
}

function database(THREE, m) {
  const group = new THREE.Group()
  const disk = new THREE.CylinderGeometry(0.55, 0.55, 0.32, 32)
  const ring = new THREE.TorusGeometry(0.555, 0.02, 8, 48)
  for (let i = 0; i < 3; i++) {
    const y = (i - 1) * 0.4
    const d = new THREE.Mesh(disk, m.body)
    d.position.y = y
    group.add(d)
    const r = new THREE.Mesh(ring, m.emerald)
    r.rotation.x = Math.PI / 2
    r.position.y = y + 0.18
    group.add(r)
  }
  return { group }
}

function cloud(THREE, m) {
  const group = new THREE.Group()
  ;[
    [0, 0.1, 0, 0.45], [-0.45, -0.05, 0, 0.33], [0.45, -0.05, 0, 0.35],
    [-0.2, 0.3, 0, 0.3], [0.22, 0.32, 0.05, 0.28], [0, -0.12, 0.15, 0.32],
  ].forEach(([x, y, z, r]) => {
    const puff = new THREE.Mesh(new THREE.SphereGeometry(r, 24, 16), m.glass)
    puff.position.set(x, y, z)
    group.add(puff)
  })
  // upload arrow
  const shaft = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.35, 0.07), m.emerald)
  shaft.position.set(0, -0.05, 0.5)
  const head = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.18, 4), m.emerald)
  head.position.set(0, 0.2, 0.5)
  group.add(shaft, head)
  return {
    group,
    tick: (t) => { shaft.position.y = -0.05 + ((t * 0.5) % 1) * 0.08; head.position.y = shaft.position.y + 0.25 },
  }
}

function codeTag(THREE, m) {
  const group = new THREE.Group()
  const bar = (len, x, y, rz, mat) => {
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.11, len, 0.11), mat)
    b.position.set(x, y, 0)
    b.rotation.z = rz
    group.add(b)
  }
  bar(0.5, -0.62, 0.17, -0.85, m.emerald) // <
  bar(0.5, -0.62, -0.17, 0.85, m.emerald)
  bar(1.0, 0, 0, -0.38, m.violet)          // /
  bar(0.5, 0.62, 0.17, 0.85, m.emerald)   // >
  bar(0.5, 0.62, -0.17, -0.85, m.emerald)
  return { group }
}

function wifi(THREE, m) {
  const group = new THREE.Group()
  const arcs = [0.3, 0.55, 0.8].map((r) => {
    const mat = m.violet.clone()
    const arc = new THREE.Mesh(new THREE.TorusGeometry(r, 0.05, 10, 40, Math.PI / 2), mat)
    arc.rotation.z = Math.PI / 4
    arc.position.y = -0.4
    group.add(arc)
    return mat
  })
  const dot = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 12), m.violet)
  dot.position.y = -0.4
  group.add(dot)
  return {
    group,
    // signal "pulses" outward one arc at a time
    tick: (t) => {
      const step = Math.floor(t * 2.5) % 4
      arcs.forEach((mat, i) => { mat.emissiveIntensity = i < step ? 1.1 : 0.15 })
    },
  }
}

function gear(THREE, m) {
  const group = new THREE.Group()
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.14, 12, 40), m.metal)
  group.add(ring)
  const toothGeo = new THREE.BoxGeometry(0.2, 0.22, 0.26)
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2
    const tooth = new THREE.Mesh(toothGeo, m.metal)
    tooth.position.set(Math.cos(a) * 0.6, Math.sin(a) * 0.6, 0)
    tooth.rotation.z = a
    group.add(tooth)
  }
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.3, 20), m.emerald)
  hub.rotation.x = Math.PI / 2
  group.add(hub)
  return { group, tick: (t, dt) => { group.rotation.z += dt * 0.6 } }
}

/* home spot (fraction of viewport, -1..1), depth, size, builder */
const LAYOUT = [
  { make: laptop,   x: -0.72, y:  0.55, z: -2,   s: 0.9 },
  { make: chip,     x:  0.78, y:  0.62, z: -4,   s: 0.8 },
  { make: server,   x:  0.82, y: -0.35, z: -3,   s: 0.75 },
  { make: codeTag,  x: -0.82, y: -0.15, z: -1,   s: 0.7 },
  { make: cloud,    x:  0.15, y:  0.85, z: -6,   s: 1.1 },
  { make: database, x: -0.45, y: -0.8,  z: -5,   s: 0.75 },
  { make: wifi,     x:  0.45, y: -0.9,  z: -2.5, s: 0.7 },
  { make: gear,     x: -0.15, y:  0.05, z: -8,   s: 0.9 },
]

function build(THREE, scene, mobile) {
  scene.add(new THREE.HemisphereLight(0xbff7ef, 0x0a0a0a, 0.8))
  const key = new THREE.DirectionalLight(0xffffff, 1.8)
  key.position.set(5, 10, 8)
  scene.add(key)
  const fill = new THREE.PointLight(0xa78bfa, 6, 30)
  fill.position.set(-6, -4, 4)
  scene.add(fill)

  const m = makeMaterials(THREE)
  // on phones keep the four that read best at small sizes
  const layout = mobile ? LAYOUT.filter((_, i) => [0, 1, 3, 6].includes(i)) : LAYOUT

  const items = layout.map((cfg, i) => {
    const { group, tick } = cfg.make(THREE, m)
    const holder = new THREE.Group() // position + tumble
    holder.add(group)
    holder.scale.setScalar(cfg.s * (mobile ? 0.7 : 1))
    holder.rotation.set(Math.random() * 0.6 - 0.3, Math.random() * Math.PI * 2, Math.random() * 0.4 - 0.2)
    scene.add(holder)
    return {
      ...cfg,
      holder,
      tick,
      seed: i * 1.7 + Math.random(),
      spin: (0.12 + Math.random() * 0.18) * (Math.random() < 0.5 ? -1 : 1),
      // nearer objects slide further with scroll
      parallax: 0.35 + (cfg.z + 8) * 0.06,
    }
  })

  // visible half-extents at a given depth
  const tanHalf = Math.tan(THREE.MathUtils.degToRad(FOV / 2))

  return function update(t, dt, aspect, scroll) {
    items.forEach((it) => {
      const halfH = tanHalf * (CAM_Z - it.z)
      const halfW = halfH * aspect
      const span = halfH * 2.6 // wrap range, a bit taller than the view

      const driftX = Math.sin(t * 0.13 + it.seed) * 0.08
      const driftY = Math.sin(t * 0.17 + it.seed * 2) * 0.06
      let y = (it.y + driftY) * halfH + scroll * it.parallax * halfH * 2
      y = ((((y + span / 2) % span) + span) % span) - span / 2

      it.holder.position.set((it.x + driftX) * halfW, y, it.z)
      it.holder.rotation.y += dt * it.spin
      it.holder.rotation.x = Math.sin(t * 0.3 + it.seed) * 0.35
      it.holder.position.y += Math.sin(t * 1.2 + it.seed) * 0.08 // bob
      it.tick?.(t, dt)
    })
  }
}

export default function TechFloaters() {
  const mountRef = useRef(null)
  const [enabled] = useState(
    () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    if (!enabled) return
    const container = mountRef.current
    let disposed = false
    let cleanup = () => {}

    import('three').then((THREE) => {
      if (disposed) return

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setClearColor(0x000000, 0)
      container.appendChild(renderer.domElement)

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100)
      camera.position.set(0, 0, CAM_Z)

      function resize() {
        const w = window.innerWidth
        const h = window.innerHeight
        renderer.setSize(w, h)
        camera.aspect = w / h
        camera.updateProjectionMatrix()
      }
      resize()
      window.addEventListener('resize', resize)

      // mouse parallax: the camera leans gently toward the pointer
      const mouse = { x: 0, y: 0 }
      const onMove = (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1
        mouse.y = (e.clientY / window.innerHeight) * 2 - 1
      }
      window.addEventListener('pointermove', onMove, { passive: true })

      const update = build(THREE, scene, window.innerWidth < 700)
      const clock = new THREE.Clock()
      let frame = 0

      function tick() {
        const dt = Math.min(clock.getDelta(), 0.05)
        camera.position.x += (mouse.x * 0.8 - camera.position.x) * 0.03
        camera.position.y += (-mouse.y * 0.5 - camera.position.y) * 0.03
        camera.lookAt(0, 0, 0)
        update(clock.elapsedTime, dt, camera.aspect, window.scrollY / window.innerHeight)
        renderer.render(scene, camera)
        frame = requestAnimationFrame(tick)
      }
      tick()

      cleanup = () => {
        cancelAnimationFrame(frame)
        window.removeEventListener('resize', resize)
        window.removeEventListener('pointermove', onMove)
        scene.traverse((o) => {
          o.geometry?.dispose()
          if (o.material) {
            [].concat(o.material).forEach((mat) => { mat.map?.dispose(); mat.dispose() })
          }
        })
        renderer.dispose()
        renderer.domElement.remove()
      }
    })

    return () => {
      disposed = true
      cleanup()
    }
  }, [enabled])

  if (!enabled) return null
  return <div ref={mountRef} className="tech-layer" aria-hidden="true" />
}
