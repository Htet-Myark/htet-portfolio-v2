import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { loadDays } from './GitHubActivity'

/* The playable hero: fly a drone around a small island. Each landmark is a
   section of the site; reach one and press Enter (or tap its card) to open it.
   Everything here is also reachable by scrolling or the nav, so nobody has to play. */

const INK = 0x15140f, PAPER = 0xf3f0e8, CARD = 0xfbfaf5, SAND = 0xe8d5a6, RED = 0xd64024, STONE = 0x9ea6ad
const GRASS = 0x8cc46a, LEAF = 0x3f8f52, LEAF2 = 0x5fae5e, WOOD = 0x7a5a3c, SEA = 0x6fcbd9, SKY = 0xd9eff5, BLUE = 0x2f6fd0, GOLD = 0xf2b632, TEAL = 0x2e9d8a, STEEL = 0x39424e

export const PLACES = [
  { id: 'about', name: 'Home base', note: 'Who I am', x: 0, z: 9 },
  { id: 'education', name: 'Campus', note: 'Singapore Polytechnic', x: -15, z: 3 },
  { id: 'experience', name: 'The port', note: 'RPA at PSA', x: 15, z: 4 },
  { id: 'projects', name: 'Workshop', note: 'Things I built', x: -9, z: -10 },
  { id: 'skills', name: 'Server yard', note: 'What I work with', x: 9, z: -11 },
  { id: 'certs', name: 'Summit', note: 'AWS certifications', x: 0, z: -19 },
  { id: 'contact', name: 'Radio tower', note: 'Get in touch', x: -19, z: -13 },
]
const REACH = 4.2, EDGE = 25
const GITHUB = 'https://github.com/htet-myark'
/* The commit field: the last 52 weeks of GitHub contributions planted as a crop plot. */
const FIELD = { x: 0, z: 17.2, cell: 0.44, ramp: [0x9a7a57, 0x9be9a8, 0x40c463, 0x30a14e, 0x216e39] }

const mat = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0.05, flatShading: true, ...extra })
function box(g, w, h, d, color, x = 0, y = 0, z = 0, extra) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color, extra))
  m.position.set(x, y + h / 2, z); m.castShadow = true; m.receiveShadow = true; g.add(m); return m
}
function cone(g, r, h, seg, color, x = 0, y = 0, z = 0, rot = 0) {
  const m = new THREE.Mesh(new THREE.ConeGeometry(r, h, seg), mat(color))
  m.position.set(x, y + h / 2, z); m.rotation.y = rot; m.castShadow = true; g.add(m); return m
}
function cyl(g, r, h, color, x = 0, y = 0, z = 0, seg = 12) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, seg), mat(color))
  m.position.set(x, y + h / 2, z); m.castShadow = true; m.receiveShadow = true; g.add(m); return m
}

/* One small model per section, built from primitives in the site's three colours. */
const BUILD = {
  about(g) { box(g, 3.2, 2.2, 2.8, CARD); cone(g, 2.7, 1.6, 4, RED, 0, 2.2, 0, Math.PI / 4); box(g, 0.7, 1.2, 0.1, INK, 0, 0, 1.42); cyl(g, 0.05, 3.4, INK, 2.2, 0, 1); box(g, 0.9, 0.5, 0.05, RED, 2.65, 2.8, 1) },
  education(g) { box(g, 5, 0.4, 3.4, STONE); for (let i = -2; i <= 2; i++) cyl(g, 0.22, 2.2, CARD, i, 0.4, 1.3); box(g, 4.6, 2.2, 2.2, CARD, 0, 0.4, -0.3); box(g, 5.2, 0.35, 3.6, 0xb9482f, 0, 2.6, 0); cone(g, 2.6, 1.1, 4, RED, 0, 2.95, 0, Math.PI / 4).scale.z = 0.7 },
  experience(g) {
    for (const [x, z] of [[-1.6, -1.2], [1.6, -1.2], [-1.6, 1.2], [1.6, 1.2]]) box(g, 0.3, 5, 0.3, STEEL, x, 0, z)
    box(g, 3.6, 0.35, 2.8, STEEL, 0, 5, 0); box(g, 0.4, 0.35, 8, RED, 0, 5.35, 1.2); box(g, 0.9, 0.7, 0.9, CARD, 0, 4.3, 3.6)
    const cols = [RED, BLUE, GOLD, TEAL, BLUE, RED]
    cols.forEach((c, i) => box(g, 2.2, 0.95, 0.95, c, 3.6, Math.floor(i / 2) * 0.97, (i % 2) * 1.05 - 0.5))
    box(g, 2.2, 0.95, 0.95, GOLD, 0, 0, 0)
  },
  projects(g) {
    const h = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 4.4, 14, 1, false, 0, Math.PI), mat(0xc9d6de, { side: THREE.DoubleSide, metalness: 0.4, roughness: 0.5 }))
    h.rotation.z = Math.PI / 2; h.rotation.y = Math.PI / 2; h.position.y = 0.01; h.castShadow = true; g.add(h)
    box(g, 2, 1.8, 0.1, INK, 0, 0, 2.2)
    cyl(g, 0.45, 2.4, CARD, 3.6, 0.5, 0.5); cone(g, 0.45, 0.9, 12, RED, 3.6, 2.9, 0.5); cyl(g, 0.6, 0.5, INK, 3.6, 0, 0.5)
  },
  skills(g) {
    for (let i = 0; i < 3; i++) { box(g, 1.2, 3 + i * 0.5, 1.4, STEEL, (i - 1) * 1.6, 0, 0); for (let k = 0; k < 4; k++) box(g, 0.8, 0.08, 0.05, 0x58e08a, (i - 1) * 1.6, 0.6 + k * 0.6, 0.72, { emissive: 0x58e08a, emissiveIntensity: 1.6 }) }
    cyl(g, 0.08, 2, INK, 3, 0, 0); const d = cone(g, 0.9, 0.5, 14, CARD, 3, 2, 0); d.rotation.x = Math.PI * 0.8
  },
  certs(g) {
    cone(g, 4.2, 5, 6, STONE); cone(g, 1.6, 1.9, 6, CARD, 0, 3.15, 0)
    for (let i = -1; i <= 1; i++) { const b = cyl(g, 0.75, 0.25, i === 0 ? BLUE : STEEL, i * 1.9, 5.6 + (i === 0 ? 0.6 : 0), 0.4, 6); b.rotation.x = Math.PI / 2 }
  },
  contact(g) {
    const t = cone(g, 0.9, 7, 4, INK); t.material.wireframe = true; cyl(g, 0.06, 7.6, INK); const s = new THREE.Mesh(new THREE.SphereGeometry(0.28, 10, 8), mat(RED, { emissive: RED, emissiveIntensity: 1.5 })); s.position.y = 7.7; g.add(s)
    box(g, 1.6, 1.1, 1.4, CARD, 2, 0, 0.6); g.userData.ring = true
  },
}

function buildDrone() {
  const d = new THREE.Group(), rotors = []
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.62, 16, 12), mat(INK, { roughness: 0.3, metalness: 0.6, flatShading: false })); body.scale.y = 0.6; body.castShadow = true; d.add(body)
  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 10), mat(RED, { emissive: RED, emissiveIntensity: 1.4 })); eye.position.set(0, -0.08, 0.5); d.add(eye)
  for (const [x, z] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 1.5), mat(INK)); arm.position.set(x * 0.5, 0, z * 0.5); arm.rotation.y = Math.atan2(x, z); arm.castShadow = true; d.add(arm)
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.22, 8), mat(RED)); hub.position.set(x, 0.1, z); d.add(hub)
    const r = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.02, 0.1), mat(STONE)); r.position.set(x, 0.23, z); d.add(r); rotors.push(r)
  }
  return { d, rotors }
}

export default function World() {
  const host = useRef(null), labels = useRef([])
  const [near, setNear] = useState(null)
  const [seen, setSeen] = useState(() => { try { return JSON.parse(localStorage.getItem('world-seen')) || [] } catch { return [] } })
  const [ok, setOk] = useState(true)
  const api = useRef({})

  const ghLabel = useRef(null)
  const [gh, setGh] = useState(null)
  const open = (id) => (id === 'github' ? window.open(GITHUB, '_blank', 'noopener') : document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }))

  useEffect(() => { // scrolling through a section also ticks its stop off (see FlightMap)
    const sync = () => { try { setSeen(JSON.parse(localStorage.getItem('world-seen')) || []) } catch { /* private mode */ } }
    addEventListener('world-seen', sync)
    return () => removeEventListener('world-seen', sync)
  }, [])

  useEffect(() => {
    const el = host.current
    let renderer
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }) } catch { setOk(false); return }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap
    el.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(SKY, 95, 230)
    const cam = new THREE.PerspectiveCamera(38, 1, 0.5, 300)
    scene.add(new THREE.HemisphereLight(0xdff3ff, 0x9fc48a, 1.55))
    const sun = new THREE.DirectionalLight(0xfff0d2, 2.7); sun.position.set(-22, 38, 18); sun.castShadow = true
    sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -34, right: 34, top: 34, bottom: -34, near: 1, far: 120 }); sun.shadow.bias = -0.0005
    scene.add(sun)

    // the island: a paper-coloured plateau with an ink rim and dashed flight paths
    const island = new THREE.Mesh(new THREE.CylinderGeometry(EDGE + 2, EDGE + 4.5, 2.4, 56), [mat(SAND), mat(GRASS), mat(SAND)]); island.position.y = -1.2; island.receiveShadow = true; scene.add(island)
    const sea = new THREE.Mesh(new THREE.CircleGeometry(260, 48), new THREE.MeshStandardMaterial({ color: SEA, roughness: 0.35, metalness: 0.1 })); sea.rotation.x = -Math.PI / 2; sea.position.y = -1.9; sea.receiveShadow = true; scene.add(sea)
    const foam = new THREE.Mesh(new THREE.RingGeometry(EDGE + 4.2, EDGE + 5.6, 72), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.55 })); foam.rotation.x = -Math.PI / 2; foam.position.y = -1.85; scene.add(foam)
    const clouds = [] // soft clouds drifting over the sea, and a few boats circling the island
    for (let i = 0; i < 6; i++) { const c = new THREE.Group(); for (let k = 0; k < 3; k++) { const s = new THREE.Mesh(new THREE.SphereGeometry(2 + (k % 2), 10, 8), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, transparent: true, opacity: 0.9 })); s.position.set(k * 2.4 - 2.4, (k % 2) * 0.6, 0); s.scale.y = 0.55; c.add(s) } c.position.set(-60 + i * 24, 13 + (i % 3) * 2, -30 + ((i * 17) % 50)); scene.add(c); clouds.push(c) }
    const boats = [0, 2.2, 4.3].map((a, i) => { const b = new THREE.Group(); box(b, 1.1, 0.5, 2.6, i === 1 ? RED : CARD); box(b, 0.7, 0.6, 0.8, STEEL, 0, 0.5, -0.5); b.userData.a = a; scene.add(b); return b })
    const dash = new THREE.LineDashedMaterial({ color: INK, dashSize: 0.5, gapSize: 0.45, transparent: true, opacity: 0.28 })
    { const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0.04, 0), ...PLACES.map((p) => new THREE.Vector3(p.x, 0.04, p.z))]), dash); l.computeLineDistances(); scene.add(l) }
    const pad = new THREE.Mesh(new THREE.RingGeometry(1.3, 1.5, 32), new THREE.MeshBasicMaterial({ color: RED })); pad.rotation.x = -Math.PI / 2; pad.position.y = 0.05; scene.add(pad)
    for (let i = 0; i < 26; i++) { // trees, kept clear of the landmarks
      const a = i * 2.4, r = 8 + ((i * 7.3) % 16), x = Math.cos(a) * r, z = Math.sin(a) * r
      if (PLACES.some((p) => Math.hypot(p.x - x, p.z - z) < 5.5) || Math.hypot(x, z) < 4 || (Math.abs(x - FIELD.x) < 13.5 && Math.abs(z - FIELD.z) < 4)) continue
      const t = new THREE.Group(); cyl(t, 0.14, 0.7, WOOD); cone(t, 0.8, 1.7 + (i % 3) * 0.5, 7, i % 3 ? LEAF : LEAF2, 0, 0.55, 0); t.position.set(x, 0, z); scene.add(t)
    }

    const marks = PLACES.map((p) => {
      const g = new THREE.Group(); BUILD[p.id](g); g.position.set(p.x, 0, p.z); g.rotation.y = Math.atan2(-p.x, -p.z) + Math.PI; scene.add(g)
      const ring = new THREE.Mesh(new THREE.RingGeometry(REACH - 0.18, REACH, 48), new THREE.MeshBasicMaterial({ color: RED, transparent: true, opacity: 0.25 }))
      ring.rotation.x = -Math.PI / 2; ring.position.set(p.x, 0.06, p.z); scene.add(ring)
      return { p, g, ring }
    })

    const { d: drone, rotors } = buildDrone(); scene.add(drone)

    // commit field: one block per day, taller and greener the more I shipped that day
    let alive = true, field = false
    loadDays().then((all) => {
      if (!alive || !all?.length) return
      const days = all.slice(-364), cols = Math.ceil(days.length / 7), c = FIELD.cell
      const bed = new THREE.Mesh(new THREE.BoxGeometry(cols * c + 0.6, 0.16, 7 * c + 0.6), mat(0x7a5a3c)); bed.position.set(FIELD.x, 0.08, FIELD.z); bed.receiveShadow = true; scene.add(bed)
      const inst = new THREE.InstancedMesh(new THREE.BoxGeometry(c * 0.84, 1, c * 0.84), mat(0xffffff), days.length)
      const m = new THREE.Matrix4(), col = new THREE.Color(), max = Math.max(1, ...days.map((d) => d.count))
      days.forEach((d, i) => {
        const lvl = d.count ? Math.min(4, 1 + Math.floor((d.count / max) * 3.999)) : 0, h = 0.1 + (d.count ? 0.25 + (d.count / max) * 1.5 : 0)
        m.makeScale(1, h, 1).setPosition(FIELD.x + (Math.floor(i / 7) - (cols - 1) / 2) * c, 0.16 + h / 2, FIELD.z + ((i % 7) - 3) * c)
        inst.setMatrixAt(i, m); inst.setColorAt(i, col.setHex(FIELD.ramp[lvl]))
      })
      inst.castShadow = true; inst.receiveShadow = true; scene.add(inst)
      field = true; setGh(days.reduce((n, d) => n + d.count, 0))
    }).catch(() => { /* no network: the island simply has no field */ })
    const shadow = new THREE.Mesh(new THREE.CircleGeometry(0.8, 20), new THREE.MeshBasicMaterial({ color: INK, transparent: true, opacity: 0.18 })); shadow.rotation.x = -Math.PI / 2; scene.add(shadow)

    const pos = new THREE.Vector3(0, 3, 0), vel = new THREE.Vector3(), keys = new Set()
    let target = null, nearId = null, visible = true, raf = 0, last = performance.now(), W = 1, H = 1
    api.current.flyTo = (p) => { target = new THREE.Vector3(p.x, 0, p.z + REACH * 0.55) }

    const inView = () => scrollY < innerHeight * 0.6
    const kd = (e) => {
      if (!inView() || /INPUT|TEXTAREA/.test(e.target.tagName)) return
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key
      if (['w', 'a', 's', 'd', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(k)) { keys.add(k); target = null; e.preventDefault() }
      if (k === 'Enter' && nearId) open(nearId)
    }
    const ku = (e) => keys.delete(e.key.length === 1 ? e.key.toLowerCase() : e.key)
    const ray = new THREE.Raycaster(), ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
    const click = (e) => { // click or tap the ground to send the drone there
      const r = el.getBoundingClientRect(), hit = new THREE.Vector3()
      ray.setFromCamera(new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), cam)
      if (ray.ray.intersectPlane(ground, hit) && Math.hypot(hit.x, hit.z) < EDGE + 2) target = hit
    }
    addEventListener('keydown', kd); addEventListener('keyup', ku); el.addEventListener('click', click)

    const resize = () => { W = el.clientWidth; H = el.clientHeight; renderer.setSize(W, H); cam.aspect = W / H; cam.updateProjectionMatrix() }
    const ro = new ResizeObserver(resize); ro.observe(el); resize()
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) { last = performance.now(); loop() } }); io.observe(el)

    const v = new THREE.Vector3(), camAt = new THREE.Vector3(-3, 48, 58)
    function loop() {
      cancelAnimationFrame(raf)
      if (!visible) return
      raf = requestAnimationFrame(loop)
      const now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now

      let ax = (keys.has('d') || keys.has('ArrowRight') ? 1 : 0) - (keys.has('a') || keys.has('ArrowLeft') ? 1 : 0)
      let az = (keys.has('s') || keys.has('ArrowDown') ? 1 : 0) - (keys.has('w') || keys.has('ArrowUp') ? 1 : 0)
      if (target) { const dx = target.x - pos.x, dz = target.z - pos.z, dist = Math.hypot(dx, dz); if (dist < 0.4) target = null; else { ax = (dx / dist) * Math.min(1, dist / 3); az = (dz / dist) * Math.min(1, dist / 3) } }
      vel.x += (ax * 15 - vel.x * 2.6) * dt; vel.z += (az * 15 - vel.z * 2.6) * dt
      pos.x += vel.x * dt; pos.z += vel.z * dt
      const r = Math.hypot(pos.x, pos.z); if (r > EDGE) { pos.x *= EDGE / r; pos.z *= EDGE / r }
      pos.y = 3 + Math.sin(now / 520) * 0.18

      drone.position.copy(pos); drone.rotation.z = -vel.x * 0.07; drone.rotation.x = vel.z * 0.07
      if (Math.hypot(vel.x, vel.z) > 0.4) { let da = Math.atan2(vel.x, vel.z) - drone.rotation.y; da = Math.atan2(Math.sin(da), Math.cos(da)); drone.rotation.y += da * Math.min(1, dt * 5) }
      rotors.forEach((ro2, i) => { ro2.rotation.y += dt * (38 + i) })
      shadow.position.set(pos.x, 0.05, pos.z)
      foam.scale.setScalar(1 + Math.sin(now / 900) * 0.012); foam.material.opacity = 0.4 + Math.sin(now / 900) * 0.15
      clouds.forEach((c, i) => { c.position.x += dt * (0.9 + i * 0.12); if (c.position.x > 80) c.position.x = -80 })
      boats.forEach((b, i) => { const a = b.userData.a + now / (9000 + i * 2500), r = EDGE + 11 + i * 5; b.position.set(Math.cos(a) * r, -1.9 + Math.sin(now / 500 + i) * 0.08, Math.sin(a) * r); b.rotation.y = -a })

      const far = W < 700 ? 1.5 : 1.62, off = W < 900 ? 0 : -3
      v.set(pos.x * 0.55 + off, 30 * far, pos.z * 0.55 + 36 * far); camAt.lerp(v, Math.min(1, dt * 2.5)); cam.position.copy(camAt); cam.lookAt(pos.x * 0.55 + off, 1, pos.z * 0.55 - 5)

      let best = null
      marks.forEach((m, i) => {
        const dist = Math.hypot(m.p.x - pos.x, m.p.z - pos.z), on = dist < REACH
        if (on) best = m.p.id
        m.ring.material.opacity = on ? 0.9 : 0.22 + Math.sin(now / 400 + i) * 0.08
        m.ring.scale.setScalar(on ? 1 + Math.sin(now / 160) * 0.03 : 1)
        const lab = labels.current[i]
        if (lab) { v.set(m.p.x, m.p.id === 'contact' ? 8.6 : 6.6, m.p.z).project(cam); lab.style.transform = `translate(-50%,-100%) translate(${(v.x * 0.5 + 0.5) * W}px,${(-v.y * 0.5 + 0.5) * H}px)`; lab.classList.toggle('on', on) }
      })
      if (field) {
        if (!best && Math.abs(pos.x - FIELD.x) < 12.5 && Math.abs(pos.z - FIELD.z) < 2.6) best = 'github'
        const lab = ghLabel.current
        if (lab) { v.set(FIELD.x, 3.4, FIELD.z).project(cam); lab.style.transform = `translate(-50%,-100%) translate(${(v.x * 0.5 + 0.5) * W}px,${(-v.y * 0.5 + 0.5) * H}px)`; lab.classList.toggle('on', best === 'github') }
      }
      if (best !== nearId) {
        nearId = best; setNear(best)
        if (best && best !== 'github') setSeen((s) => { if (s.includes(best)) return s; const n = [...s, best]; try { localStorage.setItem('world-seen', JSON.stringify(n)) } catch { /* private mode */ } return n })
      }
      renderer.render(scene, cam)
    }
    loop()

    return () => {
      alive = false; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect()
      removeEventListener('keydown', kd); removeEventListener('keyup', ku); el.removeEventListener('click', click)
      scene.traverse((o) => { o.geometry?.dispose(); o.material?.dispose?.() }); renderer.dispose(); renderer.domElement.remove()
    }
  }, [])

  const place = near === 'github' ? { id: 'github', name: 'Commit field', note: `${gh ?? ''} contributions in 12 months` } : PLACES.find((p) => p.id === near)
  return (
    <div className="world">
      <div className="world-canvas" ref={host} aria-hidden="true" />
      {ok && PLACES.map((p, i) => (
        <span key={p.id} className="world-label" ref={(n) => (labels.current[i] = n)} aria-hidden="true">{p.name}</span>
      ))}

      {ok && gh !== null && <span className="world-label world-label--gh" ref={ghLabel} aria-hidden="true">Commit field · {gh}</span>}

      <div className="world-log" role="navigation" aria-label="Landmarks">
        <p>Route <b>{seen.length}/{PLACES.length}</b></p>
        <ol>
          {PLACES.map((p) => (
            <li key={p.id} className={`${seen.includes(p.id) ? 'seen' : ''} ${near === p.id ? 'here' : ''}`}>
              <button onClick={() => (ok && api.current.flyTo ? api.current.flyTo(p) : open(p.id))}><i aria-hidden="true" />{PLACES.indexOf(p) + 1}. {p.name}<span>{p.note}</span></button>
            </li>
          ))}
        </ol>
        {seen.length === PLACES.length && <p className="world-done">Every landmark found. Thanks for flying.</p>}
      </div>

      {place ? (
        <button className="world-prompt" onClick={() => open(place.id)}>
          <span>{place.id === 'github' ? 'GitHub · @Htet-Myark · one block per day' : `Stop ${PLACES.indexOf(place) + 1} of ${PLACES.length} · ${place.name}`}</span><b>{place.note}</b><em>{place.id === 'github' ? 'Press Enter or tap to open GitHub ↗' : 'Press Enter or tap to open ↓'}</em>
        </button>
      ) : (
        <p className="world-hint">{ok ? <><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> or tap the island to fly · reach a landmark to open it</> : 'The 3D world needs WebGL. Scroll down for the full site.'}</p>
      )}
    </div>
  )
}
