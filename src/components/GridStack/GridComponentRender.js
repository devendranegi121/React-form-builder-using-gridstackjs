import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GridStack } from 'gridstack';
import 'gridstack/dist/gridstack.min.css';
import TextField from '../TextField';
import TextArea from '../TextArea';
import NestedGrid from './NestedGrid';
import TableDyanamic from '../TableDyanamic';
import EiditElements from './EiditElements';
import { createPortal } from 'react-dom';
import EditCommonelement from './EditCommonelement';
import CustomHeaderComponent from './CustomHeaderComponent ';

const GridComponentRender = () => {
  const gridRef = useRef(null);
  const [grid, setGrid] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [widgetsMap, setWidgetsMap] = useState([]);

  const [columnDefs, setColumnDefs] = useState([
    // { headerName: 'Drag', rowDrag: true, lockPosition: true, width: 77, maxWidth: 77, resizable: false },
    { headerName: 'col1', field: 'col1',  lockPosition: true, valueFormatter: params => params.value.value , 
       headerComponent: CustomHeaderComponent,
       headerComponentParams: {}
      },
    { headerName: 'col2', field: 'col2',  lockPosition: true, valueFormatter: params => params.value.value, 
      headerComponent: CustomHeaderComponent },
  ]);

  const newColumn=  { headerName: 'col2', field: 'col2',  lockPosition: true, valueFormatter: params => params.value?.value, 
    headerComponent: CustomHeaderComponent }

  const [rowData, setRowData] = useState([
    { col1: { value: 1, formula: '' }, col2: { value: 2, formula: '' }, col3: { value: 0, formula: '' } },
    { col1: { value: 2, formula: '' }, col2: { value: 5, formula: '' }, col3: { value: 0, formula: '' } },
  ]);

  const [selectedCell, setSelectedCell] = useState(); // Default formula

  const initializeGrid = useCallback(() => {
    const gridInstance = GridStack.init({
      float: true,
      cellHeight: 100,
      verticalMargin: 5,
      disableOneColumnMode: true,
      acceptWidgets: true,
      handle: '.drag-header',
      disableDrag: false 
    }, gridRef.current);

    setGrid(gridInstance);

    // Optional: Add event listener for debugging
    gridInstance.on('dragstart', (event) => {
      const target = event.target.closest('.drag-header');
      if (target) {
        console.log('Dragging started on:', target);
      }
    });

    return () => {
      gridInstance.destroy(false);
    };
  }, []);

  useEffect(() => {
    return initializeGrid();
  }, [initializeGrid]);

  const handleDrop = (event) => {
    event.preventDefault();
  
    const elementData = event.dataTransfer.getData('application/json');
    if (elementData && grid) {
      const element = JSON.parse(elementData);
      const elementId = `E${Math.floor(1000 + Math.random() * 9000)}`;
      element.id = elementId;
  
      // Get mouse position on drop
      const mouseX = event.clientX;
      const mouseY = event.clientY;
  
      // Convert mouse position to grid coordinates
      const cell = grid.getCellFromPixel({left: mouseX, top: mouseY});
      const x = cell ? cell.x : 0;
      const y = cell ? cell.y : 0;
  
      const widgetOptions = {
        id: elementId,
        x: x,  // Set the x value based on drop location
        y: y,  // Set the y value based on drop location
        w: element.type === 'NestedGrid' ? 4 : element.type === 'TableDyanamic' ? 12 : 6,
        h: element.type === 'NestedGrid' ? 2 : element.type === 'TableDyanamic' ? 5 : 1,
        autoPosition: false,  // Disable auto positioning since we are specifying x and y
      };
  
      // Add the grid-stack-item with the calculated x and y positions
      grid.addWidget(`
        <div class="grid-stack-item" 
             gs-w="${widgetOptions.w}" 
             gs-h="${widgetOptions.h}" 
             gs-x="${widgetOptions.x}" 
             gs-y="${widgetOptions.y}" 
             data-id="${elementId}">
          <div class="grid-stack-item-content">
            <div class="drag-header"></div>
            <div id="content-${elementId}" class="grid-element"></div>
          </div>
        </div>
      `);
  
      // Update React's state to trigger the portal rendering inside the correct grid-stack-item-content
      setWidgetsMap((prevMap) => [
        ...prevMap,
        { id: elementId, type: element.type, data: element }
      ]);
    }
  };
  
  const onSelectElement = (elementId, data) => {
    const selected = widgetsMap.find((w) => w.id === elementId);
    setSelectedElement(selected);
    setSelectedCell(null)
  };

  const onSelectCell = (elementId, data) => {
    const selected = widgetsMap.find((w) => w.id === elementId);
    selected.rowIndex = 1;
    data ? setSelectedCell(data) : setSelectedCell(null);

    setSelectedElement(null)
  };

  const handleUpdate = (updatedElementData) => {
    const updatedRowData = [...rowData];
    updatedRowData[selectedCell.rowIndex][selectedCell.colId] = updatedElementData;
    setRowData([...updatedRowData]);
  };

  const handleUpdateElement = (updatedElementData) => {

    const updatedElement = updatedElementData.data;
    setWidgetsMap((prevMap) =>
      prevMap.map((item) =>
        item.id === updatedElement.id ? { ...item, data: updatedElement } : item
      )
    );
    setSelectedElement(updatedElementData)
  };

  const save = () => {
    const options = grid?.save(true, true);
    document.querySelector('#saved').value = JSON.stringify(options);
  };

  // Function to calculate column values based on the formula for each row
  const calculateFormula = (row, colField) => {
    const colFormula = row[colField]?.formula || '';
    if (!colFormula) return row[colField]?.value || 0;

    try {
      const expression = colFormula.replace(/col(\d+)/g, (match, p1) => row[`col${p1}`]?.value || 0);
      const formulaFunc = new Function('return ' + expression);
      return formulaFunc();
    } catch (e) {
      console.error('Error in formula calculation:', e);
      return 0;
    }
  };

  // Function to handle formula change
  const handleFormulaChange = (event, colField, rowIndex) => {
    const newFormula = event.target.value;
    const updatedRowData = rowData.map((row, index) => {
      if (index === rowIndex) {
        const updatedRow = { ...row, [colField]: { ...row[colField], formula: newFormula } };
        updatedRow[colField].value = calculateFormula(updatedRow, colField);
        return updatedRow;
      }
      return row;
    });
    setRowData(JSON.parse(JSON.stringify(updatedRowData)));
  };

  console.log("columnDefs", columnDefs);
  
  return (
    <div className='app-form-div'>
      <div className='app-form'>
        <div className="grid-stack" ref={gridRef} onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} style={{ minHeight: '300px', border: '1px solid black' }}>
          {widgetsMap.map((rowDataNode) => {
            const { id, type, data}= rowDataNode
            const container = document.getElementById(`content-${id}`);
            return container
              ? createPortal(
                <> 
                
                  {type === 'TextField' && (
                    <TextField element={data} onElementClick={onSelectElement} />
                  )}
                  {type === 'TextArea' && (
                    <TextArea element={data} onElementClick={onSelectElement} />
                  )}
                  {type === 'TableDyanamic' && (
                    <TableDyanamic
                      element={data}
                      onElementClick={onSelectCell}
                      columnDefs={columnDefs}
                      setColumnDefs={setColumnDefs}
                      rowData={rowData}
                      setRowData={setRowData}
                      setSelectedCell={setSelectedCell}
                      selectedCell={selectedCell}
                      newColumn={newColumn}
                    />
                  )}
                  {type === 'NestedGrid' && (
                    <NestedGrid element={data} onElementClick={onSelectElement}  rowDataNode={rowDataNode} />
                  )}
                </>,
                container
              )
              : null;
          })}
        </div>
        <textarea id="saved" style={{ width: '100%' }}></textarea><br />
        <button onClick={save}>Show data</button>
      </div>

      <div className="edit-app">
        {selectedCell && (
          <EiditElements
            selectedElement={selectedElement}
            onUpdate={handleUpdate}
            columnDefs={columnDefs}
            setColumnDefs={setColumnDefs}
            rowData={rowData}
            setRowData={setRowData}
            handleFormulaChange={handleFormulaChange}
            selectedCell={selectedCell}
            widgetsMap={widgetsMap}
          />
        )}

{selectedElement && (
          <EditCommonelement
            selectedElement={selectedElement}
            onUpdate={handleUpdateElement}
             selectedCell={selectedCell}
            widgetsMap={widgetsMap}
          />
        )}
      </div>
    </div>
  );
};

export default GridComponentRender;
