import { useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useCommunity } from '../context/CommunityContext.jsx'
import { getCommunity } from '../data/communities.js'

export default function NewPost() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { user } = useAuth()
  const { addPost, communities, membership, toggleJoin } = useCommunity()

  const [communityId, setCommunityId] = useState(() => {
    const fromQuery = params.get('community')
    return getCommunity(fromQuery) ? fromQuery : ''
  })
  const [text, setText] = useState('')
  const [image, setImage] = useState(null)
  const fileRef = useRef(null)

  const community = getCommunity(communityId)
  const joined = communityId ? !!membership[communityId] : false
  const canPost = !!text.trim() && !!communityId

  function onFile(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (image) URL.revokeObjectURL(image.url)
    setImage({ url: URL.createObjectURL(file), name: file.name })
  }

  function submit() {
    const trimmed = text.trim()
    if (!trimmed || !communityId) return
    addPost({ communityId, text: trimmed, image: image?.url || null })
    navigate(`/community/${communityId}`)
  }

  return (
    <div className="flow-page">
      <header className="flow-header">
        <button
          className="icon-btn"
          aria-label="Back"
          onClick={() => navigate(-1)}
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1>New Post</h1>
        <button
          className="btn btn-primary post-submit"
          disabled={!canPost}
          onClick={submit}
        >
          Post
        </button>
      </header>

      <div className="flow-body">
        <div className="card form-card">
          <div className="post-head">
            <span className="avatar">
              {user ? user.name.charAt(0).toUpperCase() : 'G'}
            </span>
            <div className="post-who">
              <strong>{user ? user.name : 'Guest'}</strong>
              <small>
                {community
                  ? `Posting to ${community.name}`
                  : 'Choose a community to post in'}
              </small>
            </div>
          </div>

          <div className="np-communities" role="radiogroup" aria-label="Choose a community">
            {communities.map((c) => {
              const active = c.id === communityId
              const isJoined = !!membership[c.id]
              return (
                <button
                  key={c.id}
                  role="radio"
                  aria-checked={active}
                  className={`np-chip${active ? ' on' : ''}`}
                  onClick={() => setCommunityId(c.id)}
                >
                  <span className={`cm-icon tone-${c.tone}`}>
                    <span className="material-symbols-outlined">{c.icon}</span>
                  </span>
                  <span className="np-chip-text">
                    <strong>{c.name}</strong>
                    <small>{isJoined ? 'Joined' : c.tag}</small>
                  </span>
                </button>
              )
            })}
          </div>

          {community && !joined && (
            <button
              className="np-join-hint"
              onClick={() => toggleJoin(communityId)}
            >
              <span className="material-symbols-outlined">info</span>
              You haven&apos;t joined {community.name}. Tap to join before posting.
            </button>
          )}

          <textarea
            className="post-textarea"
            rows="6"
            placeholder={
              community
                ? `Share something with ${community.name}…`
                : 'Select a community, then share a health tip, question or review…'
            }
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          {image && (
            <div className="post-preview">
              <img src={image.url} alt={image.name} />
              <button
                className="icon-btn post-preview-x"
                aria-label="Remove image"
                onClick={() => {
                  URL.revokeObjectURL(image.url)
                  setImage(null)
                }}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          )}

          <div className="post-tools">
            <button
              className="post-tool"
              onClick={() => fileRef.current?.click()}
            >
              <span className="material-symbols-outlined">photo_camera</span>
              Photo
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={onFile}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
