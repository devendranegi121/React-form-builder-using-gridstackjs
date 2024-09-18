// @flow
import * as React from 'react';
import { createPortal } from 'react-dom';


export default function RenderElements(props) {
  return (
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
  );
};
