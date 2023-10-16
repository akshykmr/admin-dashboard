import React, { useState, useContext } from "react";
import { Row, Col } from "react-bootstrap";
import { CardLayout } from "../../../components/cards";
import LabelField from "../../../components/fields/LabelField";
import { Breadcrumb } from "../../../components";
import Anchor from "../../../components/elements/Anchor";
import PageLayout from "../../../layouts/PageLayout";
import data from "../../../data/master/addBanner.json";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BannerImgUploader from "../imgUploader/ImageUploader";
import { ThemeContext } from "../../../context/Themes";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Input, Box } from "../../../components/elements";

export default function AddBanner() {


  const { theme } = useContext(ThemeContext);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const serverUrl = process.env.REACT_APP_BASE_URL;

  const [homepageData, setHomepageData] = useState({
    para: "",
    img: [],
    url: "",
  });

  const [errorMessage, setErrorMessage] = useState({
    para: "",
    img: [],
    url: "",
  });





  

  const [submitter, setSubmitter] = useState("Submit");
  const [isHavingLink, setIsHavingLink] = useState(false);



  const handleOnChange = (e) => {
    const { name } = e.target;
    setErrorMessage((prevErrors) => ({ ...prevErrors, [name]: "" }));
    setHomepageData((prevValue) => ({ ...prevValue, [name]: e.target.value }));
  };



  const crossBtn_style = {
    color: theme === "dark_mode" ? "white" : "black",
    fontWeight: "900",
    fontSize: "15px",
    padding: "2px 6px",
  };

  const errotTxt = {
    fontSize: "11px",
    padding: "2px 0px",
    color: "#940e1d",
    position: "absolute"
}


  const getUploadedImageFile = (imageAsInput) => {
    setHomepageData((prevData) => ({ ...prevData, img: imageAsInput }));
  };



  const validateForm = () => {
    const errors = {};

    if (!homepageData.para) {
      errors.para = "Name is required.";
    }
    if (!homepageData.img.length > 0) {
      errors.img = "Image required.";
    }
    if(isHavingLink){
      if(!homepageData.url){
      errors.url = "Link required.";
      }
    }
    setErrorMessage(errors);
    return Object.keys(errors).length === 0;
  };




  const handleBannerSubmit = async (e) => {
    e.preventDefault();

    const isFormValid = validateForm();

    if (isFormValid) {
      try {
        setSubmitter("Submitting...");

        const headers = {
          token: token,
        };

        const formData = new FormData();
        formData.append("para", homepageData.para);
      
        for (let i = 0; i < homepageData.img.length; i++) {
          formData.append("img", homepageData.img[i]);
        }
        if (isHavingLink) {
          formData.append("url", homepageData.url);
          formData.append("is_clickable", true);

        } else {
          formData.append("is_clickable", false);
          formData.append("url", "");
        }
        console.log(formData, " Banner data to be sent");


        const response = await axios.post(`${serverUrl}/home/add`, formData, {
          headers,
        });


        if (response.status === 200) {
          setSubmitter("Submit");
          toast.success(response.data.result);
          setHomepageData({
            para: "",
            img: [],
          });
          navigate("/homepage");
        }
      } catch (error) {
        setSubmitter("Submit");
        console.error("Error:", error.response.status);
        toast.error("An error occurred");
      }
    } else {
      toast.warn("Please fill the All required fields");
    }
  };


  const handleCheckbox = (isChecked) => {
    setIsHavingLink(isChecked);
  };


  return (
    <PageLayout>
      <ToastContainer />
      <Row>
        <Col xl={12}>
          <CardLayout>
            <Breadcrumb title={data?.pageTitle}>
              {data?.breadcrumb.map((item, index) => (
                <li key={index} className="mc-breadcrumb-item">
                  {item.path ? (
                    <Anchor className="mc-breadcrumb-url" href={item.path}>
                      {item.text}
                    </Anchor>
                  ) : (
                    item.text
                  )}
                </li>
              ))}
            </Breadcrumb>
          </CardLayout>
        </Col>

        <Col xl={7} style={{ margin: "20px auto" }}>
          <CardLayout>
            <Row>
              <div className="header d-flex justify-content-between align-items-center ">
                <h5 className="opacity-0">Add a New Banner</h5>
                <button
                  className="btn btn-sm btn-circle absolute"
                  style={crossBtn_style}
                  onClick={() => navigate("/homepage")}
                >
                  ✕
                </button>
              </div>

              <Col xl={12}>
                <LabelField
                  onChange={handleOnChange}
                  type="text"
                  label="Banner Name"
                  name="para"
                  value={homepageData.para}
                  placeholder="Enter Banner Name"
                  fieldSize="w-100 h-md"
                />
                {errorMessage.para && (
                  <p style={errotTxt}>{errorMessage.para}</p>
                )}
              </Col>

              <Col xl={12}>
                <span className="mc-label-field-title">Banner Images </span>
                <div
                  style={{ height: "45px" }}
                  className="checkbox-container d-flex  gap-3 flex-row-reverse align-items-center mt-2 mc-label-field-input"
                >
                  <BannerImgUploader
                    imgArrayLimit={1}
                    getUploadedImageFile={getUploadedImageFile}
                  />
                </div>
                {errorMessage.img && (
                  <p  style={errotTxt}>{errorMessage.img}</p>
                )}
              </Col>

              <Col xl={4}>
                <Box className="mc-table-check">
                  <Input
                    type="checkbox"
                    name="allCheck"
                    checked={isHavingLink}
                    onChange={(e) => handleCheckbox(e.target.checked)}
                  />
                  <span className="mc-label-field-title">Add Link </span>
                </Box>
              </Col>

              {isHavingLink && (
                <Col xl={12}>
                  <LabelField
                    onChange={handleOnChange}
                    type="text"
                    name="url"
                    value={homepageData.url}
                    placeholder="Paste Link Here"
                    fieldSize="w-100 h-md"
                  />
                  {errorMessage.url && (
                    <p  style={errotTxt}>{errorMessage.url}</p>
                  )}
                </Col>
              )}
              <Col xl={12}>
                <div
                  style={{ height: "45px" }}
                  className=" d-flex justify-content-center "
                >
                  <button
                    className="btn normal-case btn-primary "
                    style={{
                      height: "35px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "10px auto 20px auto",
                      animation: "none",
                    }}
                    onClick={handleBannerSubmit}
                  >
                    {submitter}
                  </button>
                </div>
              </Col>
            </Row>
          </CardLayout>
        </Col>
      </Row>
    </PageLayout>
  );
}
