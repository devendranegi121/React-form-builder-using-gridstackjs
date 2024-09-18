// GridComponent.js
import React, { useRef, useEffect, useState } from 'react';
import { GridStack } from 'gridstack';
import 'gridstack/dist/gridstack.min.css';
import TextField from '../TextField';
import TextArea from '../TextArea';
import NestedGrid from './NestedGrid';
import ReactDOMServer from 'react-dom/server';
import TableDyanamic from '../TableDyanamic';

const GridComponent = () => {
  const gridRef = useRef(null);
  const [grid, setGrid] = useState(null);
  const cellHeight = 100;
  const margin = 5;

  const [droppedElements, setDroppedElements] = useState([]); // State to track dropped elements
  let subOptions = {
    cellHeight: cellHeight, // should be 50 - top/bottom
    column: 'auto', // size to match container. make sure to include gridstack-extra.min.css
    acceptWidgets: true, // will accept .grid-stack-item by default
    margin: margin,
    subGridDynamic: true, // make it recursive for all future sub-grids
    float: true,
  };
  useEffect(() => {
    const gridInstance = GridStack.init({
      float: true,
      cellHeight: cellHeight,
      verticalMargin: margin,
      disableOneColumnMode: true,
      acceptWidgets: true,
      subGridOpts: subOptions,
      subGridDynamic: true
    }, gridRef.current);

    setGrid(gridInstance);

    return () => {
      gridInstance.destroy();
    };
  }, []);

  const handleDrop = (event) => {
   // event.preventDefault();
    //event.stopPropagation();
  console.log("handleDrop calling 0")
    const elementData = event.dataTransfer.getData('application/json');
    if (elementData && grid) {
      const element = JSON.parse(elementData);
      const componentHtml = ReactDOMServer.renderToString(
        element.type === 'TextField' ? <TextField label={element.label} id={element.id} /> :
        element.type === 'TextArea' ? <TextArea label={element.label} id={element.id} /> :
        element.type === 'TableDyanamic' ? <TableDyanamic label={element.label} id={element.id} /> :
        element.type === 'NestedGrid' ? <NestedGrid id={element.id} /> : null
      );

      const rect = document.querySelector('.grid-stack').getBoundingClientRect();

      // Calculate x and y position
      const x = Math.floor(((event.clientX - rect.left) / (235 + margin)));
      const y = Math.floor(((event.clientY - rect.top) / (cellHeight + margin)));
     
      console.log(event.clientY, "--",rect.top, "--",cellHeight,"--", margin)
      console.log(`Dropped at x: ${x}, y: ${y}`, event      );
      console.log(event.clientX, "--",rect.left, "--",cellHeight,"--", margin)

      const widget = grid.addWidget({
        content: componentHtml,
        x: x,
        y: y,
        w: element.type === 'NestedGrid' ? 4: 4,
        h: element.type === 'NestedGrid' ? 2: (element.type === 'TableDyanamic' ? 5 : 1), // Adjust height if needed
        autoPosition: false,
        subGridDynamic: true,
      //  sizeToContent: true
      });

      // Ensure that nested grids are initialized properly
      if (element.type === 'NestedGrid') {
        const nestedGrid = widget.querySelector('.grid-stack');
        console.log("nestedGrid", nestedGrid)
        if (nestedGrid) {
          GridStack.init({
            float: true,
            cellHeight: 100,
            verticalMargin: 5,
            acceptWidgets: true,
          }, nestedGrid);
        }
      }
    }
  };

  const save =(content = true, full = true)=> {
   const  options = grid?.save(content, full);
    console.log(options);
    document.querySelector('#saved').value = JSON.stringify(options);
  }


  return (
    <>  
    <div> add row <button>2 Column</button> <button>3 Column</button> <button>add Table</button></div>
    <div className="sidebar" style={{height:"50px", padding: "0"}}>
        <div className="grid-stack-item" gs-w="2" gs-h="2">
          <div className="grid-stack-item-content">Drag nested</div>
        </div>
      </div>  
    <div
      className="grid-stack"
      ref={gridRef}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      style={{ minHeight: '300px', border: '1px solid black' }}
    >
    </div>
    <textarea id="saved" style={{width:"100%"}}></textarea><br></br>
    <button onClick={save}>Show data</button>
</>
  );
};

export default GridComponent;
