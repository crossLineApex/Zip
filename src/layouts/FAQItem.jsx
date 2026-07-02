import { useState } from 'react';

const FAQItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`faq-item ${open ? 'open' : ''}`}>
      <button className="faq-q" onClick={() => setOpen((prev) => !prev)}>
        <span>{question}</span>
        <span className="plus" aria-hidden="true"></span>
      </button>
      <div className="faq-a">
        <div className="faq-a-inner">{answer}</div>
      </div>
    </div>
  );
};

export default FAQItem;
