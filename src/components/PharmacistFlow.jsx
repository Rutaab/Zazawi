import { STEPS } from '../data/pharmacist.js'

export default function PharmacistFlow({
  step,
  title,
  subtitle,
  onBack,
  onNext,
  nextLabel = 'Continue',
  nextIcon = 'arrow_forward',
  nextDisabled = false,
  footerNote,
  secondary,
  children,
}) {
  return (
    <div className="flow-page ph-page">
      <header className="flow-header ph-header">
        <button className="icon-btn" aria-label="Back" onClick={onBack}>
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="ph-header-titles">
          {subtitle && <small>{subtitle}</small>}
          <h1>{title}</h1>
        </div>
        <span className="pill pill-primary ph-step-pill">Step {step} of 3</span>
      </header>

      <div className="ph-stepper" aria-label="Registration progress">
        {STEPS.map((s, i) => {
          const n = i + 1
          const state = n < step ? 'done' : n === step ? 'active' : 'todo'
          return (
            <div key={s.id} className={`ph-step ${state}`}>
              <span className="ph-step-dot">
                {state === 'done' ? (
                  <span className="material-symbols-outlined">check</span>
                ) : (
                  n
                )}
              </span>
              <span className="ph-step-label">{s.label}</span>
              {n < STEPS.length && <span className="ph-step-line" />}
            </div>
          )
        })}
      </div>

      <div className="flow-body ph-body">{children}</div>

      <div className="flow-footer ph-footer">
        {footerNote && <p className="ph-footer-note">{footerNote}</p>}
        {secondary}
        <button
          className="btn btn-primary btn-block"
          onClick={onNext}
          disabled={nextDisabled}
        >
          {nextLabel}
          <span className="material-symbols-outlined">{nextIcon}</span>
        </button>
      </div>
    </div>
  )
}
