import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TextField from './TextField';
import TextArea from './TextArea';

const initialElements = [
  { id: '1', type: 'TextField', label: 'Text Field' },
  { id: '2', type: 'TextArea', label: 'Text Area' }
];

const FormBuilder = () => {
  const [formElements, setFormElements] = useState([]);

  // Handling drag event
  const onDragEnd = (result) => {
    const { destination, source } = result;

    // Check if dropped outside the droppable area
    if (!destination) return;

    // If the source and destination are different
    if (destination.droppableId === 'form-builder' && source.droppableId === 'form-elements') {
      const element = initialElements[source.index];
      setFormElements([...formElements, element]);
    }
  };

  // Remove form element from builder
  const removeElement = (index) => {
    const newFormElements = [...formElements];
    newFormElements.splice(index, 1);
    setFormElements(newFormElements);
  };

  // Render form elements based on their type
  const renderFormElement = (element, index) => {
    return (
      <div key={index} style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
        {/* Render different types of form fields */}
        {element.type === 'TextField' ? (
          <TextField key={index} id={`input-${index}`} label={element.label} />
        ) : element.type === 'TextArea' ? (
          <TextArea key={index} id={`textarea-${index}`} label={element.label} />
        ) : null}

        {/* Remove button */}
        <button
          onClick={() => removeElement(index)}
          style={{ marginLeft: '10px', padding: '5px 10px', background: '#f44336', color: '#fff', border: 'none' }}
        >
          Remove
        </button>
      </div>
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* List of draggable form elements */}
        <Droppable droppableId="form-elements">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{ padding: '1rem', border: '1px solid #ddd', width: '200px' }}
            >
              <h4>Elements</h4>
              {initialElements.map((element, index) => (
                <Draggable key={element.id} draggableId={element.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        padding: '0.5rem',
                        marginBottom: '0.5rem',
                        backgroundColor: '#f4f4f4',
                        cursor: 'grab',
                        ...provided.draggableProps.style
                      }}
                    >
                      {element.label}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {/* Droppable form builder area */}
        <Droppable droppableId="form-builder">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{
                padding: '1rem',
                border: '1px solid #ddd',
                width: '300px',
                minHeight: '400px'
              }}
            >
              <h4>Form Builder</h4>
              {formElements.map((element, index) => renderFormElement(element, index))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
};

export default FormBuilder;
