import React, { useEffect, useState } from 'react'

const USER = 'Htet-Myark'
const API = `https://github-contributions-api.jogruber.de/v4/${USER}?y=last`

const parseDay = (iso) => new Date(`${iso}T00:00:00`)

/* The hero strip and the Projects card want the same year of data, so fetch it
   once per page load and hand the same promise to every instance. */
let request = null
function loadDays() {
  request ||= fetch(API)
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.status))))
    .then((d) => d.contributions ?? [])
  return request
}

/* Pad the run of days so every column starts on a Sunday, then slice into weeks. */
function toWeeks(days) {
  const cells = [...Array(parseDay(days[0].date).getDay()).fill(null), ...days]
  const weeks = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  return weeks
}

const lastDay = (week) => [...week].reverse().find(Boolean)

/* A label sits over the column whose week contains the 1st of that month, which
   is why the month is read off the week's last day: keying off its first day
   instead pushes every label a column to the right, since the week a month
   starts in almost always begins in the month before.

   Then any label with less than `minGap` columns before the next one is
   dropped. A label is ~20px wide against a 10px column pitch, so it needs three
   columns of clearance, and the window opens mid-month — only ever a stub of a
   leading month can be that close, so the fuller month after it is the one to
   keep. No two real month starts are within three weeks of each other. */
function monthLabels(weeks, minGap = 3) {
  const changes = []
  let previous = null
  weeks.forEach((week, i) => {
    const day = lastDay(week)
    if (!day) return
    const date = parseDay(day.date)
    if (date.getMonth() === previous) return
    previous = date.getMonth()
    changes.push([i, date.toLocaleDateString('en-US', { month: 'short' })])
  })

  const labels = weeks.map(() => '')
  changes.forEach(([i, text], n) => {
    const next = changes[n + 1]
    if (next && next[0] - i < minGap) return
    labels[i] = text
  })
  return labels
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

/* `weeks` trims the graph to that many trailing weeks (default: the full year).
   `compact` is the hero variant — tighter, two stats, no legend. */
export default function GitHubActivity({ weeks: weekCount = null, compact = false, className = '' }) {
  const [days, setDays] = useState(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let alive = true
    loadDays()
      .then((d) => { if (alive) setDays(d) })
      .catch(() => { if (alive) setFailed(true) })
    return () => { alive = false }
  }, [])

  /* A third-party outage shouldn't leave a broken panel on the page. */
  if (failed) return null

  const allWeeks = days?.length ? toWeeks(days) : []
  const weeks = weekCount ? allWeeks.slice(-weekCount) : allWeeks
  const labels = monthLabels(weeks)

  /* Stats describe the window on screen, not the year behind it. */
  const shownDays = weeks.flat().filter(Boolean)
  const total = shownDays.reduce((sum, d) => sum + d.count, 0)
  const { current, longest } = shownDays.length ? streaks(shownDays) : { current: 0, longest: 0 }
  const period = !weekCount
    ? 'the last year'
    : weekCount >= 8
      ? `the last ${Math.round(weekCount / 4.345)} months`
      : `the last ${weekCount} weeks`

  return (
    <div className={['gh-card', compact && 'gh-card--compact', className].filter(Boolean).join(' ')}>
      <div className="card-core">
        <div className="gh-head">
          <span className="gh-title">{compact ? 'Recent activity' : 'Contribution activity'}</span>
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
          <span><strong>{total.toLocaleString('en-US')}</strong> in {period}</span>
          <span><strong>{current}</strong>-day current streak</span>
          {!compact && <span><strong>{longest}</strong>-day longest streak</span>}
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
                aria-label={`GitHub contribution graph: ${total} contributions in ${period}`}
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

        {!compact && (
          <div className="gh-legend" aria-hidden="true">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((l) => <i className={`gh-day lvl-${l}`} key={l} />)}
            <span>More</span>
          </div>
        )}
      </div>
    </div>
  )
}
