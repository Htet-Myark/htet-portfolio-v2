import React, { useEffect, useRef, useState } from 'react'

/* A circuit-board trace down the left margin that draws itself as you scroll.
   It runs from section to section; at each section heading there is a node
   that lights up and sends a short branch to the heading once the trace
   reaches it. A faint copy of the full route sits underneath so you can see
   where it is heading. Geometry is measured from the real sections, so it
   follows the layout as content loads or the window resizes.
   Hidden on narrow screens (no margin to draw in); drawn in full, without
   animation, under prefers-reduced-motion. */

const TIP = 0.62          // where the trace tip sits, as a fraction of the viewport height
const JOG = 14            // sideways offset of the chamfered jogs between nodes
const MIN_WIDTH = 1100    // below this there is no margin for the trace

function measure(main) {
  const mainBox = main.getBoundingClientRect()
  const heads = [...main.querySelectorAll('section .section-head')]
  if (!heads.length) return null

  const first = heads[0].getBoundingClientRect()
  const left = first.left - mainBox.left
  const x = Math.max(18, left - 44)                 // trunk sits in the margin
  const top = (el) => el.getBoundingClientRect().top - mainBox.top

  const nodes = heads.map((h) => {
    const eyebrow = h.querySelector('.section-eyebrow') ?? h
    const box = eyebrow.getBoundingClientRect()
    return { y: top(eyebrow) + box.height / 2, to: box.left - mainBox.left - 12 }
  })

  /* trunk: starts above the first node, ends a little past the last one,
     with a 45° jog out and back halfway between every pair of nodes */
  const start = Math.max(0, nodes[0].y - 160)
  const end = nodes[nodes.length - 1].y + 220
  let d = `M ${x} ${start}`
  nodes.forEach((n, i) => {
    d += ` L ${x} ${n.y}`
    const next = nodes[i + 1]?.y ?? end
    const mid = (n.y + next) / 2
    if (next - n.y > 4 * JOG + 80) {
      d += ` L ${x} ${mid - 2 * JOG} L ${x + JOG} ${mid - JOG} L ${x + JOG} ${mid + JOG} L ${x} ${mid + 2 * JOG}`
    }
  })
  d += ` L ${x} ${end}`

  return { d, x, nodes, height: main.scrollHeight, start, end }
}

export default function CircuitTrace() {
  const svgRef = useRef(null)
  const pathRef = useRef(null)
  const tipRef = useRef(null)
  const [geo, setGeo] = useState(null)
  const [reached, setReached] = useState(-1)

  /* measure the layout, and again whenever it changes size */
  useEffect(() => {
    const main = svgRef.current?.parentElement
    if (!main) return
    let raf = 0
    const update = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        setGeo(window.innerWidth >= MIN_WIDTH ? measure(main) : null)
      })
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(main)
    window.addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [])

  /* draw the trace up to the scroll position */
  useEffect(() => {
    const path = pathRef.current
    const svg = svgRef.current
    if (!geo || !path || !svg) return

    const total = path.getTotalLength()
    // length-at-y lookup: the route only ever moves downwards
    const samples = []
    for (let i = 0; i <= 400; i++) {
      const len = (total * i) / 400
      samples.push([len, path.getPointAtLength(len).y])
    }
    const lengthAt = (y) => {
      if (y <= samples[0][1]) return 0
      for (let i = 1; i < samples.length; i++) {
        const [l1, y1] = samples[i]
        if (y1 >= y) {
          const [l0, y0] = samples[i - 1]
          return y1 === y0 ? l1 : l0 + ((y - y0) / (y1 - y0)) * (l1 - l0)
        }
      }
      return total
    }

    path.style.strokeDasharray = `${total}`
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      path.style.strokeDashoffset = '0'
      setReached(geo.nodes.length - 1)
      if (tipRef.current) tipRef.current.style.opacity = '0'
      return
    }

    let frame = 0
    let lastReached = -2
    const tick = () => {
      frame = 0
      const mainTop = svg.getBoundingClientRect().top
      const tipY = window.innerHeight * TIP - mainTop
      const len = lengthAt(tipY)
      path.style.strokeDashoffset = `${total - len}`

      const p = path.getPointAtLength(len)
      const tip = tipRef.current
      if (tip) {
        tip.setAttribute('cx', p.x)
        tip.setAttribute('cy', p.y)
        tip.style.opacity = len > 0 && len < total ? '1' : '0'
      }

      let r = -1
      geo.nodes.forEach((n, i) => { if (tipY >= n.y) r = i })
      if (r !== lastReached) { lastReached = r; setReached(r) }
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(tick) }
    tick()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [geo])

  return (
    <svg
      ref={svgRef}
      className="circuit-trace"
      aria-hidden="true"
      width="100%"
      height={geo?.height ?? 0}
      style={{ display: geo ? 'block' : 'none' }}
    >
      {geo && (
        <>
          <path className="circuit-track" d={geo.d} />
          <path ref={pathRef} className="circuit-line" d={geo.d} />
          {geo.nodes.map((n, i) => (
            <g key={i} className={`circuit-node${i <= reached ? ' is-on' : ''}`}>
              <line className="circuit-branch" x1={geo.x} y1={n.y} x2={n.to} y2={n.y}
                style={{ '--len': `${Math.max(0, n.to - geo.x)}px` }} />
              <circle className="circuit-pad" cx={n.to} cy={n.y} r="3" />
              <circle className="circuit-via" cx={geo.x} cy={n.y} r="6" />
            </g>
          ))}
          <circle ref={tipRef} className="circuit-tip" r="4" cx={geo.x} cy={geo.start} />
        </>
      )}
    </svg>
  )
}
