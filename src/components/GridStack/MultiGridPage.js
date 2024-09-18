import React, { useState, useEffect, useRef } from 'react';
import { GridStack } from 'gridstack';
import 'gridstack/dist/gridstack.min.css'; // Include GridStack styles
import ReactDOMServer from 'react-dom/server';
import TextField from '../TextField';
import TextArea from '../TextArea';
import NestedGrid from './NestedGrid';

const MultiGridPage = () => {
  const [grids, setGrids] = useState([]);
  const gridInstances = useRef({}); // Store GridStack instances here
  const gridContainerRef = useRef();

  // Function to add 3 new grids
  const addGrids = () => {
    const newGrids = [
      { id: grids.length + 1 },
      { id: grids.length + 2 },
      { id: grids.length + 3 },
    ];
    setGrids([...grids, ...newGrids]);
  };

  // Function to handle drop event in GridComponent
  const handleDrop = (event, gridId) => {
    event.preventDefault();
    const elementData = event.dataTransfer.getData('application/json');

    console.log('Dropped Element:', elementData, 'in Grid:', gridId);
    let componentHtml =''
     if (elementData) {
       const element = JSON.parse(elementData);
        componentHtml = ReactDOMServer.renderToString(
         element.type === 'TextField' ? <TextField label={element.label} id={element.id} /> :
         element.type === 'TextArea' ? <TextArea label={element.label} id={element.id} /> :
         element.type === 'NestedGrid' ? <NestedGrid id={element.id} /> : null
       );
 
       
    const grid = gridInstances.current[gridId]; // Get the GridStack instance
    if (grid) {
      grid.addWidget({
        content: componentHtml,
        x: 0,
        y: 0,
        w:  12,
        h:  1, // Adjust height if needed
        autoPosition: true,
        subGridDynamic: true
      });
    }
     }
    }

  // Initialize GridStack after the grids are added to the DOM
  useEffect(() => {
    if (gridContainerRef.current) {
      const gridElements = gridContainerRef.current.querySelectorAll('.grid');
      gridElements.forEach((gridElement) => {
        const gridId = gridElement.getAttribute('id'); // Get the grid's ID
        const gridInstance = GridStack.init({ cellHeight: 100 }, gridElement);

        // Store the instance in the ref using the grid ID
        gridInstances.current[gridId] = gridInstance;
      });
    }
  }, [grids]);

  return (
    <div>
      <button onClick={addGrids}>Add 3 Grids</button>

      {/* GridContainer */}
      <div className="multi-grid-container" ref={gridContainerRef}>
        {grids.map((grid) => (
          <div
            key={grid.id}
            id={`grid-${grid.id}`}
            className="grid"
            style={{ margin: '10px', border: '1px solid #ccc', padding: '10px', minHeight:"100px" }}
            onDragOver={(e) => e.preventDefault()}  // Allow drop
            onDrop={(e) => handleDrop(e, `grid-${grid.id}`)}  // Handle drop
          >
            {/* GridStack will initialize this div as a grid */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiGridPage;
