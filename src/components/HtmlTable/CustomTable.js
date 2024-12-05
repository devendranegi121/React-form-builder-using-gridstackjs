import React, { useEffect, useRef } from 'react';
import './CustomTable.css';

const CustomTable = (props) => {
  const { rowData = [], columnDefs = [] , showTotalTable} = props;
  const tableRef = useRef(null);

  const makeResizable = () => {
    const table = tableRef.current;
    const headers = table.querySelectorAll('th');

    headers.forEach((header, index) => {
      const resizer = document.createElement('div');
      resizer.classList.add('resizer');
      header.appendChild(resizer);

      let startX, startWidth;

      const onMouseMove = (event) => {
        event.preventDefault(); // Prevent text selection
        const newWidth = startWidth + (event.pageX - startX);

        // Set a minimum width to avoid making the column too small
        if (newWidth > 30) {
          const oldWidth = header.style?.width;
          header.style.width = `${newWidth}px`;
          const changeWidht = oldWidth - newWidth;
          headers[headers.length - 1].style.width = headers[headers.length - 1].style?.width + changeWidht
          table.querySelectorAll(`td:nth-child(${index + 1})`).forEach((cell) => {
            cell.style.width = `${newWidth}px`;
          });
        }
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      resizer.addEventListener('mousedown', (e) => {
        startX = e.pageX;
        startWidth = header.offsetWidth;
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });
    });
  };

  useEffect(() => {
    makeResizable();
  }, []);

  return (
    <div className="table-container">
      <table ref={tableRef}>
        <thead>
          <tr>
            {columnDefs.map((column, index) => (
              <th key={index} style={{ width: column.width || '150px', position: 'relative' }}>
                {column.headerName}
                <div className="resizer" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rowData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columnDefs.map((column, colIndex) => (
                <td key={colIndex} style={{ width: column.width || '150px' }}>
                  {row[column.field]}
                </td>
              ))}
            </tr>
          ))}
          {showTotalTable && 
          <tr>
            <td colSpan={columnDefs.length-1}>Total</td>
            <td>123</td>
            </tr>}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;
