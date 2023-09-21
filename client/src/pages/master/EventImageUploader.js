import React,{useState} from 'react';
import './EventImageUploader.css'
import {AiOutlineFileAdd} from 'react-icons/ai'

export default function EventImageUploader({setProfileImg}) {


    const [eventImage, setEventImage] = useState();

  const handleFileChange = (event) => {
    setProfileImg(event.target.files[0]);
    const reader = new FileReader();
    reader.onload = () => {
        setEventImage(reader.result);
    };
    reader.readAsDataURL(event.target.files[0]);
  };
      
  return (
    <>
            <div className="eventImg">
                {/* <div className="imgbody"> */}
                    <img src={eventImage} alt="" />
                {/* </div> */}
                <span className="img_input">
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
