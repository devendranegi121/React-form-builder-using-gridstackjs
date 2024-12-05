import React, { useState } from 'react';

const CustomHeaderComponent = (props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newHeaderName, setNewHeaderName] = useState(props.displayName);
const alphabat= ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
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

  console.log("props", props)
  const colIndex = props.api.getAllDisplayedColumns().indexOf(props.column); // Get the column index

  return (
    <div onClick={!isEditing ? handleHeaderClick : undefined} className='header-title'>
        <span className='colId'>{ colIndex > 0 ? alphabat[colIndex] : ""}</span>
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
