import React, { useState } from "react";
import "./ProfileImageUploader.css";
import { AiOutlineFileAdd } from "react-icons/ai";
import data from "../../../data/master/memberAvatart.json";

export default function MemberAvatar({ getUploadedImageFile }) {
  const [profiletoshow, setProfiletoShow] = useState();

  const handleFileChange = (event) => {
    getUploadedImageFile(event.target.files[0]);
    const reader = new FileReader();
    reader.onload = () => {
      setProfiletoShow(reader.result);
    };
    reader.readAsDataURL(event.target.files[0]);
  };

  return (
    <>
      <div className="userImg">
        {/* <div className="imgbody"> */}
        {profiletoshow ? (
          <img src={profiletoshow} alt="" />
        ) : (
          <img src={data.profile.src} alt="" />
        )}
        <span className="img_add">
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            required
            name="imageAsInput"
          />
        </span>
        <span className="add_svg">
          <AiOutlineFileAdd />
        </span>
      </div>
    </>
  );
}
