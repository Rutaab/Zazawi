import { timeAgo, useStatus } from '../context/StatusContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function StatusBar({ onAdd, onOpen }) {
  const { user } = useAuth()
  const { groups } = useStatus()
  const mine = groups.find((g) => g.mine) || null
  const others = groups.filter((g) => !g.mine)

  const mineInitial =
    mine?.initials || user?.name?.charAt(0).toUpperCase() || 'Y'
  const mineTime = mine ? timeAgo(mine.items[mine.items.length - 1].ts) : ''

  return (
    <section className="st-tray" aria-label="Status updates">
      <div className="st-tray-head">
        <div>
          <h2>Status</h2>
          <small>Updates disappear after 24 hours</small>
        </div>
        <button className="st-tray-add" onClick={onAdd}>
          <span className="material-symbols-outlined">add</span>
          Add status
        </button>
      </div>

      <div className="st-scroll">
        <div className="st-tile st-tile-me">
          <button
            className="st-ring-btn"
            onClick={() => (mine ? onOpen('me') : onAdd())}
            aria-label={mine ? 'View my status' : 'Add a status'}
          >
            <span className={`st-ring${mine ? ' has' : ''}`}>
              <span className="st-avatar st-tone-primary">{mineInitial}</span>
            </span>
          </button>
          <button
            className="st-plus"
            onClick={onAdd}
            aria-label="Add to my status"
          >
            <span className="material-symbols-outlined">add</span>
          </button>
          <span className="st-name">My status</span>
          <small>{mine ? mineTime : 'Tap to add'}</small>
        </div>

        {others.map((g) => {
          const last = g.items[g.items.length - 1]
          return (
            <button
              key={g.userId}
              className="st-tile"
              onClick={() => onOpen(g.userId)}
              aria-label={`View ${g.name}'s status`}
            >
              <span className={`st-ring${g.viewed ? '' : ' new'}`}>
                <span className={`st-avatar st-tone-${g.tone || 'teal'}`}>
                  {g.initials}
                </span>
              </span>
              <span className="st-name">{g.name}</span>
              <small>{timeAgo(last.ts)}</small>
            </button>
          )
        })}

        {others.length === 0 && (
          <div className="st-empty">
            No other status updates in the last 24 hours.
          </div>
        )}
      </div>
    </section>
  )
}
