import React, { useEffect, useState } from "react";
import "./ImageUploader.css";
import { AiOutlineFileAdd } from "react-icons/ai";
import { IoMdRemoveCircleOutline } from "react-icons/io";


export default function ImageUploader({ getUploadedImageFile, imgArrayLimit , fetchImage }) {


  const serverUrl = process.env.REACT_APP_BASE_URL;
  const [imageUrls, setImageUrls] = useState([]);
  const [imageDataFile, setImageDataFile] = useState([]);

  // const [fetchedImageUrls, setFetchedUrls] = useState([])

  const [actionWatcher, setActionWatcher] = useState(null)


  useEffect(() => {
    if (fetchImage) {
      if (Array.isArray(fetchImage)) {
        // Handle an array of image objects
        const urls = fetchImage.map((url) => `${serverUrl}${url}`);
        setImageUrls(urls);
        setImageDataFile(fetchImage);
      } else if (typeof fetchImage === 'string') {
        // Handle a single image URL
        setImageUrls([`${serverUrl}${fetchImage}`]);
        setImageDataFile([fetchImage]);
      }
    }
  }, [fetchImage]);

  
  useEffect(()=>{
    if(actionWatcher === 1 ){
      getUploadedImageFile(imageDataFile)
    }
},[actionWatcher])

  const handleUploadImage = (event) => {
    const files = event.target.files;
    // console.log(files,'Total files Selected')
    if (files.length > imgArrayLimit) {
      alert(`You can only choose up to ${imgArrayLimit} Image.`);
      return;
    }
    const imageDataURLs = [];

    const imageDataFiles = [];

    for (let i = 0; i < files.length && i < imgArrayLimit; i++) {
      const file = files[i];

      imageDataFiles.push(files[i]);

      const reader = new FileReader();
      reader.onload = () => {
        imageDataURLs.push(reader.result);
        if (imageDataURLs.length === Math.min(files.length, imgArrayLimit)) {
          setImageUrls(imageDataURLs);
        }
      };
      reader.readAsDataURL(file);
    }
    setImageDataFile(imageDataFiles);
    setActionWatcher(1);
    setTimeout(() => {
      setActionWatcher(0);
      }, 1000);
  };


  const handleRemoveSelectedImg = (index) => {
    setImageDataFile((prevData) => prevData.filter((_, i) => i !== index));
    setImageUrls((prevData) => prevData.filter((_, i) => i !== index));
    setActionWatcher(1);
    setTimeout(() => {
    setActionWatcher(0);
    }, 1000);
  }

  // console.log(imageUrls,'imgurl');
  // console.log(imageDataFile,'imgdatafile')

  return (
    <>
      <div className="eventImg">
        <span className="img_input">
          <input
            type="file"
            onChange={handleUploadImage}
            accept="img/*"
            required
            name="imageAsInput"
            multiple
          />
        </span>
        <span className="add_svg">
          <AiOutlineFileAdd />
        </span>
      </div>
      {imageUrls.map((item, index) => (
        <div key={item} className="imgPreview">
       
           <button onClick={()=> handleRemoveSelectedImg(index)} className="remove_btn">
           <IoMdRemoveCircleOutline/>
           </button>
          <img src={item} alt="img" />
        </div>
      ))}
    </>
  );
}
