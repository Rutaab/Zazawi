import { useCallback, useEffect, useState } from 'react'
import { timeAgo, useStatus } from '../context/StatusContext.jsx'

export default function StatusViewer({ initialUserId, onClose }) {
  const { groups, markViewed, deleteStatus } = useStatus()

  const initialIndex = Math.max(
    0,
    groups.findIndex((g) => g.userId === initialUserId),
  )
  const [gIndex, setGIndex] = useState(initialIndex)
  const [iIndex, setIIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [confirm, setConfirm] = useState(false)

  const group = groups[gIndex]
  const items = group?.items || []
  const item = items[iIndex]
  const mine = Boolean(group?.mine)

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  useEffect(() => {
    if (!groups.length) {
      onClose()
      return
    }
    if (gIndex > groups.length - 1) {
      setGIndex(groups.length - 1)
      setIIndex(0)
      return
    }
    const len = groups[gIndex]?.items.length || 0
    if (iIndex > len - 1) setIIndex(Math.max(0, len - 1))
  }, [groups, gIndex, iIndex, onClose])

  useEffect(() => {
    if (group && !group.mine && !group.viewed) markViewed(group.userId)
  }, [group, markViewed])

  const goNext = useCallback(() => {
    setPaused(false)
    if (iIndex < items.length - 1) {
      setIIndex(iIndex + 1)
      return
    }
    if (gIndex < groups.length - 1) {
      setGIndex(gIndex + 1)
      setIIndex(0)
      return
    }
    onClose()
  }, [iIndex, items.length, gIndex, groups.length, onClose])

  const goPrev = useCallback(() => {
    setPaused(false)
    if (iIndex > 0) {
      setIIndex(iIndex - 1)
      return
    }
    if (gIndex > 0) {
      const prevGroup = groups[gIndex - 1]
      setGIndex(gIndex - 1)
      setIIndex(prevGroup.items.length - 1)
      return
    }
    setIIndex(0)
  }, [iIndex, gIndex, groups])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') {
        if (confirm) setConfirm(false)
        else onClose()
        return
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        goNext()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goPrev()
      } else if (e.key === ' ' && !confirm) {
        e.preventDefault()
        setPaused((p) => !p)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [goNext, goPrev, onClose, confirm])

  if (!group || !item) return null

  const duration = item.kind === 'image' ? 6000 : 5000

  function handleDelete() {
    const lastItem = items.length === 1
    deleteStatus(item.id)
    setConfirm(false)
    if (lastItem) onClose()
  }

  return (
    <div
      className="st-viewer"
      role="dialog"
      aria-modal="true"
      aria-label={`${group.name} status`}
    >
      <div className="st-progress">
        {items.map((it, i) => (
          <span className="st-seg" key={it.id}>
            {i < iIndex && <i className="st-seg-fill done" />}
            {i === iIndex && (
              <i
                key={`${gIndex}-${iIndex}-${it.id}`}
                className={`st-seg-fill on${paused || confirm ? ' paused' : ''}`}
                style={{ animationDuration: `${duration}ms` }}
                onAnimationEnd={goNext}
              />
            )}
          </span>
        ))}
      </div>

      <header className="st-head">
        <span className={`st-avatar st-tone-${group.tone || 'teal'}`}>
          {group.initials}
        </span>
        <div className="st-who">
          <strong>{group.name}</strong>
          <small>{timeAgo(item.ts)}</small>
        </div>
        {mine && (
          <button
            className="st-icon"
            onClick={() => setConfirm(true)}
            aria-label="Delete status"
          >
            <span className="material-symbols-outlined">delete</span>
          </button>
        )}
        <button className="st-icon" onClick={onClose} aria-label="Close status">
          <span className="material-symbols-outlined">close</span>
        </button>
      </header>

      <div
        className="st-stage"
        onPointerDown={() => setPaused(true)}
        onPointerUp={() => setPaused(false)}
        onPointerLeave={() => setPaused(false)}
        onPointerCancel={() => setPaused(false)}
      >
        <button
          className="st-zone prev"
          onClick={goPrev}
          aria-label="Previous status"
        />
        <div className="st-slide" key={item.id}>
          {item.kind === 'image' ? (
            <div className="st-image-wrap">
              <img className="st-image" src={item.image} alt="" />
              {item.text && <p className="st-caption">{item.text}</p>}
            </div>
          ) : (
            <div className={`st-text st-bg-${item.bg || 'ocean'}`}>
              <p>{item.text}</p>
            </div>
          )}
        </div>
        <button
          className="st-zone next"
          onClick={goNext}
          aria-label="Next status"
        />
      </div>

      {confirm && (
        <div className="st-confirm-backdrop" onClick={() => setConfirm(false)}>
          <div
            className="st-confirm"
            role="alertdialog"
            aria-modal="true"
            aria-label="Delete status confirmation"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Delete this status?</h3>
            <p>This status will be removed for everyone. This can’t be undone.</p>
            <div className="st-confirm-actions">
              <button className="btn btn-soft" onClick={() => setConfirm(false)}>
                Cancel
              </button>
              <button className="btn st-danger" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
