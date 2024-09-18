import React from 'react';
import NestedGrid from './NestedGrid';

const DraggableFormElement = ({ id, element, index }) => {
  const handleDragStart = (event) => {
    const elementData = JSON.stringify(element);
    event.dataTransfer.setData('application/json', elementData);
  };

  return (
    <div
      id={id}
      draggable
      onDragStart={handleDragStart}  // Enable drag
      className='grid-stack-item'
      style={{ padding: '10px', border: '1px solid black', marginBottom: '10px' }}
    >
      {element.type === 'TextField' ? (
        <div key={index} className={`element-TextField`}>
          TextField
        </div>
      ) : element.type === 'TextArea' ? (
        <div key={index} className={`element-TextArea`}>
          TextArea
        </div>
      ): element.type === 'TableDyanamic' ? (
        <div key={index} className={`element-TableDyanamic`}>
          TableDyanamic
        </div>
      ) : element.type === 'NestedGrid' ? (
        <div key={index} className={`element-NestedGrid`}>
          <strong>Nested Grid</strong>
        </div>
      ) : null}
    </div>
  );
};

export default DraggableFormElement;
