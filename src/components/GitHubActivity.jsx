import React, { useEffect, useState } from 'react'

const USER = 'Htet-Myark'
const API = `https://github-contributions-api.jogruber.de/v4/${USER}?y=last`

const parseDay = (iso) => new Date(`${iso}T00:00:00`)

/* Pad the run of days so every column starts on a Sunday, then slice into weeks. */
function toWeeks(days) {
  const cells = [...Array(parseDay(days[0].date).getDay()).fill(null), ...days]
  const weeks = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  return weeks
}

/* One label per week whose month differs from the week before it. */
function monthLabels(weeks) {
  let previous = null
  return weeks.map((week) => {
    const day = week.find(Boolean)
    if (!day) return ''
    const date = parseDay(day.date)
    if (date.getMonth() === previous) return ''
    previous = date.getMonth()
    return date.toLocaleDateString('en-US', { month: 'short' })
  })
}

function streaks(days) {
  let longest = 0
  let running = 0
  days.forEach((d) => {
    running = d.count > 0 ? running + 1 : 0
    if (running > longest) longest = running
  })

  /* Today counts if it has activity, but an empty today doesn't break the run yet. */
  let current = 0
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].count > 0) current++
    else if (i !== days.length - 1) break
  }
  return { current, longest }
}

const tooltip = (day) =>
  `${day.count} contribution${day.count === 1 ? '' : 's'} · ` +
  parseDay(day.date).toLocaleDateString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  })

export default function GitHubActivity() {
  const [days, setDays] = useState(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    fetch(API, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.status))))
      .then((d) => setDays(d.contributions ?? []))
      .catch((e) => { if (e.name !== 'AbortError') setFailed(true) })
    return () => controller.abort()
  }, [])

  /* A third-party outage shouldn't leave a broken panel on the page. */
  if (failed) return null

  const weeks = days?.length ? toWeeks(days) : []
  const labels = monthLabels(weeks)
  const total = days?.reduce((sum, d) => sum + d.count, 0) ?? 0
  const { current, longest } = days?.length ? streaks(days) : { current: 0, longest: 0 }

  return (
    <div className="gh-card reveal">
      <div className="card-core">
        <div className="gh-head">
          <span className="gh-title">Contribution activity</span>
          <a
            className="gh-profile"
            href={`https://github.com/${USER}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            @{USER}
          </a>
        </div>

        <div className="gh-stats">
          <span><strong>{total.toLocaleString('en-US')}</strong> in the last year</span>
          <span><strong>{current}</strong>-day current streak</span>
          <span><strong>{longest}</strong>-day longest streak</span>
        </div>

        <div className="gh-scroll">
          {days === null ? (
            <div className="gh-skeleton" aria-hidden="true" />
          ) : (
            <>
              <div className="gh-months" aria-hidden="true">
                {labels.map((label, i) => <span className="gh-month" key={i}>{label}</span>)}
              </div>
              <div
                className="gh-grid"
                role="img"
                aria-label={`GitHub contribution graph: ${total} contributions in the last year`}
              >
                {weeks.map((week, w) => (
                  <div className="gh-week" key={w}>
                    {week.map((day, d) =>
                      day
                        ? <i className={`gh-day lvl-${day.level}`} key={d} title={tooltip(day)} />
                        : <i className="gh-day gh-day--empty" key={d} />
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="gh-legend" aria-hidden="true">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((l) => <i className={`gh-day lvl-${l}`} key={l} />)}
          <span>More</span>
        </div>
      </div>
    </div>
  )
}
