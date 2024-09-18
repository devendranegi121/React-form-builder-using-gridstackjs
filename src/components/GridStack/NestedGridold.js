// NestedGrid.js
import React, { useRef, useEffect, useState } from 'react';
import { GridStack } from 'gridstack';
import 'gridstack/dist/gridstack.min.css';
import TextField from '../TextField';
import TextArea from '../TextArea';
import ReactDOMServer from 'react-dom/server';

const NestedGrid = ({ id }) => {
  const gridRef = useRef(null);
  const [grid, setGrid] = useState(null);

  useEffect(() => {
    const gridInstance = GridStack.init({
      float: true,
      cellHeight: 200,
      verticalMargin: 10,
      acceptWidgets: true,
      subGridDynamic: true,
      float: true,
    }, gridRef.current);

    setGrid(gridInstance);

    return () => {
      gridInstance.destroy(false);
    };
  }, []);

  const handleDrop = (event) => {

    event.preventDefault();
    event.stopPropagation();
    console.log("handleDrop calling 1")

    const elementData = event.dataTransfer.getData('application/json');
    if (elementData && grid) {
      const element = JSON.parse(elementData);
      const componentHtml = ReactDOMServer.renderToString(
        element.type === 'TextField' ? <TextField label={element.label} id={element.id} /> :
        element.type === 'TextArea' ? <TextArea label={element.label} name="dddddddddd" id={element.id} /> : null
      );

      grid.addWidget({
        content: componentHtml,
        x: 0,
        y: 0,
        w: 12,
        h: 1,
        autoPosition: true,
      });
    }
  };

  return (
    <div
      ref={gridRef}
      className="grid-stack sssss"
      id={`nested-grid-${id}`}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
    </div>
  );
};

export default NestedGrid;
