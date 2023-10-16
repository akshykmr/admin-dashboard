import React from "react";
import { Box, Input, Label, Select, Option } from "../elements";


export default function LabelField({ label, labelDir, fieldSize, name, value, onChange, option, type, placeholder, margin,...rest}) {
    return (
        <Box className={`mc-label-field-group ${ label ? labelDir || "label-col" : "" }`} style={margin && {marginTop :"5px"}}>
            {label && <Label className="mc-label-field-title">{ label }</Label>}
            {type ? 
          
                <Input 
                style={margin && {height :"45px"}}
                    type = { type || "text" } 
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder = { placeholder || "Type here..." } 
                    className = {`mc-label-field-input ${ fieldSize || "w-md h-sm" }`} 
                    { ...rest } 
                />
            :
            <Select
            className={`mc-label-field-select ${fieldSize || "w-md h-sm"}`}
            name={name 
            } // Pass the name here
            value={value} // Pass the value here
            onChange={onChange}
            {...rest}
          >
            {option.map((item, index) => (
              <Option key={index} value={item}>
                {item}
              </Option>
            ))}
          </Select>
            }
        </Box>
    )
}