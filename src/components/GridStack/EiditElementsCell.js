import { useEffect, useState } from "react";

export default function EiditElementsCell(props) {
    const { selectedTable, onUpdate, handleFormulaChange, selectedCell, rowData } = props;
    const alphabat = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
    let type = 'cell';
    

    // Ensure element is defined properly
    const element = selectedCell ? rowData[selectedCell.rowIndex][selectedCell.colId] : {};
    console.log("selectedCell", selectedCell)
    console.log("element", element)
    const [inputType, setInputType]= useState('value')

    const [propertiesList, setPropertiesList] = useState({
        cell: {
            value: 0,
            formula: "", // Formula input field for dynamic table
        },

    });

    useEffect(() => {
        element &&
            setPropertiesList({ cell: element })
    }, [element])

    // Handle input change for value and formula
    const handlePropertyChange = (property, displayValue, type) => {
        let value= displayValue;
         if(type==='number' && value){
            value= parseInt(value)
         }
         
        const updatedProperties = { ...element, [property]: value };
        onUpdate(updatedProperties);

        if (property === 'formula') {
            // Call handleFormulaChange when the formula changes
            handleFormulaChange({ target: { value } }, selectedCell.colId, selectedCell.rowIndex);
        }
    };

    const updateTableProperty = (e, property, value) => {
        console.log("value", value)
        propertiesList[type] = { ...propertiesList[type], [property]: value }
        setPropertiesList({
            ...propertiesList, [type]: propertiesList[type]
        })
        props.handleSubmit(e, propertiesList[type])
    }

    return (
        <div className='app-edit-element'>
            <p className='app-title'>Edit Properties for table</p>
            {selectedCell && <>
                <p><strong>Selected  {alphabat[selectedCell.colIndex - 1]}{selectedCell.rowIndex + 1}</strong></p>
            </>}

            <select onChange={(e)=>setInputType(e.target.value)}>
                <option value={'value'}>value</option>
                <option value={'formula'}>formula</option>
            </select>

            {Object.keys(propertiesList[type]).map((property) => (
                property=== inputType &&
                <div key={property} className={`input-property ${property} ${typeof propertiesList[type][property] === 'boolean' ? 'input-grouped' : ''}`}>
                    {<>
                        <label>{property}</label>
                        {typeof propertiesList[type][property] === 'boolean' ? (
                            <input
                                type="checkbox"
                                checked={selectedCell ? !!element[property] : !!propertiesList[type][property]}
                                onChange={(e) => selectedCell ? handlePropertyChange(property, e.target.checked, 'checkbox') : updateTableProperty(e, property, !propertiesList[type][property])}
                            />
                        ) : typeof propertiesList[type][property] === 'number' ?(
                            <input
                                type="number"
                                value={propertiesList[type][property]}
                                onChange={(e) => selectedCell ? handlePropertyChange(property, e.target.value, 'number') : updateTableProperty(e, property, e.target.value)}
                            />
                        ) : (
                            <input
                                type="text"
                                value={propertiesList[type][property]}
                                onChange={(e) => selectedCell ? handlePropertyChange(property, e.target.value, 'text') : updateTableProperty(e, property, e.target.value)}
                            />
                        )}
                    </>
                    }
                </div>
            ))}
        </div>
    );
}
