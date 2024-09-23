import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

// Utility function to evaluate a simple formula
const evaluateFormula = (formula, data) => {
  // Replace cell references (like A1, B2) with actual values from data
  const formulaWithValues = formula.replace(/([A-Z]+)(\d+)/g, (_, col, row) => {
    const colIndex = col.charCodeAt(0) - 65; // A=0, B=1, etc.
    const rowIndex = parseInt(row, 10) - 1;
    return data[rowIndex]?.[colIndex] ?? 0;
  });

  try {
    // Evaluate the formula
    return eval(formulaWithValues);
  } catch (e) {
    return NaN; // Invalid formula
  }
};

const ExcelLikeGrid = () => {
  const [rowData, setRowData] = useState([
    { A: '', B: '', C: '' },
    { A: '', B: '', C: '' },
    { A: '', B: '', C: '' },
  ]);

  const [columnDefs] = useState([
    { headerName: 'A', field: 'A', editable: true },
    { headerName: 'B', field: 'B', editable: true },
    { headerName: 'C', field: 'C', editable: true, valueGetter: (params) => {
      const value = params.data.C;
      if (typeof value === 'string' && value.startsWith('=')) {
        return evaluateFormula(value.slice(1), rowData);
      }
      return value;
    }},
  ]);

  const onCellValueChanged = (params) => {
    const updatedData = [...rowData];
    updatedData[params.rowIndex][params.colDef.field] = params.newValue;
    setRowData(updatedData);
  };

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: 600 }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        onCellValueChanged={onCellValueChanged}
      />
    </div>
  );
};

export default ExcelLikeGrid;
