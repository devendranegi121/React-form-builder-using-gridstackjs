import React from "react";

const TextArea = ({ id, label, disabled }) => {
  return (
    <div className="textarea">
      <label htmlFor={id}>{label} <span></span></label>
      <textarea id={id} name={label} disabled={disabled} className="full-width"/>
    </div>
  );
};

export default TextArea;