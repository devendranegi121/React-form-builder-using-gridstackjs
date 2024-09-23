export default function EditElements(props) {
    const { selectedElement, onUpdate, handleFormulaChange, selectedCell, rowData } = props;

    // Ensure element is defined properly
    const element = selectedCell ? rowData[selectedCell.rowIndex][selectedCell.colId] : {};

    const propertiesList = {
        value: "",
        formula: "", // Formula input field for dynamic table
    };

    // Handle input change for value and formula
    const handlePropertyChange = (property, value) => {
        const updatedProperties = { ...element, [property]: value };
        onUpdate(updatedProperties);
        
        if (property === 'formula') {
            // Call handleFormulaChange when the formula changes
            handleFormulaChange({ target: { value } }, selectedCell.colId, selectedCell.rowIndex);
        }

       
    };

    console.log("element", element)

    return (
        <div className='app-edit-element'>
            <p className='app-title'>Edit Properties for table</p>
            {selectedCell && <>
               <p><strong>Selected Row {selectedCell.rowIndex + 1}</strong></p>
               <p><strong>Selected Col {selectedCell.colId}</strong></p>
            </>}

            {Object.keys(propertiesList).map((property) => (
                <div key={property} className={`input-property ${property} ${typeof propertiesList[property] === 'boolean' ? 'input-grouped' : ''}`}>
                    <label>{property}</label>
                    {typeof propertiesList[property] === 'boolean' ? (
                        <input
                            type="checkbox"
                            checked={!!element[property]}
                            onChange={(e) => handlePropertyChange(property, e.target.checked)}
                        />
                    ) : (
                        <input
                            type="text"
                            value={element[property] || ""}
                            onChange={(e) => handlePropertyChange(property, e.target.value)}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}
