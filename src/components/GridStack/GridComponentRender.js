import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GridStack } from 'gridstack';
import 'gridstack/dist/gridstack.min.css';
import TextField from '../TextField';
import TextArea from '../TextArea';
import NestedGrid from './NestedGrid';
import TableDyanamic from '../TableDyanamic';
import EiditElements from './EiditElements';
import { createPortal } from 'react-dom';

const GridComponentRender = () => {
  const gridRef = useRef(null);
  const [grid, setGrid] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [widgetsMap, setWidgetsMap] = useState([]);

  const [columnDefs, setColumnDefs] = useState([
    { headerName: 'Drag', rowDrag: true, lockPosition: true, width: 77, maxWidth: 77, resizable: false },
    { headerName: 'ID #', width: 77, maxWidth: 77, editable: false, valueGetter: (params) => Number(params.node.id), lockPosition: true },
    { headerName: 'col1', field: 'col1', valueFormatter: params => params.value.value },
    { headerName: 'col2', field: 'col2', valueFormatter: params => params.value.value },
    { headerName: 'col3', field: 'col3', valueFormatter: params => params.value.value }
  ]);

  const [rowData, setRowData] = useState([
    { col1: { value: 1, formula: '' }, col2: { value: 2, formula: '' }, col3: { value: 0, formula: 'col1 - col2' } },
    { col1: { value: 2, formula: '' }, col2: { value: 5, formula: '' }, col3: { value: 0, formula: 'col1 - col2' } },
  ]);

  const [formula, setFormula] = useState('col1 - col2'); // Default formula

  const initializeGrid = useCallback(() => {
    const gridInstance = GridStack.init({
      float: true,
      cellHeight: 100,
      verticalMargin: 5,
      disableOneColumnMode: true,
      acceptWidgets: true,
      handle: '.drag-header',
    }, gridRef.current);

    setGrid(gridInstance);

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
  
      const widgetOptions = {
        id: elementId,
        x: 0,
        y: 0,
        w: element.type === 'NestedGrid' ? 4 : element.type === 'TableDyanamic' ? 12 : 6,
        h: element.type === 'NestedGrid' ? 2 : element.type === 'TableDyanamic' ? 5 : 1,
        autoPosition: true,
      };
  
      // Add the grid-stack-item without content, as React will inject the content using portals
      grid.addWidget(`<div class="grid-stack-item" gs-w="${widgetOptions.w}" gs-h="${widgetOptions.h}" gs-x="${widgetOptions.x}" gs-y="${widgetOptions.y}" data-id="${elementId}">
        <div class="grid-stack-item-content" id="content-${elementId}"></div>
      </div>`);
  
      // Update React's state to trigger the portal rendering inside the correct grid-stack-item-content
      setWidgetsMap((prevMap) => [
        ...prevMap,
        { id: elementId, type: element.type, data: element }
      ]);
    }
  };  
  
  const onSelectElement = (elementId) => {
    const selected = widgetsMap.find((w) => w.id === elementId);
    setSelectedElement(selected);
  };

  const handleUpdate = (updatedElementData) => {
    const updatedElement = updatedElementData.element;
    setWidgetsMap((prevMap) =>
      prevMap.map((item) =>
        item.id === updatedElement.id ? { ...item, data: updatedElement } : item
      )
    );
  };

  const save = () => {
    const options = grid?.save(true, true);
    document.querySelector('#saved').value = JSON.stringify(options);
  };

  return (
    <div className='app-form-div'>
      <div className='app-form'>
      <div className="grid-stack" ref={gridRef} onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} style={{ minHeight: '300px', border: '1px solid black' }}>
  {widgetsMap.map(({ id, type, data }) => {
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
                onElementClick={onSelectElement}
                formula={formula}
                setFormula={setFormula}
                columnDefs={columnDefs}
                setColumnDefs={setColumnDefs}
                rowData={rowData}
                setRowData={setRowData}
              />
            )}
            {type === 'NestedGrid' && (
              <NestedGrid element={data} onElementClick={onSelectElement} />
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
        {selectedElement && (
          <EiditElements selectedElement={selectedElement} onUpdate={handleUpdate} />
        )}
      </div>
    </div>
  );
};

export default GridComponentRender;
