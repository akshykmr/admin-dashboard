import React, { useContext } from "react";
import { ThemeContext } from "../../context/Themes";
import Select from "react-select";

export default function ReactSelect({
  label,
  defaultValue,
  onChange,
  options,
  getOptionLabel,
  type,
  value
}) {
  const { theme } = useContext(ThemeContext);

  // const getOptionLabel = (option) => `${option.name}`;

  const customStyles = {
    // Customize the styles for the selected option
    menu: (provided) => ({
      ...provided,
      backgroundColor: theme === "dark_mode" ? "#1b2b4d" : "#f0f0f0", // Set the background color of the dropdown
      border: theme === "dark_mode" ? "1px solid #233355" : "1px solid #e5e5e5",
      fontSize: "14px",
      fontweight: "500",
      borderRadius: "4px", // Add rounded corners
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor:
        state.isSelected && theme === "dark_mode"
          ? "transparent"
          : "transparent",
      color: theme === "dark_mode" ? "white" : "#1f1f1f",
      ":hover": {
        backgroundColor: theme === "dark_mode" ? "#2a4275" : "#dfdfdf",
        color: theme === "dark_mode" ? "white" : "#1f1f1f",
      },
    }),
    control: (baseStyles, state) => ({
      ...baseStyles,
      borderRadius: "8px",
      height: "45px",
      fontSize: "14px",
      color: "green",
      background: theme === "dark_mode" ? "#1b2b4d" : "#f0f0f0",
      border: theme === "dark_mode" ? "1px solid #233355" : "1px solid #e5e5e5",
    }),
  };

  return (
    <>
      <span className="mc-label-field-title ">{label}</span>
      {type === "Normal_Select" ?
       <Select
       className="basic-single mt-2 "
       isClearable={false}
       value={value}
       defaultValue={defaultValue}
       onChange={onChange} // Use the custom change handler
       options={options.map((item) => ({
        value: item,
        label: item,
      }))}
       getOptionLabel={getOptionLabel}
       styles={customStyles}
     /> : 
     <Select
        className="basic-single mt-2 "
        isClearable={false}
        defaultValue={defaultValue}
        onChange={onChange} // Use the custom change handler
        options={options}
        getOptionLabel={getOptionLabel}
        styles={customStyles}
        value={value}
      />
      }

      
    </>
  );
}
