import React from "react";
import { Box, Input, Label, Icon, Text } from "./elements";

export default function FileUpload({ icon, text,getUploadedImageFile }) {


    const handleUploadImage = (event) => {
        const files = event.target.files;
      
        // Iterate through each file and read it as data URL
        Array.from(files).forEach((file) => {
          const reader = new FileReader();
          reader.onload = () => {
            getUploadedImageFile({
              imgAsData: file,
              imgAsUrl: reader.result,
            });
          };
          reader.readAsDataURL(file);
        });
      };
      

    return (
        <>
            {text ?
                <Box className={`mc-file-upload ${ text ? "button" : "icon" }`}>
                    <Input type="file" id="avatar"
            onChange={handleUploadImage}
            accept="img/*"/>
                    <Label htmlFor="avatar">
                        <Icon>{ icon || "cloud_upload" }</Icon>
                        <Text as="span">{ text || "upload" }</Text>
                    </Label>
                </Box>
            :
                <Box className={`mc-file-upload ${ text ? "button" : "icon" }`}>
                    <Input type="file" id="avatar" onChange={handleUploadImage}
            accept="img/*" />
                    <Label htmlFor="avatar" className="material-icons">{ icon || "cloud_upload" }</Label>
                </Box>
            }
        </>
    )
}