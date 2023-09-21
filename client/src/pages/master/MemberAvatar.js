import React,{useState} from 'react';
import './MemberAvatart.css'
import {AiOutlineFileAdd} from 'react-icons/ai'

export default function MemberAvatar({setProfileImg}) {


    const [profiletoshow, setProfiletoShow] = useState();

  const handleFileChange = (event) => {
    setProfileImg(event.target.files[0]);
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
                    <img src={profiletoshow} alt="" />
                {/* </div> */}
                <span className="img_add">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    required
                    name="profilePic"
                  />
                </span>
                <span className="add_svg">
                  <AiOutlineFileAdd />
                </span>
            </div>
    
    </>
  )
}
