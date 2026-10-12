import React, { useEffect, useRef, useState } from 'react'

/* Downtown Singapore at night, behind the whole page: Marina Bay, the CBD,
   the Singapore River and Gardens by the Bay, built from real OpenStreetMap
   footprints and heights (~11k building shapes). Mirror water reflects the
   skyline, bloom makes windows, street lights and crowns glow, and the
   Singapore Flyer, Supertrees and the Marina Bay Sands SkyPark are modelled
   on top. Scrolling flies the camera in from the Strait, low across the bay,
   up the river past Boat Quay and Clarke Quay, then up over the towers.

   Data: public/singapore/ (generated from OSM, © OpenStreetMap contributors,
   ODbL — credited in the footer). Units are metres on a local projection
   around Marina Bay: x = east, z = south.
   three.js loads lazily. Phones skip reflections and bloom; under
   prefers-reduced-motion one static frame is rendered instead. */

const COLORS = {
  land: '#15151b',
  park: '#0f2219',
  minor: '#22222a',
  road: '#2d2d36',
  lane: 'rgba(235, 235, 240, 0.35)',
  glow: 'rgba(255, 186, 110, 0.14)', // street-light wash on bigger roads
}

/* ---------- helpers ---------- */

function makeCanvas(w, h, draw) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  draw(c.getContext('2d'), w, h)
  return c
}

function toTex(THREE, canvas, repeat) {
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  if (repeat) tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  return tex
}

// deterministic pseudo-random per building so the city looks the same every visit
function rng(seed) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

/* ---------- ground: land, parks, roads (water is left transparent) ---------- */

function drawGround(ctx, map, size, ext, detailed) {
  const k = size / (ext * 2)
  const X = (v) => (v + ext) * k
  const poly = (rings) => {
    ctx.beginPath()
    rings.forEach((ring) => {
      ring.forEach(([x, z], i) => (i ? ctx.lineTo(X(x), X(z)) : ctx.moveTo(X(x), X(z))))
      ctx.closePath()
    })
  }
  const line = (pts) => {
    ctx.beginPath()
    pts.forEach(([x, z], i) => (i ? ctx.lineTo(X(x), X(z)) : ctx.moveTo(X(x), X(z))))
  }

  ctx.clearRect(0, 0, size, size)
  ctx.fillStyle = COLORS.land
  map.land.forEach((rings) => { poly(rings); ctx.fill('evenodd') })
  ctx.lineCap = ctx.lineJoin = 'round'

  if (!detailed) {
    ctx.strokeStyle = COLORS.glow
    map.major.forEach((r) => { ctx.lineWidth = Math.max(2, r.w * 4 * k); line(r.p); ctx.stroke() })
    ctx.strokeStyle = COLORS.road
    map.major.forEach((r) => { ctx.lineWidth = Math.max(1, r.w * k); line(r.p); ctx.stroke() })
  }

  if (detailed) {
    ctx.fillStyle = COLORS.park
    map.parks.forEach((rings) => { poly(rings); ctx.fill('evenodd') })
  }
  // bays, reservoirs and the river cut through to the mirror below
  ctx.globalCompositeOperation = 'destination-out'
  map.water.forEach((rings) => { poly(rings); ctx.fill('evenodd') })
  ctx.globalCompositeOperation = 'source-over'
  if (!detailed) return

  const big = map.roads.filter((r) => r.w >= 8)
  ctx.strokeStyle = COLORS.glow
  big.forEach((r) => { ctx.lineWidth = r.w * 3.5 * k; line(r.p); ctx.stroke() })
  map.roads.forEach((r) => {
    ctx.strokeStyle = r.w >= 8 ? COLORS.road : COLORS.minor
    ctx.lineWidth = Math.max(1, r.w * k)
    line(r.p)
    ctx.stroke()
  })
  // dashed lane markings on the wide roads
  ctx.strokeStyle = COLORS.lane
  ctx.lineWidth = Math.max(1, 0.25 * k)
  ctx.setLineDash([3 * k, 6 * k])
  big.forEach((r) => { line(r.p); ctx.stroke() })
  ctx.setLineDash([])
}

function groundPlane(THREE, map, size, ext, detailed, y) {
  const tex = toTex(THREE, makeCanvas(size, size, (ctx) => drawGround(ctx, map, size, ext, detailed)))
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(ext * 2, ext * 2),
    new THREE.MeshLambertMaterial({ map: tex, alphaTest: 0.5 }) // water = cut-out
  )
  mesh.rotation.x = -Math.PI / 2
  mesh.position.y = y
  return mesh
}

/* ---------- facades ----------
   Three façade styles, each an albedo + emissive (lit windows only) pair:
   glass towers, punched-window mid-rises, and shophouse-scale low-rise. */

function facade(THREE, kind) {
  const N = 128
  const spec = {
    tower: { cols: 8, rows: 8, wall: '#9aa9b8', pane: '#54667a', lit: 0.32, warm: 0.35, inset: 1 },
    mid: { cols: 4, rows: 4, wall: '#b9b6b0', pane: '#2a2d35', lit: 0.3, warm: 0.6, inset: 6 },
    low: { cols: 3, rows: 2, wall: '#e6e1d8', pane: '#2b2a2c', lit: 0.4, warm: 0.9, inset: 9 },
  }[kind]
  const cw = N / spec.cols
  const rh = N / spec.rows
  const lit = []
  for (let r = 0; r < spec.rows; r++) {
    for (let c = 0; c < spec.cols; c++) {
      if (Math.random() < spec.lit) lit.push([c, r, Math.random() < spec.warm ? '#ffcf86' : '#e6f1ff'])
    }
  }
  const cell = (g, c, r) => {
    const tall = kind === 'low' ? rh * 0.62 : rh - spec.inset * 2 - 2
    g.fillRect(c * cw + spec.inset, r * rh + (rh - tall) / 2, cw - spec.inset * 2, tall)
  }
  const albedo = makeCanvas(N, N, (g) => {
    g.fillStyle = spec.wall
    g.fillRect(0, 0, N, N)
    g.fillStyle = spec.pane
    for (let r = 0; r < spec.rows; r++) for (let c = 0; c < spec.cols; c++) cell(g, c, r)
    if (kind === 'tower') { // spandrel bands between floors
      g.fillStyle = 'rgba(10, 14, 20, 0.55)'
      for (let r = 0; r < spec.rows; r++) g.fillRect(0, r * rh, N, 2)
    }
  })
  const glow = makeCanvas(N, N, (g) => {
    g.fillStyle = '#000'
    g.fillRect(0, 0, N, N)
    lit.forEach(([c, r, col]) => { g.fillStyle = col; cell(g, c, r) })
  })
  return { map: toTex(THREE, albedo, true), emissiveMap: toTex(THREE, glow, true) }
}

// metres covered by one texture tile (width, height) per style
const TILE = { tower: [24, 28.8], mid: [14, 14], low: [10, 8] }
const KINDS = ['tower', 'mid', 'low']
const TINTS = {
  tower: [[0.55, 0.7, 0.85], [0.5, 0.75, 0.75], [0.7, 0.72, 0.78], [0.45, 0.55, 0.7]],
  mid: [[0.62, 0.6, 0.58], [0.55, 0.57, 0.6], [0.66, 0.62, 0.55], [0.5, 0.5, 0.52]],
  low: [[0.75, 0.55, 0.5], [0.55, 0.7, 0.6], [0.78, 0.7, 0.5], [0.55, 0.62, 0.75], [0.72, 0.66, 0.62]],
}
const CROWNS = [[0.6, 1, 0.95], [1, 1, 1], [0.75, 0.6, 1], [1, 0.82, 0.5]]

/* ---------- buildings ----------
   sg-buildings.bin: Int16 per polygon
   [nOuter, nHoles, heightDm, minHeightDm, outer xz..., (n, hole xz...)*] in 0.5 m units */
function buildCity(THREE, buf) {
  const data = new Int16Array(buf)
  const walls = KINDS.map(() => ({ pos: [], uv: [], col: [] }))
  const roof = []
  const crown = { pos: [], col: [] }
  const roofUnits = []
  const beacons = []
  let i = 0
  let id = 0

  const signedArea = (pts) => {
    let a = 0
    for (let k = 0; k < pts.length; k++) {
      const [x1, z1] = pts[k]
      const [x2, z2] = pts[(k + 1) % pts.length]
      a += x1 * z2 - x2 * z1
    }
    return a
  }

  while (i < data.length) {
    const nOuter = data[i]
    const nHoles = data[i + 1]
    const h = data[i + 2] / 10
    const mh = data[i + 3] / 10
    i += 4
    const read = (n) => {
      const pts = []
      for (let k = 0; k < n; k++) pts.push([data[i + k * 2] / 2, data[i + k * 2 + 1] / 2])
      i += n * 2
      return pts
    }
    let outer = read(nOuter)
    const holes = []
    for (let k = 0; k < nHoles; k++) { const n = data[i]; i += 1; holes.push(read(n)) }
    const rand = rng(++id * 7919)

    // outer ring negative area, holes positive -> every wall faces outward/into the courtyard
    if (signedArea(outer) > 0) outer = outer.reverse()
    holes.forEach((hole, k) => { if (signedArea(hole) < 0) holes[k] = hole.reverse() })

    const kind = h >= 60 ? 0 : h >= 20 ? 1 : 2
    const kindName = KINDS[kind]
    const tint = TINTS[kindName][Math.floor(rand() * TINTS[kindName].length)]
    const shade = 0.85 + rand() * 0.3
    const [tw, th] = TILE[kindName]
    const uOff = Math.floor(rand() * 8) // so neighbours don't share window patterns
    const w = walls[kind]

    ;[outer, ...holes].forEach((ring) => {
      let run = 0
      for (let k = 0; k < ring.length; k++) {
        const [ax, az] = ring[k]
        const [bx, bz] = ring[(k + 1) % ring.length]
        const len = Math.hypot(bx - ax, bz - az)
        const u0 = uOff + run / tw
        const u1 = uOff + (run + len) / tw
        const v0 = mh / th
        const v1 = h / th
        run += len
        w.pos.push(ax, mh, az, bx, mh, bz, bx, h, bz, ax, mh, az, bx, h, bz, ax, h, az)
        w.uv.push(u0, v0, u1, v0, u1, v1, u0, v0, u1, v1, u0, v1)
        for (let q = 0; q < 6; q++) w.col.push(tint[0] * shade, tint[1] * shade, tint[2] * shade)
      }
    })

    // roof (and a floor underneath anything that floats, like bridges between towers)
    const contour = outer.map(([x, z]) => new THREE.Vector2(x, z))
    const holeVecs = holes.map((hole) => hole.map(([x, z]) => new THREE.Vector2(x, z)))
    const all = outer.concat(...holes)
    THREE.ShapeUtils.triangulateShape(contour, holeVecs).forEach(([a, b, c]) => {
      const [ax, az] = all[a]
      let [bx, bz] = all[b]
      let [cx, cz] = all[c]
      if ((bz - az) * (cx - ax) - (bx - ax) * (cz - az) < 0) [bx, bz, cx, cz] = [cx, cz, bx, bz]
      roof.push(ax, h, az, bx, h, bz, cx, h, cz)
      if (mh > 0) roof.push(ax, mh, az, cx, mh, cz, bx, mh, bz)
    })

    // crown lighting on some towers, rooftop plant, aircraft beacons
    let cx = 0
    let cz = 0
    outer.forEach(([x, z]) => { cx += x; cz += z })
    cx /= outer.length
    cz /= outer.length
    if (h >= 80 && rand() < 0.45) {
      const col = CROWNS[Math.floor(rand() * CROWNS.length)]
      for (let k = 0; k < outer.length; k++) {
        const [ax, az] = outer[k]
        const [bx, bz] = outer[(k + 1) % outer.length]
        const grow = (x, c) => c + (x - c) * 1.012 // just proud of the façade
        const AX = grow(ax, cx), AZ = grow(az, cz), BX = grow(bx, cx), BZ = grow(bz, cz)
        const y0 = h - 2.2
        const y1 = h - 0.6
        crown.pos.push(AX, y0, AZ, BX, y0, BZ, BX, y1, BZ, AX, y0, AZ, BX, y1, BZ, AX, y1, AZ)
        for (let q = 0; q < 6; q++) crown.col.push(...col)
      }
    }
    if (h >= 35 && mh === 0) {
      const span = Math.sqrt(Math.abs(signedArea(outer)) / 2)
      if (span > 12) roofUnits.push([cx, h, cz, span * 0.35, 3 + rand() * 4])
    }
    if (h >= 150) beacons.push([cx, h + 3, cz])
  }

  const geo = (pos, uv, col) => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    if (uv) g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
    if (col) g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3))
    g.computeVertexNormals()
    return g
  }
  return {
    walls: walls.map((w) => geo(w.pos, w.uv, w.col)),
    roof: geo(roof),
    crown: geo(crown.pos, null, crown.col),
    roofUnits,
    beacons,
  }
}

/* ---------- landmarks ---------- */

function singaporeFlyer(THREE, [x, z, angle]) {
  const group = new THREE.Group()
  const R = 75
  const hubY = 165 - R
  const steel = new THREE.MeshLambertMaterial({ color: 0xbfc6cc })
  const rimGlow = new THREE.MeshBasicMaterial({ color: 0x7fe9ff })
  const capsuleGlow = new THREE.MeshBasicMaterial({ color: 0xfff1d0 })

  const wheel = new THREE.Group()
  wheel.position.y = hubY
  wheel.add(new THREE.Mesh(new THREE.TorusGeometry(R, 1.1, 8, 120), rimGlow))
  wheel.add(new THREE.Mesh(new THREE.TorusGeometry(R - 5, 0.5, 6, 120), steel))
  const spokeGeo = new THREE.CylinderGeometry(0.18, 0.18, R, 4)
  const capsuleGeo = new THREE.CapsuleGeometry(2.2, 4, 4, 8)
  for (let k = 0; k < 28; k++) {
    const a = (k / 28) * Math.PI * 2
    const spoke = new THREE.Mesh(spokeGeo, steel)
    spoke.position.set((Math.cos(a) * R) / 2, (Math.sin(a) * R) / 2, 0)
    spoke.rotation.z = a - Math.PI / 2
    wheel.add(spoke)
    const cap = new THREE.Mesh(capsuleGeo, capsuleGlow)
    cap.rotation.x = Math.PI / 2
    cap.position.set(Math.cos(a) * (R + 3), Math.sin(a) * (R + 3), 0)
    wheel.add(cap)
  }
  wheel.add(new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 14, 16).rotateX(Math.PI / 2), steel))
  group.add(wheel)

  // A-frame legs on one side of the wheel
  const legGeo = new THREE.CylinderGeometry(1.4, 2, hubY / Math.cos(0.28), 8)
  ;[-1, 1].forEach((s) => {
    const leg = new THREE.Mesh(legGeo, steel)
    leg.position.set(s * hubY * 0.14, hubY / 2, 9)
    leg.rotation.z = -s * 0.28
    group.add(leg)
  })
  group.position.set(x, 0, z)
  group.rotation.y = -angle
  return { group, tick: (dt) => { wheel.rotation.z += dt * 0.02 } }
}

function supertrees(THREE, [gx, gz]) {
  const group = new THREE.Group()
  const trunkMat = new THREE.MeshLambertMaterial({ color: 0x3a2f45, emissive: 0x6d2bd9, emissiveIntensity: 0.35 })
  const canopyMats = [0xd946ef, 0x8b5cf6, 0x22d3ee, 0xf472b6].map(
    (color) => new THREE.MeshBasicMaterial({ color, wireframe: true })
  )
  const rand = rng(42)
  const spots = [[0, 0, 50], [-38, 22, 42], [34, 28, 45], [-12, -44, 38], [46, -26, 32], [-52, -16, 28],
    [12, 52, 30], [-30, 58, 26], [58, 12, 27], [24, -62, 25], [-62, 34, 25], [70, 48, 26]]
  spots.forEach(([dx, dz, h]) => {
    const tree = new THREE.Group()
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 3.2, h, 10, 1, true), trunkMat)
    trunk.position.y = h / 2
    const mat = canopyMats[Math.floor(rand() * canopyMats.length)]
    const canopy = new THREE.Mesh(new THREE.CylinderGeometry(h * 0.32, 1.6, h * 0.22, 18, 3, true), mat)
    canopy.position.y = h + h * 0.11
    tree.add(trunk, canopy)
    tree.position.set(gx + dx, 0, gz + dz)
    group.add(tree)
  })
  // the canopies slowly cycle their colours like the nightly light show
  return {
    group,
    tick: (dt, t) => {
      canopyMats.forEach((m, k) => {
        m.color.setHSL((0.75 + 0.12 * Math.sin(t * 0.3 + k * 1.7)) % 1, 0.85, 0.6)
      })
    },
  }
}

function skyPark(THREE, [nx, nz, sx, sz]) {
  const len = Math.hypot(nx - sx, nz - sz)
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(40, 9, len),
    [new THREE.MeshLambertMaterial({ color: 0x5c6670 }), new THREE.MeshLambertMaterial({ color: 0x5c6670 }),
      new THREE.MeshLambertMaterial({ color: 0x1d3a2a, emissive: 0x0e3b2a }), // garden deck
      new THREE.MeshLambertMaterial({ color: 0x3a4148 }),
      new THREE.MeshLambertMaterial({ color: 0x5c6670 }), new THREE.MeshLambertMaterial({ color: 0x5c6670 })]
  )
  mesh.position.set((nx + sx) / 2, 197.5, (nz + sz) / 2)
  mesh.rotation.y = Math.atan2(nx - sx, nz - sz)
  const edge = new THREE.Mesh(
    new THREE.BoxGeometry(40.6, 0.8, len + 0.6),
    new THREE.MeshBasicMaterial({ color: 0xbff7ff })
  )
  edge.position.y = -4.2
  mesh.add(edge)
  return mesh
}

/* ---------- street lights + traffic ---------- */

function streetLights(THREE, roads, cap) {
  const spots = []
  roads.filter((r) => r.w >= 8).forEach((r) => {
    let carry = 0
    for (let k = 1; k < r.p.length && spots.length < cap; k++) {
      const [ax, az] = r.p[k - 1]
      const [bx, bz] = r.p[k]
      const len = Math.hypot(bx - ax, bz - az)
      const nx = -(bz - az) / (len || 1)
      const nz = (bx - ax) / (len || 1)
      for (let d = carry; d < len; d += 32) {
        const f = d / len
        const side = (spots.length % 2 ? 1 : -1) * (r.w / 2 + 1)
        spots.push([ax + (bx - ax) * f + nx * side, az + (bz - az) * f + nz * side])
      }
      carry = (carry + 32 - (len % 32)) % 32
    }
  })
  const mesh = new THREE.InstancedMesh(
    new THREE.SphereGeometry(0.7, 6, 4),
    new THREE.MeshBasicMaterial({ color: 0xffc98a }),
    Math.max(1, spots.length)
  )
  const m = new THREE.Matrix4()
  spots.forEach(([x, z], k) => mesh.setMatrixAt(k, m.makeTranslation(x, 9, z)))
  mesh.count = spots.length
  return mesh
}

function makeTraffic(THREE, scene, roads, count) {
  const lines = roads
    .filter((r) => r.w >= 6)
    .map((r) => {
      const cum = [0]
      for (let k = 1; k < r.p.length; k++) {
        cum.push(cum[k - 1] + Math.hypot(r.p[k][0] - r.p[k - 1][0], r.p[k][1] - r.p[k - 1][1]))
      }
      return { p: r.p, cum, len: cum[cum.length - 1], w: r.w }
    })
    .filter((l) => l.len > 60)
  if (!lines.length) return () => {}
  const weights = lines.map((l) => l.len * l.w * l.w)
  const total = weights.reduce((a, b) => a + b, 0)
  const pick = () => {
    let r = Math.random() * total
    for (let k = 0; k < lines.length; k++) { r -= weights[k]; if (r <= 0) return lines[k] }
    return lines[0]
  }
  const movers = Array.from({ length: count }, () => {
    const line = pick()
    return { line, s: Math.random() * line.len, dir: Math.random() < 0.5 ? 1 : -1, speed: 9 + Math.random() * 9, seg: 0 }
  })
  const geo = new THREE.BoxGeometry(1.8, 0.9, 0.9)
  const heads = new THREE.InstancedMesh(geo, new THREE.MeshBasicMaterial({ color: 0xfff6e0 }), count)
  const tails = new THREE.InstancedMesh(geo, new THREE.MeshBasicMaterial({ color: 0xff2a2a }), count)
  heads.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
  tails.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
  scene.add(heads, tails)

  const dummy = new THREE.Object3D()
  return function update(dt) {
    movers.forEach((m, k) => {
      const { line } = m
      m.s += m.dir * m.speed * dt
      if (m.s > line.len) { m.s = line.len; m.dir = -1 }
      if (m.s < 0) { m.s = 0; m.dir = 1 }
      while (m.seg < line.cum.length - 2 && line.cum[m.seg + 1] < m.s) m.seg++
      while (m.seg > 0 && line.cum[m.seg] > m.s) m.seg--
      const a = line.p[m.seg]
      const b = line.p[m.seg + 1]
      const segLen = line.cum[m.seg + 1] - line.cum[m.seg] || 1
      const f = (m.s - line.cum[m.seg]) / segLen
      const dx = ((b[0] - a[0]) / segLen) * m.dir
      const dz = ((b[1] - a[1]) / segLen) * m.dir
      // Singapore drives on the left
      const lane = line.w / 4
      const x = a[0] + (b[0] - a[0]) * f + dz * lane
      const z = a[1] + (b[1] - a[1]) * f - dx * lane
      dummy.rotation.set(0, Math.atan2(dx, dz), 0)
      dummy.position.set(x + dx * 2.1, 1, z + dz * 2.1)
      dummy.updateMatrix()
      heads.setMatrixAt(k, dummy.matrix)
      dummy.position.set(x - dx * 2.1, 1, z - dz * 2.1)
      dummy.updateMatrix()
      tails.setMatrixAt(k, dummy.matrix)
    })
    heads.instanceMatrix.needsUpdate = true
    tails.instanceMatrix.needsUpdate = true
  }
}

/* ---------- sky ---------- */

function sky(THREE, scene) {
  scene.background = toTex(THREE, makeCanvas(2, 512, (g, w, h) => {
    const grad = g.createLinearGradient(0, 0, 0, h)
    grad.addColorStop(0, '#02030a')
    grad.addColorStop(0.5, '#0a1030')
    grad.addColorStop(0.78, '#251c44')
    grad.addColorStop(1, '#5a3550') // warm light pollution on the horizon
    g.fillStyle = grad
    g.fillRect(0, 0, w, h)
  }))
  const n = 1400
  const pos = new Float32Array(n * 3)
  for (let k = 0; k < n; k++) {
    const a = Math.random() * Math.PI * 2
    const e = 0.15 + Math.random() * 1.3
    pos.set([Math.cos(a) * Math.cos(e) * 20000, Math.sin(e) * 20000, Math.sin(a) * Math.cos(e) * 20000], k * 3)
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  const stars = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffffff, size: 1.6, sizeAttenuation: false, fog: false, transparent: true, opacity: 0.8 }))
  scene.add(stars)
}

export default function CityBackground() {
  const mountRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const container = mountRef.current
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = window.innerWidth < 700
    let disposed = false
    let cleanup = () => {}

    Promise.all([
      import('three'),
      import('three/examples/jsm/objects/Reflector.js'),
      import('three/examples/jsm/postprocessing/EffectComposer.js'),
      import('three/examples/jsm/postprocessing/RenderPass.js'),
      import('three/examples/jsm/postprocessing/UnrealBloomPass.js'),
      import('three/examples/jsm/postprocessing/OutputPass.js'),
      fetch('/singapore/sg-map.json').then((r) => r.json()),
      fetch('/singapore/sg-buildings.bin').then((r) => r.arrayBuffer()),
    ]).then(([THREE, { Reflector }, { EffectComposer }, { RenderPass }, { UnrealBloomPass }, { OutputPass }, map, buildings]) => {
      if (disposed) return
      const fancy = !mobile // reflections + bloom

      const renderer = new THREE.WebGLRenderer({
        antialias: false, powerPreference: 'high-performance',
        logarithmicDepthBuffer: true, // ground layers + towers seen from 700 m up
      })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.25 : 1.5))
      container.appendChild(renderer.domElement)

      const scene = new THREE.Scene()
      sky(THREE, scene)
      scene.fog = new THREE.FogExp2(0x1c1633, 0.00017)
      scene.add(new THREE.HemisphereLight(0x8d9fe0, 0x120d18, 1.1))
      const moon = new THREE.DirectionalLight(0xc9d8ff, 0.55)
      moon.position.set(-0.5, 1, -0.4)
      scene.add(moon)

      /* water: a mirror under the cut-out ground (flat dark sea on phones) */
      let mirror = null
      if (fancy) {
        mirror = new Reflector(new THREE.PlaneGeometry(40000, 40000), {
          color: 0x55606f,
          textureWidth: Math.floor(window.innerWidth * 0.6),
          textureHeight: Math.floor(window.innerHeight * 0.6),
          clipBias: 0.003,
        })
        mirror.rotation.x = -Math.PI / 2
        mirror.position.y = -3
        scene.add(mirror)
      } else {
        const sea = new THREE.Mesh(new THREE.PlaneGeometry(40000, 40000), new THREE.MeshBasicMaterial({ color: 0x0b1424 }))
        sea.rotation.x = -Math.PI / 2
        sea.position.y = -3
        scene.add(sea)
      }

      // wide island + highways out to the horizon, sharp streets downtown
      scene.add(groundPlane(THREE, map, 2048, 14000, false, -1.5))
      scene.add(groundPlane(THREE, map, mobile ? 2048 : 4096, 3600, true, 0))

      /* buildings */
      const city = buildCity(THREE, buildings)
      KINDS.forEach((kind, k) => {
        const tex = facade(THREE, kind)
        const mat = new THREE.MeshLambertMaterial({
          map: tex.map, emissiveMap: tex.emissiveMap, emissive: 0xffffff, emissiveIntensity: 1.25, vertexColors: true,
        })
        scene.add(new THREE.Mesh(city.walls[k], mat))
      })
      scene.add(new THREE.Mesh(city.roof, new THREE.MeshLambertMaterial({ color: 0x2a2b33 })))
      scene.add(new THREE.Mesh(city.crown, new THREE.MeshBasicMaterial({ vertexColors: true })))

      const unitMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshLambertMaterial({ color: 0x3b3d46 }), Math.max(1, city.roofUnits.length))
      const m4 = new THREE.Matrix4()
      city.roofUnits.forEach(([x, y, z, s, h], k) => unitMesh.setMatrixAt(k, m4.compose(
        new THREE.Vector3(x, y + h / 2, z), new THREE.Quaternion(), new THREE.Vector3(s, h, s))))
      unitMesh.count = city.roofUnits.length
      scene.add(unitMesh)

      const beaconMat = new THREE.MeshBasicMaterial({ color: 0xff2020 })
      const beaconMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(1.4, 8, 6), beaconMat, Math.max(1, city.beacons.length))
      city.beacons.forEach(([x, y, z], k) => beaconMesh.setMatrixAt(k, m4.makeTranslation(x, y, z)))
      beaconMesh.count = city.beacons.length
      scene.add(beaconMesh)

      /* landmarks */
      const flyer = singaporeFlyer(THREE, map.landmarks.flyer)
      const trees = supertrees(THREE, map.landmarks.supertrees)
      scene.add(flyer.group, trees.group, skyPark(THREE, map.landmarks.skypark))

      scene.add(streetLights(THREE, map.roads, mobile ? 1500 : 5000))
      const traffic = makeTraffic(THREE, scene, map.roads, mobile ? 160 : 520)
      traffic(0)

      /* camera */
      const camera = new THREE.PerspectiveCamera(55, 1, 1, 40000)
      const path = new THREE.CatmullRomCurve3(map.route.map(([x, y, z]) => new THREE.Vector3(x, y, z)), false, 'centripetal')
      const ahead = new THREE.Vector3()
      const skyline = new THREE.Vector3(-420, 90, -40) // Raffles Place towers
      const mouse = { x: 0, y: 0 }

      function placeCamera(p, t) {
        const u = p * 0.96
        path.getPointAt(u, camera.position)
        path.getPointAt(u + 0.04, ahead)
        ahead.y = Math.max(0, ahead.y - 25)
        // low: look down the route; high: hold the skyline in frame
        ahead.lerp(skyline, THREE.MathUtils.smoothstep(camera.position.y, 120, 450))
        camera.position.x += Math.sin(t * 0.21) * 2.5
        camera.position.y += Math.sin(t * 0.37) * 1.2
        const reach = camera.position.distanceTo(ahead) * 0.1
        ahead.x += mouse.x * reach
        ahead.y -= mouse.y * reach * 0.5
        camera.lookAt(ahead)
      }

      /* post-processing */
      let composer = null
      if (fancy) {
        composer = new EffectComposer(renderer)
        composer.addPass(new RenderPass(scene, camera))
        composer.addPass(new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.85, 0.55, 0.62))
        composer.addPass(new OutputPass())
      }
      const draw = () => (composer ? composer.render() : renderer.render(scene, camera))

      const scrollTarget = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      }

      function resize() {
        renderer.setSize(window.innerWidth, window.innerHeight)
        composer?.setSize(window.innerWidth, window.innerHeight)
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        if (reduced) { placeCamera(0, 0); draw() }
      }
      resize()
      window.addEventListener('resize', resize)
      setReady(true)

      const disposeScene = () => {
        scene.traverse((o) => {
          o.geometry?.dispose()
          if (o.material) {
            [].concat(o.material).forEach((m) => { m.map?.dispose(); m.emissiveMap?.dispose(); m.dispose() })
          }
        })
        mirror?.dispose()
        scene.background.dispose()
        composer?.dispose()
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
        const t = clock.elapsedTime
        progress += (scrollTarget() - progress) * Math.min(1, dt * 2.2) // eased follow
        traffic(dt)
        flyer.tick(dt)
        trees.tick(dt, t)
        beaconMat.color.setRGB(Math.sin(t * 2.6) > 0.4 ? 1 : 0.12, 0.05, 0.05)
        placeCamera(progress, t)
        draw()
        frame = requestAnimationFrame(tick)
      }
      tick()

      cleanup = () => {
        cancelAnimationFrame(frame)
        window.removeEventListener('resize', resize)
        window.removeEventListener('pointermove', onMove)
        disposeScene()
      }
    }).catch((err) => console.error('Singapore background failed to load', err))

    return () => {
      disposed = true
      cleanup()
    }
  }, [])

  return <div ref={mountRef} className={`city-bg${ready ? ' is-ready' : ''}`} aria-hidden="true" />
}
