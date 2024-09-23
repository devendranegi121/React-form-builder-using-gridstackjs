// @flow
import * as React from 'react';

 

export default function EditCommonelement({ selectedElement, onUpdate }) {
    const element= selectedElement.data;
    const {properties}= element;
console.log("selectedElement", selectedElement)
  const propertiesList = {
    TextField: {
      required: false,
      label: "Input label",
      placeholder: "",
      value:"",
      showLabel:true
    },
    // You can extend this for other types like TextArea, Checkbox, etc.
    TextArea: {
      required: false,
      defaultValue: "",
      rows: 3
    },
    
  };

  // Handle input change for properties
  const handlePropertyChange = (property, value) => {
    const udpatedProperties= { ...properties, [property]: value}
    const updatedElement = {
      ...selectedElement,
      data: { ...element, properties: udpatedProperties}
    };
    console.log("updatedElement", updatedElement)
    onUpdate(updatedElement);
  };
   console.log("propertiesList", propertiesList)
   console.log("properties", properties)
   console.log("propertiesList[element.type]", propertiesList[element.type])
  return (
    <div className='app-edit-element'>
      <p className='app-title'>Edit Properties</p>
      {Object.keys(propertiesList[element.type]).map((property) => (
        <div key={property} className={`input-property ${property} ${typeof propertiesList[element.type][property] === 'boolean' ? 'input-grouped': ''}`}>
          <label>{property}</label>
          {typeof propertiesList[element.type][property] === 'boolean' ? (
            <input
              type="checkbox"
              checked={!!properties[property]}
              onChange={(e) => handlePropertyChange(property, e.target.checked)}
            />
          ) : (
            <input
              type="text"
              value={properties[property] || propertiesList[element.type][property]}
              onChange={(e) => handlePropertyChange(property, e.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  );
}