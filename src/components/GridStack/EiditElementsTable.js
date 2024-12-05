import { useEffect, useState } from "react";
import NumberDropdown from "./NumberDropdown";

export default function EditElementsTable(props) {

    const {columnDefs,rowData, showTotalTable, setShowTotalTable}= props;
   
    const [propertiesList, setPropertiesList] = useState({
        rows: rowData.length,
        columns: columnDefs.length,
        showTotal: false,
        totalInfo: {
            totalLabel: "Total",
            totalValue: '',
        },
    });
    const [isMounted, setIsMounted] = useState(false);

    // Effect to call handleSubmit whenever propertiesList changes
    useEffect(() => {
        console.log("propertiesList", propertiesList)
        if (isMounted) {
            props.handleSubmit(propertiesList); // Call handleSubmit with the updated state
        } else {
            setIsMounted(true); // Set isMounted to true after the first render
        }
        setShowTotalTable(propertiesList.showTotal)
    }, [propertiesList]); // Run effect whenever propertiesList or isMounted changes


    const updateTableProperty = (e, property, value) => {
        // Log the change for debugging
        console.log(`Updating ${property} to ${value}`);

        // Create a new state object with the updated property
        const updatedPropertiesList = { ...propertiesList, [property]: value };
        
        // Update the state with the new object
        setPropertiesList(updatedPropertiesList); // Update state
        
    };

    const updateTotalInfo = (e, property) => {
        const updatedTotalInfo = {
            ...propertiesList.totalInfo,
            [property]: e.target.value,
        };
        // Update the totalInfo object while keeping the other properties intact
        setPropertiesList((prevState) => ({
            ...prevState,
            totalInfo: updatedTotalInfo, // Update totalInfo
        }));
    };

    return (
        <div className='app-edit-element'>
            <p className='app-title'>Edit Properties for table</p>

            {/* Render general properties */}
            {Object.keys(propertiesList).map((property) => (
                property !== 'totalInfo' && (
                    <div key={property} className={`input-property ${property}`}>
                        <label>{property}  </label>
                        {typeof propertiesList[property] === 'boolean' ? (
                            <>
                                <input
                                    type="checkbox"
                                    //checked={propertiesList[property]}
                                    onChange={(e) => updateTableProperty(e, property, e.target.checked)} // Use e.target.checked directly
                                />
                            </>
                        ) : typeof propertiesList[property] === 'number' ? (
                            <>
                                <NumberDropdown
                                     value={propertiesList[property]}
                                     property={property}
                                     handleChange={updateTableProperty} // Use e.target.checked directly
                                />
                            </>
                        ) : (
                            <input
                                type="text"
                                value={propertiesList[property]}
                                onChange={(e) => updateTableProperty(e, property, e.target.value)}
                            />
                        )}
                    </div>
                )
            ))}

            {/* Conditionally render totalInfo if showTotal is true */}
            {propertiesList.showTotal && (
                <div>
                    <h6>Total Information</h6>
                    {Object.keys(propertiesList.totalInfo).map((property) => (
                        <div key={property} className={`input-property ${property}`}>
                            <label>{property}</label>
                            <input
                                type="text"
                                value={propertiesList.totalInfo[property]}
                                onChange={(e) => updateTotalInfo(e, property)}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
