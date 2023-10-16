import React, { useContext, useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { LabelField } from "../../../components/fields";
import ReactSelect from "../../../components/fields/ReactSelect";
import { CardLayout } from "../../../components/cards";
import PageLayout from "../../../layouts/PageLayout";
import { ThemeContext } from "../../../context/Themes";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import EventImageUploader from "../imgUploader/ImageUploader";
import data from "../../../data/master/addParking.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Anchor,
  Label,
} from "../../../components/elements";
import Breadcrumb from "../../../components/Breadcrumb";

export default function AddParking() {


  const navigate = useNavigate();
  const serverUrl = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem("token");
  const { theme } = useContext(ThemeContext);

  const [parkingData, setParkingData] = useState({
    name: "",
    description: "",
    // img: [],
    address: "",
    type: "",
    capacity: "",
    lat: "",
    long: "",
    check_in_user: "",
    check_out_user: "",
    memberWithParkingPermission: [],
  });

  const [errorMessage, setErrorMessage] = useState({
    name: "",
    description: "",
    // img: "",
    address: "",
    type: "",
    capacity: "",
    lat: "",
    long: "",
  });

  const [submitter, setSubmitter] = useState("Submit");

  const handleOnChange = (e) => {
    const { name } = e.target;
    setErrorMessage((prevErrors) => ({ ...prevErrors, [name]: "" }));
    setParkingData((prevValue) => ({ ...prevValue, [name]: e.target.value }));
  };

  //// STYLING
  const crossBtn_style = {
    color: theme === "dark_mode" ? "white" : "black",
    fontWeight: "900",
    fontSize: "15px",
    padding: "2px 6px",
  };

  const errorTxt = {
    fontSize: "11px",
    padding: "2px 0px",
    color: "#940e1d",
    position: "absolute",
  };

  const validateForm = () => {
    const errors = {};

    if (!parkingData.name) {
      errors.name = "Parking Name is required.";
    }
    if (parkingData.description.length < 10) {
      errors.description = "Description is required.";
    }
    if (!parkingData.address) {
      errors.address = "Address is required";
    }
    if (!parkingData.type) {
      errors.type = "Parking Type is required";
    }
    if (!parkingData.capacity) {
      errors.capacity = "Capacity is required.";
    }
    if (!parkingData.lat) {
      errors.lat = "Latitude is required.";
    }
    if (!parkingData.long) {
      errors.long = "Longitude is required.";
    }
    // if (!parkingData.img.length > 0) {
    //   errors.img = "Event Image required.";
    // }
    setErrorMessage(errors);
    return Object.keys(errors).length === 0;
  };



  const HandleParkingSubmit = async (e) => {
    e.preventDefault();

    const isFormValid = validateForm();


    if (isFormValid) {
      try {
        setSubmitter("Submitting...");
        const headers = {
          token: token,
        };
        const formData = new FormData();
        formData.append("name", parkingData.name);
        formData.append("description", parkingData.description);
        // for (let i = 0; i < parkingData.img.length; i++) {
        //   formData.append('img', parkingData.img[i]);
        // }
        formData.append("address", parkingData.address);
        formData.append("type", parkingData.type);
        formData.append("capacity", parkingData.capacity);
        formData.append("lat", parkingData.lat);
        formData.append("long", parkingData.long);
        if(parkingData.check_in_user){
          formData.append("check_in_user", parkingData.check_in_user);
        }
        if(parkingData.check_out_user){
          formData.append("check_out_user", parkingData.check_out_user);
        }
        console.log(formData, " data to be sent");

        const response = await axios.post(`${serverUrl}/park/add`, formData, {
          headers,
        });
        if (response.status === 200) {
          setSubmitter("Submit");
          toast.success(response.data.result);
          setTimeout(() => {
            console.log("Message", response.data);
            // window.location.href = "/parking";
            navigate("/all-parking")
          }, 2000);
        }
      } catch (error) {
        
        setSubmitter("Submit");
        if (error.response) {
          const { status } = error.response;
          switch (status) {
            case 403:
              toast.error("Parking Name is Already Exist");
              break;
            // case 405:
            //   toast.error("Unable to log in");
            //   break;
            // case 401:
            //   toast.error("Email and mobile not authorized");
            //   break;
            // case 406:
            //   toast.error("Email or Password Invalid");
            //   break;
            default:
              toast.error("An error occurred");
              break;
          }
        }
      }
    } else {
      toast.warn("Please fill the All required fields");
    }
  };





  // const getUploadedImageFile = (imageAsInput) => {
  //   setParkingData((prevData) => ({ ...prevData, img: imageAsInput }));
  // };



  const [selectAdminForCheckIn, setSelectAdminForCheckIn] =
    useState("Select");
    
  const [selectAdminForCheckOut, setSelectAdminForCheckOut] =
  useState("Select");

  useEffect(() => {
    if (token) {
      const headers = { token: token };
      const fetchMemberWithParkingPermission = async () => {
        try {
          const response = await axios.get(
            `${serverUrl}/profile/getAllAdmin`,
            {
              headers,
            }
          );
          console.log("MemberWithParkingPermission", response.data);

          // Assuming response.data.permissionList is an array
          const memberArray = response.data.map((member) => ({
            ...member,
            value: member.name,
            label: member.name,
          }));

          setParkingData((prevData) => ({
            ...prevData,
            memberWithParkingPermission: memberArray,
          }));

          // const memberArray = response.data;

          // setParkingData((prevData) => ({
          //   ...prevData,
          //   memberWithParkingPermission: memberArray,
          // }));
        } catch (error) {
          console.log(error, "error");
        }
      };
      fetchMemberWithParkingPermission();
    }
  }, []);




  const getOptionLabel = (option) => `${option.name}`;
  
  const getNormalOptionlabel = (option) => `${option.value}`;





  const handleOptionChange = (selectedOption , isCheckInSelected, isCheckOutSelected) => {

console.log(selectedOption, isCheckInSelected, isCheckOutSelected,"selectedOption , isCheckInSelected, isCheckOutSelected")
  
if(isCheckInSelected){
 setSelectAdminForCheckIn(selectedOption); // Update the selected option
    if (selectedOption) {
      setParkingData((prevData) => ({
        ...prevData,
        check_in_user: selectedOption._id,
      }));
    }
  }

  if(isCheckOutSelected){
    setSelectAdminForCheckOut(selectedOption); // Update the selected option
    if (selectedOption) {
      setParkingData((prevData) => ({
        ...prevData,
        check_out_user: selectedOption._id,
      }));
    }
  }
   
  };



  const handleSelect = (selectedOption) => {
    setSelectAdminForCheckIn(selectedOption); // Update the selected option
    if (selectedOption) {
      setErrorMessage((prevData) => ({
        ...prevData,
        type: "",
      }));
      setParkingData((prevData) => ({
        ...prevData,
        type: selectedOption.value,
      }));
    }
  };


  console.log(parkingData,'parkingdata')
  return (
    <>
      <PageLayout>
        <Row>
          <Col xl={12} style={{ margin: "20px auto" }}>
            <CardLayout>
              <Breadcrumb title={data?.pageTitle}>
                {data?.breadcrumb.map((item, index) => (
                  <li key={index} className="mc-breadcrumb-item">
                    {item.path ? (
                      <Anchor className="mc-breadcrumb-link" href={item.path}>
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
          <Col xl={7} style={{ margin: "0 auto" }}>
            <CardLayout>
              <div className="header d-flex justify-content-between align-items-center">
                <h5 className="opacity-0">Add Parking</h5>
                <button
                  className="btn btn-sm btn-circle absolute"
                  style={crossBtn_style}
                  onClick={() => navigate("/all-parking")}
                >
                  ✕
                </button>
              </div>
              <Row>
                <Col xl={6}>
                  <LabelField
                    onChange={handleOnChange}
                    type="text"
                    label="Parking Name"
                    name="name"
                    value={parkingData.name}
                    placeholder="Enter Parking Name"
                    fieldSize="w-100 h-md"
                  />
                  {errorMessage.name && (
                    <p style={errorTxt}>{errorMessage.name}</p>
                  )}
                </Col>

                <Col xl={6}>
                  <LabelField
                    onChange={handleOnChange}
                    type="number"
                    label="Capacity"
                    name="capacity"
                    value={parkingData.capacity}
                    onKeyPress={(event) =>
                      !/[0-9]/.test(event.key) && event.preventDefault()
                    }
                    placeholder="Enter Capacity"
                    fieldSize="w-100 h-md"
                  />
                  {errorMessage.capacity && (
                    <p style={errorTxt}>{errorMessage.capacity}</p>
                  )}
                </Col>

                <Col xl={12}>
                  <Box className=" d-flex flex-column justify-content-start gap-2">
                    <Label className="mc-label-field-title">Desription</Label>
                    <textarea
                      placeholder="Input your text...."
                      name="description"
                      rows="4"
                      value={parkingData.description}
                      className="mc-label-field-textarea "
                      onChange={handleOnChange}
                    ></textarea>
                  </Box>
                  {errorMessage.description && (
                    <p style={errorTxt}>{errorMessage.description}</p>
                  )}
                </Col>
                <Col xl={6}>
                  <LabelField
                    onChange={handleOnChange}
                    type="text"
                    label="parking address"
                    name="address"
                    value={parkingData.address}
                    placeholder="Enter Address"
                    fieldSize="w-100 h-md"
                  />
                  {errorMessage.address && (
                    <p style={errorTxt}>{errorMessage.address}</p>
                  )}
                </Col>
                <Col xl={6}>
                  <ReactSelect
                    label="Parking Type"
                    type="Normal_Select"
                    defaultValue={parkingData.type}
                    onChange={handleSelect} // Use the custom change handler
                    options={["free"]}
                    getOptionLabel={getNormalOptionlabel}
                  />
                   {errorMessage.type && (
                    <p style={errorTxt}>{errorMessage.type}</p>
                  )}
                </Col>
               
                {/* <Col xl={6}>
                  <LabelField
                    name="type"
                    onChange={handleOnChange}
                    value={parkingData.type}
                    label="Event Type"
                    option={["Select", "free"]}
                    fieldSize="w-100 h-md"
                  />
                  {errorMessage.type && (
                    <p style={errorTxt}>{errorMessage.type}</p>
                  )}
                </Col> */}
               
                <Col xl={6}>
                  <LabelField
                    onChange={handleOnChange}
                    type="number"
                    label="Latitude"
                    name="lat"
                    value={parkingData.lat}
                    placeholder="Enter latitude "
                    fieldSize="w-100 h-md"
                    onKeyPress={(event) =>
                      !/^[0-9.]$/.test(event.key) && event.preventDefault()
                    }
                  />
                  {errorMessage.lat && (
                    <p style={errorTxt}>{errorMessage.lat}</p>
                  )}
                </Col>
                <Col xl={6}>
                  <LabelField
                    onChange={handleOnChange}
                    type="number"
                    label="Longitude"
                    name="long"
                    value={parkingData.long}
                    placeholder="Enter Longitude"
                    fieldSize="w-100 h-md"
                    onKeyPress={(event) =>
                      !/^[0-9.]$/.test(event.key) && event.preventDefault()
                    }
                  />
                  {errorMessage.long && (
                    <p style={errorTxt}>{errorMessage.long}</p>
                  )}
                </Col>
                <Col xl={6}>
                  <ReactSelect
                    label="Check In "
                    defaultValue={selectAdminForCheckIn}
                    onChange={(e)=>handleOptionChange(e, true, false)} // Use the custom change handler
                    // Use the custom change handler
                    options={parkingData.memberWithParkingPermission}
                    getOptionLabel={getOptionLabel}
                  />
                </Col>
                <Col xl={6}>
                  <ReactSelect
                    label="Check Out"
                    defaultValue={selectAdminForCheckOut}
                    onChange={(e)=>handleOptionChange(e, false, true)} // Use the custom change handler
                    options={parkingData.memberWithParkingPermission}
                    getOptionLabel={getOptionLabel}
                  />
                </Col>
               
                {/* <Col xl={6}>
                  <span className="mc-label-field-title">Parking Image </span>
                  <div
                    style={{ height: "45px" }}
                    className="checkbox-container d-flex  gap-3 flex-row-reverse align-items-center mt-2 mc-label-field-input"
                  >
                    <EventImageUploader
                      imgArrayLimit={1}
                      getUploadedImageFile={getUploadedImageFile}
                    />
                  </div>
                  {errorMessage.img && (
                    <p style={errorTxt}>{errorMessage.img}</p>
                  )}
                </Col> */}


                <Col xl={12}>
               
                <div style={{ height: "45px" }} className=" d-flex justify-content-center ">
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
                    onClick={HandleParkingSubmit}
                  >
                    {submitter}
                  </button>
                </div>
              </Col>
              </Row>
            </CardLayout>
          </Col>
        </Row>
        <ToastContainer
        />
      </PageLayout>
    </>
  );
}
