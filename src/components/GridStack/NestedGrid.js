import React, { useEffect, useRef } from 'react';
import { GridStack } from 'gridstack';
import 'gridstack/dist/gridstack.min.css';

const NestedGrid = ({ id, rowDataNode }) => {
  console.log("rowDataNode", rowDataNode)
  const nestedGridRef = useRef(null);
  const gridInstanceRef = useRef(null);

 

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation()
    const elementData = event.dataTransfer.getData('application/json');
    if (elementData && gridInstanceRef.current) {
      const element = JSON.parse(elementData);
      const elementId = `E${Math.floor(1000 + Math.random() * 9000)}`;
      element.id = elementId;

      const widgetOptions = {
        id: elementId,
        x: 0,
        y: 0,
        w: 12,
        h: 1,
        autoPosition: true,
      };

      // Add the grid-stack-item without content, as React will inject the content using portals
      gridInstanceRef.current.addWidget(`<div class="grid-stack-item" gs-w="${widgetOptions.w}" gs-h="${widgetOptions.h}" gs-x="${widgetOptions.x}" gs-y="${widgetOptions.y}" data-id="${elementId}">
        <div class="grid-stack-item-content">   <div class="drag-header"> </div>
        <div id="content-${elementId}" class="grid-element"></div>
        </div>
      </div>`);

      
    }
  };

  useEffect(() => {
    if (nestedGridRef.current) {
      const gridInstance = GridStack.init({
        float: true,
        cellHeight: 100,
        verticalMargin: 5,
        acceptWidgets: true,
      }, nestedGridRef.current);

      // Store the grid instance reference to access later
      gridInstanceRef.current = gridInstance;

      return () => {
        gridInstance.destroy(false);
      };
    }
  }, []);

  return (
    <div 
      className="grid-stack nested-grid" 
      ref={nestedGridRef}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()} // Allow dropping
      style={{ minHeight: '200px', border: '1px solid gray' }}
    >
    </div>
  );
};

export default NestedGrid;
