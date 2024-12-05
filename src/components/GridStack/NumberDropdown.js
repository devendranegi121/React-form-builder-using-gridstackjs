import React from 'react';

const NumberDropdown = (props) => {
  const { handleChange, value, property } = props;

  // Create an array of options from 1 to 10
  const options = Array.from({ length: 10 }, (_, i) => ({
    value: i + 1,
    label: i + 1,
  }));

  // Handle the change event
  const handleChangeData = (e) => {
    console.log("Selected:", e.target.value); // e.target.value contains the selected value
    handleChange(e, property, parseInt(e.target.value)); // Pass the selected value to parent
  };

  return (
    <div style={{ width: 200 }}>
      <select
        name={property}
        value={value}
        onChange={handleChangeData}
        placeholder="Select a number"
      >
        <option value="" disabled>Select a number</option> {/* Placeholder option */}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default NumberDropdown;
