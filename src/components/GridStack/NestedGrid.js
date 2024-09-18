import React, { useEffect, useRef } from 'react';
import { GridStack } from 'gridstack';
import 'gridstack/dist/gridstack.min.css';

const NestedGrid = ({ id }) => {
  const nestedGridRef = useRef(null);

  useEffect(() => {
    if (nestedGridRef.current) {
      const gridInstance = GridStack.init({
        float: true,
        cellHeight: 100,
        verticalMargin: 5,
        acceptWidgets: true,
      }, nestedGridRef.current);

      return () => {
        gridInstance.destroy(false);
      };
    }
  }, []);

  return (
    <div 
      className="grid-stack nested-grid" 
      ref={nestedGridRef}
      style={{ minHeight: '200px', border: '1px solid gray' }}
    >
    </div>
  );
};

export default NestedGrid;
