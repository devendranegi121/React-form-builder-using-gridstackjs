import React, { useState } from 'react';

const CustomHeaderComponent = (props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newHeaderName, setNewHeaderName] = useState(props.displayName);

  const handleHeaderClick = () => {
    setIsEditing(true); // Enter edit mode when header is clicked
  };

  const handleInputChange = (e) => {
    setNewHeaderName(e.target.value); // Update the input value
  };

  const handleInputBlur = () => {
    setIsEditing(false); // Exit edit mode when input loses focus
    const colDef = props.column.colDef;
    
    // Update the headerName in the column definitions
    colDef.headerName = newHeaderName;
    props.api.refreshHeader(); // Force the grid to re-render the header
  };

  return (
    <div onClick={!isEditing ? handleHeaderClick : undefined} style={{ cursor: 'pointer' }}>
      {isEditing ? (
        <input
          type="text"
          value={newHeaderName}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          autoFocus
        />
      ) : (
        newHeaderName
      )}
    </div>
  );
};

export default CustomHeaderComponent;
