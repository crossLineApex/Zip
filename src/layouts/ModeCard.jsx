const ModeCard = ({ title, description, ctaA, ctaB, icon }) => (
  <article className="mode-card">
    <div className="mode-icon" aria-hidden="true">
      {icon}
    </div>
    <h3>{title}</h3>
    <p>{description}</p>
    <div className="mode-select">
      <a className="mode-pill a" href="#daily">{ctaA}</a>
      <a className="mode-pill b" href="#daily">{ctaB}</a>
    </div>
  </article>
);

export default ModeCard;
