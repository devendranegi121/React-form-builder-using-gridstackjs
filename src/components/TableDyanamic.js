import React, { useState, useCallback, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const TableDynamic = ({onElementClick, element, formula, setFormula ,
  columnDefs, setColumnDefs, rowData, setRowData}) => {


  const gridRef = useRef(null);

  // Grid ready handler
  const onGridReady = useCallback((params) => {
    gridRef.current = params.api;
    restoreGridState();
  }, []);

  // Function to handle cell value changes
  const onCellValueChanged = useCallback((params) => {
    const updatedRowData = rowData.map((row, index) => {
      console.log(params, "params" , index)
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

  // Function to handle formula change
  const handleFormulaChange = (event) => {
    setFormula(event.target.value);
    // Recalculate col3 for all rows based on new formula
    const updatedRowData = rowData.map(row => ({
      ...row,
      col3: {
        ...row.col3,
        value: calculateFormula(row)
      }
    }));
    setRowData(updatedRowData);
  };

  // Function to add a new row
  const addRow = useCallback(() => {
    const newRow = {};
    columnDefs.forEach(colDef => {
      if (colDef.field) {
        newRow[colDef.field] = colDef.field === 'col3' ? { value: 0, formula: formula } : { value: '', formula: '' };
      }
    });
    setRowData([...rowData, newRow]);
  }, [columnDefs, rowData, formula]);

  // Function to add a new column
  const addColumn = () => {
    const newColField = `col${columnDefs.length - 1}`;
    const newCol = { headerName: `Column ${columnDefs.length + 1}`, field: newColField };
    setColumnDefs([...columnDefs, newCol]);

    // Add new field to all existing rows
    setRowData(rowData.map(row => ({
      ...row,
      [newColField]: { value: '', formula: '' }
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
      console.log('All Row Data:', rowData);
    }
  }, []);
console.log("dddddddddddddd rowData", rowData)
  return (
    <div >
      <div>
        <label>
          Formula for Column 3:
          <input
            type="text"
            value={formula}
            onChange={handleFormulaChange}
            placeholder="e.g., col1 * col2"
          />
        </label>
        <button onClick={getAllGridData}>Get All Grid Data</button>
      </div>
      <button className='right-top' onClick={()=>onElementClick(element.id)}>Edit</button>
      <div className="ag-theme-alpine" style={{ height: 300, width: "100%" }}>
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData.map(row => ({
            col1: row.col1.value,
            col2: row.col2.value,
            col3: row.col3.value
          }))} // Use values for display
          defaultColDef={{
            flex: 1,
            editable: true,
            resizable: true,
          }}
          rowDragManaged={true}
          animateRows={true}
          onGridReady={onGridReady}
          ref={gridRef}
          className="table-grid"
          onCellValueChanged={onCellValueChanged} // Handle cell value changes
        />
      </div>
      <div className="action-btn">
        <button onClick={addRow}>Add Row</button>
        <button onClick={addColumn}>Add Column</button>
        <button onClick={saveGridState}>Save Grid State</button>
      </div>
    </div>
  );
};

export default TableDynamic;
