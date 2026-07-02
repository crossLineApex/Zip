const SectionHeading = ({ eyebrow, title, description }) => (
  <div className="section-head">
    <div className="eyebrow">{eyebrow}</div>
    <h2>{title}</h2>
    {description ? <p>{description}</p> : null}
  </div>
);

export default SectionHeading;
