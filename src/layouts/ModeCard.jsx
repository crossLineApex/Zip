const ModeCard = ({classMode, title, description, ctaA, ctaB, icon }) => (
  <article className={`mode-card ${classMode === 'zip-flip' ? 'zip-flip' : classMode === 'zip-dot' ? 'zip-dot' : ''}`}>
    {icon && (
      <div className="mode-icon" aria-hidden="true">
        {icon}
      </div>
    )}
    <h3>{title}</h3>
    <p>{description}</p>
  
  </article>
);

export default ModeCard;
