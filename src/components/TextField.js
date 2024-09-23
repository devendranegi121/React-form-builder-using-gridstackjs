import React from "react";

const TextField = (props) => {
  const { element, onElementClick, widgetsMap} = props
  const {id,  disabled , properties}= element;
  const {required=false,
    placeholder= "",
    value="",
    label="Input",
    showLabel= true} = properties;
 
 
  return (
    <div className="textField" onClick={()=>onElementClick(element.id)}>
     {showLabel && <label htmlFor={id}>{label}  {required ? <span className="required">*</span> : ""}</label>}
      <input type="text" 
      id={id} 
      name={label} value={value} 
      disabled={disabled} 
      required={required} 
      className="full-width" 
      placeholder={`${placeholder} ${required ? "Required field" : ""} ` } />
    </div>
  );
};

export default TextField;