import React, { useState, useCallback, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const TableDynamic = ({onElementClick, element, formula ,selectedCell,
  columnDefs, setColumnDefs, rowData, setRowData, newColumn}) => {


  const gridRef = useRef(null);

  // Grid ready handler
  const onGridReady = useCallback((params) => {
    gridRef.current = params.api;
    restoreGridState();
  }, []);

  // Function to handle cell value changes
  const onCellValueChanged = useCallback((params) => {
    const updatedRowData = rowData.map((row, index) => {
       if (index === params.node.rowIndex) {
        const updatedRow = { ...row, [params.column.colId]: { ...row[params.column.colId], value: params.newValue } };
        updatedRow.col3 = {
          ...updatedRow.col3,
          value: calculateFormula(updatedRow)
        };
        return updatedRow;
      }
      return row;
    });
    setRowData(updatedRowData);
  }, [rowData, formula]);

  // Function to calculate col3 based on the formula
  const calculateFormula = (row) => {
    try {
      // Replace col1, col2, etc. with their values
      const expression = formula.replace(/col(\d+)/g, (match, p1) => row[`col${p1}`]?.value || 0);
      // Safely evaluate the expression
      const formulaFunc = new Function('return ' + expression);
      return formulaFunc();
    } catch (e) {
      console.error('Error in formula calculation:', e);
      return 0;
    }
  };

 

  // Function to add a new row
  const addRow = useCallback(() => {
    const newRow = {};
    columnDefs.forEach(colDef => {
      if (colDef.field) {
        newRow[colDef.field] =   { value: '', formula: '' };
      }
    });
    setRowData([...rowData, newRow]);
  }, [columnDefs, rowData, formula]);

  // Function to add a new column 
  const addColumn = () => {
    const newColField = `col${columnDefs.length+1}`;
    const newCol = {...newColumn, headerName: `Column ${columnDefs.length + 1}`, field: newColField, };
    setColumnDefs([...columnDefs, newCol]);

    // Add new field to all existing rows
    setRowData(rowData.map(row => ({
      ...row,
      [newColField]: { value: 0, formula: '' }
    })));
  } ;

  // Save the grid state to localStorage
  const saveGridState = useCallback(() => {
    if (gridRef.current) {
      const columnState = gridRef.current.getColumnState();
      localStorage.setItem('columnState', JSON.stringify(columnState));
    }
  }, []);

  // Restore the grid state from localStorage
  const restoreGridState = useCallback(() => {
    if (gridRef.current) {
      const savedColumnState = JSON.parse(localStorage.getItem('columnState'));
      if (savedColumnState) {
        gridRef.current.applyColumnState({
          state: savedColumnState,
          applyOrder: true
        });
      }
    }
  }, []);

  // Function to get all grid data
  const getAllGridData = useCallback(() => {
    if (gridRef.current) {
      const rowData = [];
      gridRef.current.forEachNode((node) => {
        rowData.push(node.data);
      });
      console.log("rowData", rowData)
    }
  }, []);

   // Optionally, you can use this function to style the selected row
   const getRowStyle = (params) => {
    if (selectedCell && selectedCell.rowIndex === params.node.rowIndex) {
      return { backgroundColor: '#d3f4ff' }; // Highlight the row when selected
    }
    return null;
  };

  // Cell class rules to highlight the selected column
  const cellClassRules = {
    'highlighted-column': (params) => {
       return selectedCell && selectedCell.colId === params.column.colId && selectedCell.rowIndex === params.rowIndex // Highlight selected column
    }
  };

  
  // Function to handle cell clicks
  const onCellClicked = (params) => { 
    const selectedRowIndex = params.node.rowIndex; // Row index of the clicked cell
    const selectedColId = params.column.colId;     // Column ID of the clicked cell
    const selectedData = params.data[selectedColId]; // Data of the clicked cell

    // Update selected row and column
    onElementClick(element.id, {
      rowIndex: selectedRowIndex,
      colId: selectedColId,
      cellData: selectedData
    });

  };

  return (
    <>
        {/* <div className='drag-header'>Drag</div> */}
      <div>
        
        <button onClick={getAllGridData}>Get All Grid Data</button>
      </div>
      {/* <button className='right-top' onClick={()=>onElementClick(element.id)}>Edit</button> */}
      <div className="ag-theme-alpine" style={{ height: 300, width: "100%" }}>
        <AgGridReact
          columnDefs={columnDefs}
          rowData={
            rowData.map(row => {
              let rowDataMapped = {};
              columnDefs.forEach(colDef => {
                const fieldName = colDef.field; // Get the column field name dynamically
                if (row[fieldName]) {
                  rowDataMapped[fieldName] = row[fieldName].value; // Dynamically map the values
                }
              });
              return rowDataMapped;
            })
          }
          defaultColDef={{
            flex: 1,
            editable: false,
            resizable: true,
            sortable: false,
            suppressMovable: false,
            cellClassRules: cellClassRules,
            headerComponentParams: {
              template:
                '<div class="ag-header-cell" role="presentation">' +
                '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
                '    <span ref="eText" class="ag-header-cell-text">ds</span>' +
                '  </div>' +
                '</div>',
              onClick: (event) => {
                console.log('Header cell clicked', event);
              },
            }
          }}
          rowDragManaged={true}
          animateRows={true}
          onGridReady={onGridReady}
          ref={gridRef}
          className="table-grid"
          onCellClicked={onCellClicked} // Handle cell click
          getRowStyle={getRowStyle} // Highlight the selected row
          onCellValueChanged={onCellValueChanged} // Handle cell value changes
        />

 

      </div>
      <div className="action-btn">
        <button onClick={addRow}>Add Row</button>
        <button onClick={addColumn}>Add Column</button>
        <button onClick={saveGridState}>Save Grid State</button>
      </div>
    </>
  );
};

export default TableDynamic;
