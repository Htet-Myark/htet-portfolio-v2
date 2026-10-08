import React, { useEffect, useRef, useState } from 'react'

/* A 3D quadcopter that floats around the whole page on an endless wandering
   path — banking into turns, pitching with climb, rotors spinning.
   The canvas is fixed, transparent and click-through, so it drifts over the
   content without blocking it. three.js is imported lazily so it stays out of
   the main bundle. Skipped entirely under prefers-reduced-motion. */
const SPEED = 0.22        // path phase per second
const MARGIN = 0.82       // fraction of the visible area the path may use
const SCALE = 0.55        // drone size in world units

function build(THREE, scene) {
  /* ---------- lights ---------- */
  scene.add(new THREE.HemisphereLight(0xbff7ef, 0x0a0a0a, 0.7))
  const key = new THREE.DirectionalLight(0xffffff, 2)
  key.position.set(5, 10, 8)
  scene.add(key)
  const emerald = new THREE.PointLight(0x34d399, 8, 18)
  scene.add(emerald)
  const violet = new THREE.PointLight(0xa78bfa, 4, 14)
  scene.add(violet)

  /* ---------- materials ---------- */
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0xdfe6e4, metalness: 0.5, roughness: 0.3 })
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x1b2326, metalness: 0.7, roughness: 0.4 })
  const accentMat = new THREE.MeshStandardMaterial({
    color: 0x34d399, emissive: 0x34d399, emissiveIntensity: 0.7, metalness: 0.3, roughness: 0.3,
  })
  const rotorMat = new THREE.MeshStandardMaterial({
    color: 0xa78bfa, transparent: true, opacity: 0.55, metalness: 0.2, roughness: 0.4, side: THREE.DoubleSide,
  })
  const lensMat = new THREE.MeshStandardMaterial({
    color: 0x0a2a2c, metalness: 0.9, roughness: 0.1, emissive: 0x34d399, emissiveIntensity: 0.4,
  })

  /* ---------- drone ---------- */
  const drone = new THREE.Group() // position + heading
  const body = new THREE.Group()  // bank / pitch
  drone.add(body)
  drone.scale.setScalar(SCALE)
  scene.add(drone)

  body.add(new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.22, 0.6, 2, 1, 2), bodyMat))

  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.3, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), darkMat)
  dome.position.y = 0.11
  body.add(dome)
  const strip = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.02, 0.06), accentMat)
  strip.position.set(0, 0.03, 0.31)
  body.add(strip)

  const gimbal = new THREE.Group()
  gimbal.position.set(0, -0.2, 0.28)
  body.add(gimbal)
  gimbal.add(new THREE.Mesh(new THREE.SphereGeometry(0.13, 20, 16), darkMat))
  const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.08, 20), lensMat)
  lens.rotation.x = Math.PI / 2
  lens.position.z = 0.12
  gimbal.add(lens)

  const bladeGeo = new THREE.BoxGeometry(0.85, 0.01, 0.11)
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x9fe8df, transparent: true, opacity: 0.12, side: THREE.DoubleSide })
  const spinDirs = [1, -1, -1, 1]
  const rotors = [
    [0.9, 0.9], [-0.9, 0.9], [0.9, -0.9], [-0.9, -0.9],
  ].map(([x, z], i) => {
    const y = 0.05
    const len = Math.hypot(x, z)
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.07, len), darkMat)
    arm.position.set(x / 2, y - 0.02, z / 2)
    arm.rotation.y = Math.atan2(x, z)
    body.add(arm)

    const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.11, 0.16, 20), accentMat)
    motor.position.set(x, y + 0.08, z)
    body.add(motor)

    const hub = new THREE.Group()
    hub.position.set(x, y + 0.18, z)
    body.add(hub)

    const blades = new THREE.Group()
    const b2 = new THREE.Mesh(bladeGeo, rotorMat)
    b2.rotation.y = Math.PI / 2
    blades.add(new THREE.Mesh(bladeGeo, rotorMat), b2)
    hub.add(blades)

    const ring = new THREE.Mesh(new THREE.RingGeometry(0.4, 0.42, 48), ringMat)
    ring.rotation.x = -Math.PI / 2
    ring.position.y = 0.02
    hub.add(ring)

    return { blades, dir: spinDirs[i] }
  })

  const beacon = new THREE.PointLight(0x9fe8df, 1.5, 3)
  beacon.position.set(0, -0.3, 0)
  body.add(beacon)

  /* ---------- flight path ----------
     Incommensurate sine frequencies on x / y / z give a wandering loop that
     doesn't visibly repeat; x and y are scaled to the visible area each frame
     so the drone reaches every corner of the viewport at any window size. */
  const pathAt = (a, halfW, halfH, out) =>
    out.set(
      halfW * MARGIN * Math.sin(a * 0.71),
      halfH * MARGIN * Math.sin(a * 1.13 + 1.2),
      1.5 * Math.sin(a * 0.47)
    )

  const p = new THREE.Vector3()
  const ahead = new THREE.Vector3()
  const vel = new THREE.Vector3()
  const yawOnly = new THREE.Euler()
  let phase = Math.random() * 100 // start somewhere different each visit
  let yaw = 0

  return function update(t, dt, halfW, halfH) {
    phase += dt * SPEED
    pathAt(phase, halfW, halfH, p)
    pathAt(phase + 0.02, halfW, halfH, ahead)
    vel.subVectors(ahead, p)

    drone.position.copy(p)

    // turn smoothly toward the direction of travel (shortest way round)
    const targetYaw = Math.atan2(-vel.x, -vel.z)
    const dYaw = Math.atan2(Math.sin(targetYaw - yaw), Math.cos(targetYaw - yaw))
    yaw += dYaw * Math.min(1, dt * 3)
    drone.rotation.y = yaw

    // bank into turns, pitch with vertical speed
    const lateral = Math.hypot(vel.x, vel.z)
    yawOnly.set(0, -yaw, 0)
    const localX = vel.clone().applyEuler(yawOnly).x
    const bank = THREE.MathUtils.clamp(-localX * 3, -0.45, 0.45)
    const pitch = THREE.MathUtils.clamp(-vel.y * 3, -0.35, 0.35)
    body.rotation.z += (bank - body.rotation.z) * 0.08
    body.rotation.x += (pitch - body.rotation.x) * 0.08

    body.position.y = Math.sin(t * 4) * 0.05 // hover bob

    const spin = (18 + lateral * 10) * dt * 3
    rotors.forEach((r) => { r.blades.rotation.y += spin * r.dir })

    emerald.position.set(p.x - 3, p.y + 2, p.z - 2)
    violet.position.set(p.x + 3, p.y - 1, p.z + 2)
  }
}

export default function Drone() {
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
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
      camera.position.set(0, 2.5, 12)
      camera.lookAt(0, 0, 0)

      // half the visible width/height at the drone's depth (z = 0)
      let halfW = 1
      let halfH = 1
      function resize() {
        const w = window.innerWidth
        const h = window.innerHeight
        renderer.setSize(w, h)
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        const dist = camera.position.length()
        halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * dist
        halfW = halfH * camera.aspect
      }
      resize()
      window.addEventListener('resize', resize)

      const update = build(THREE, scene)
      const clock = new THREE.Clock()
      let frame = 0

      function tick() {
        const dt = Math.min(clock.getDelta(), 0.05)
        update(clock.elapsedTime, dt, halfW, halfH)
        renderer.render(scene, camera)
        frame = requestAnimationFrame(tick)
      }
      tick()

      cleanup = () => {
        cancelAnimationFrame(frame)
        window.removeEventListener('resize', resize)
        scene.traverse((o) => {
          o.geometry?.dispose()
          if (o.material) [].concat(o.material).forEach((m) => m.dispose())
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
  return <div ref={mountRef} className="drone-layer" aria-hidden="true" />
}
