import React, { useState } from 'react';
import './ToggleBtn.css';

const ToggleBtn = ({ id, initialChecked, onToggle }) => {
    
  const [isChecked, setIsChecked] = useState(initialChecked);

  const handleToggle = () => {
    setIsChecked(!isChecked);
    onToggle(id, !isChecked); // Notify the parent component about the toggle change
  };

  return (
    <div>
      <div className="bauble_box  d-flex">
        <input
          className="bauble_input "
          id={`bauble_check_${id}`} // Use a unique identifier for each checkbox
          name={`bauble_${id}`}
          type="checkbox"
          checked={isChecked}
          onChange={handleToggle}
        />
        <label className="bauble_label" htmlFor={`bauble_check_${id}`}>Toggle</label>
      </div>
    </div>
  );
};

export default ToggleBtn;
