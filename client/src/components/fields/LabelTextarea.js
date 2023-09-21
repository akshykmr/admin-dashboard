import React from "react";
import { Box, Label, Textarea } from "../elements";

export default function LabelTextarea({
  name,
  value,
  onChange,
  label,
  labelDir,
  fieldSize,
  placeholder,
}) {
  return (
    <Box
      className={`mc-label-field-group ${label ? labelDir || "label-col" : ""}`}
    >
      {label && <Label className="mc-label-field-title">{label}</Label>}
      <Textarea
        name={name}
        value={value}
        onChange={onChange}
        className={`mc-label-field-textarea ${fieldSize || "w-md h-text-md"}`}
        placeholder={placeholder || "Type here..."}
      ></Textarea>
    </Box>
  );
}
