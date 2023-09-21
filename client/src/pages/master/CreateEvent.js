import React, { useContext, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { Anchor } from "../../components/elements";
import { LabelField } from "../../components/fields";
import { CardLayout } from "../../components/cards";
import Breadcrumb from "../../components/Breadcrumb";
import PageLayout from "../../layouts/PageLayout";
import data from "../../data/master/productUpload.json";
import { ThemeContext } from "../../context/Themes";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EventImageUploader from  './EventImageUploader'
import { ToastContainer, toast } from "react-toastify";
import { Box, Label } from "../../components/elements";

export default function ProductUpload() {
  const navigate = useNavigate();

  const serverUrl = process.env.REACT_APP_BASE_URL;

  const { theme } = useContext(ThemeContext);

  const [eventData, setEventData] = useState({
    event_name: "",
    description: "",
    images: [],
    address: "",
    type: "",
    open_time: "",
    close_time: "",
    start_date: "",
    end_date: "",
    capacity: "",
    lat: "",
    long: "",
    price: "",
  });

  const [errorMessage, setErrorMessage] = useState({
    event_name: "",
    description: "",
    images: [],
    address: "",
    type: "",
    open_time: "",
    close_time: "",
    start_date: "",
    end_date: "",
    capacity: "",
    lat: "",
    long: "",
    price: "",
  });

  const handleOnChange = (e) => {
    const { name } = e.target;
    setErrorMessage((prevErrors) => ({ ...prevErrors, [name]: "" }));
      setEventData((prevValue) => ({ ...prevValue, [name]: e.target.value }));
  };

  console.log(eventData, "=");

  //// STYLING
  const crossBtn_style = {
    color: theme === "dark_mode" ? "white" : "black",
    fontWeight: "900",
    fontSize: "15px",
    padding: "2px 6px",
  };

  const errorTxt = {
    // color: theme === "dark_mode" ? "f8d85da8" : "black",
    fontSize: "11px",
    padding: "2px 0px",
    color: "#940e1d",
    position: "absolute",
  };

  const validateForm = () => {
    const errors = {};

    if (!eventData.event_name) {
      errors.event_name = "Event Name is required.";
    }
    if (eventData.description.length < 10) {
      errors.description = "Description is required.";
    }
    if (!eventData.address) {
      errors.address = "Address is required";
    }
    if (!eventData.type) {
      errors.type = "Event Type is required";
    }
    if (!eventData.open_time) {
      errors.open_time = "Open Time is required.";
    } 
    if (!eventData.close_time) {
        errors.close_time = "Close Time is required.";
      } 
      if (!eventData.start_date) {
        errors.start_date = "Start Date is required.";
      } 
      if (!eventData.end_date) {
        errors.end_date = "End Data is required.";
      } 
      if (!eventData.capacity) {
        errors.capacity = "Capacity is required.";
      } 
      if (!eventData.lat) {
        errors.lat = "Latitude is required.";
      } 
      if (!eventData.long) {
        errors.long = "Longitude is required.";
      } 
      if (!eventData.price) {
        errors.price = "Price  is required.";
      } 
               
    // if (!eventData.Password) {
    //   errors.Password = "Password is required.";
    // } else if (!isStrongpassword(eventData.Password)) {
    //   errors.Password = "Invalid Password format.";
    // }
    // if (!eventData.ConfirmPassword) {
    //   errors.ConfirmPassword = "Confirm Password is required.";
    // } else if (!isStrongpassword(eventData.ConfirmPassword)) {
    //   errors.ConfirmPassword = "Invalid Confirm Password format.";
    // }
    // if(eventData.Password && eventData.ConfirmPassword){
    //   if (eventData.Password !== eventData.ConfirmPassword) {
    //     errors.general = "Password and Confirm Password do not match";
    //   // }  else {
    //   //   errors.general = "Passwords do not match.";
    //   }
    // }
    setErrorMessage(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    const isFormValid = validateForm();

    console.log(isFormValid);

    if (isFormValid) {
      console.log("form submitted");
      //       setCreateMember(false);
      try {
        const headers = {
          token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTA5NzFlNGEzZjAwMmNmYmQ5OTI2ODEiLCJpYXQiOjE2OTUyMDAwMDN9.Yyu3qoOQopJe9bpiIKkAfMjafSFc2aqGSbgaLG2vcR8",
        };
        //         // const formData = new FormData();
        //         // formData.append("name", eventData.event_name)
        //         // formData.append("email", eventData.address)
        //         // formData.append("phone", eventData.description)
        //         // formData.append("permission", eventData.Permissions)
        const data = {
          name: eventData.event_name,
          email: eventData.address,
          phone: eventData.description,
          permission: eventData.Permissions,
        };
        console.log(data, " data to be sent");
        const response = await axios.post(
          "https://api.kullu.dev.client.kloudlite.io/profile/add",
          data,
          { headers }
        );
        console.log(response, "response while creating user");
        if (response.status === 200) {
          toast.success(response.data.result);
          setTimeout(() => {
            console.log("Message", response.data);
            // localStorage.setItem("token", response.data.token);
            // localStorage.setItem("role", response.data.role);
            setEventData({
              event_name: "",
              address: "",
              description: "",
            });
            window.location.href = "/member-list";
          }, 1000);
        }
      } catch (error) {
        console.error("Error:", error.response.status);
        toast.error("An error occurred");
      }
    } else {
      toast.warn("Please Fill the All Fields");
      console.log("condition not fullfilled");
    }
  };

  const setProfileImg = (profilePic) => {
    setEventData((prevData) => ({ ...prevData, profilePic }));
  };

  return (
    <PageLayout>
      <Row style={{ margin: "20px 0 30px 0" }}>
        {/* <Col xl={12}>
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
        </Col> */}
        <Col xl={7} style={{ margin: "0 auto" }}>
          <CardLayout>
            <div className="header d-flex justify-content-between align-items-center mb-4">
              {/* <CardHeader title="basic information" /> */}
              <h5>Basic Information</h5>
              <ToastContainer />
              <button
                className="btn btn-sm btn-circle absolute"
                style={crossBtn_style}
                onClick={() => navigate("/events")}
              >
                ✕
              </button>
            </div>
            <div className="avatar d-flex justify-content-center mb-4">
              <EventImageUploader setProfileImg={setProfileImg} />
            </div>
            <Row>
              <Col xl={6}>
                <LabelField
                  onChange={handleOnChange}
                  type="text"
                  label="Event Name"
                  name="event_name"
                  value={eventData.event_name}
                  placeholder="Enter Event Name"
                  fieldSize="w-100 h-md"
                />
                {errorMessage.event_name && (
                  <p style={errorTxt}>{errorMessage.event_name}</p>
                )}
              </Col>

              <Col xl={6}>
                <LabelField
                  onChange={handleOnChange}
                  type="text"
                  label="address"
                  name="address"
                  value={eventData.address}
                  placeholder="Enter Address"
                  fieldSize="w-100 h-md"
                />
                {errorMessage.address && (
                  <p style={errorTxt}>{errorMessage.address}</p>
                )}
              </Col>

              <Col xl={12}>
                <Box className=" d-flex flex-column justify-content-start gap-2">
                  <Label className="mc-label-field-title">Desription</Label>
                  <textarea
                    placeholder="Input your text...."
                    name="description"
                    rows="4"
                    value={eventData.description}
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
                  type="time"
                  label="Open Time"
                  name="open_time"
                  value={eventData.open_time}
                  placeholder="Enter address"
                  fieldSize="w-100 h-md"
                />
                {errorMessage.open_time && (
                  <p style={errorTxt}>{errorMessage.open_time}</p>
                )}
              </Col>
              <Col xl={6}>
                <LabelField
                  onChange={handleOnChange}
                  type="time"
                  label="Closing Time"
                  name="close_time"
                  value={eventData.close_time}
                  placeholder="Enter address"
                  fieldSize="w-100 h-md"
                />
                {errorMessage.close_time && (
                  <p style={errorTxt}>{errorMessage.close_time}</p>
                )}
              </Col>
              <Col xl={6}>
                <span className="mc-label-field-title">Start Date</span>
                <div
                  style={{ height: "45px" }}
                  className="checkbox-container d-flex justify-content-between align-items-center mt-2 mc-label-field-input"
                >
                  <input
                    type="date"
                    value={eventData.start_date}
                    name="start_date"
                    onChange={handleOnChange}
                  />
                </div>
                {errorMessage.start_date && (
                  <p style={errorTxt}>{errorMessage.start_date}</p>
                )}
              </Col>
              <Col xl={6}>
                <span className="mc-label-field-title">End Dat</span>
                <div
                  style={{ height: "45px" }}
                  className="checkbox-container d-flex justify-content-between align-items-center mt-2 mc-label-field-input"
                >
                  <input
                    type="date"
                    value={eventData.end_date}
                    name="end_date"
                    onChange={handleOnChange}
                  />
                </div>
                {errorMessage.end_date && (
                  <p style={errorTxt}>{errorMessage.end_date}</p>
                )}
              </Col>
              <Col xl={6}>
                <LabelField
                  onChange={handleOnChange}
                  type="number"
                  label="Capacity"
                  name="capacity"
                  value={eventData.capacity}
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
              <Col xl={6}>
                <LabelField
                  name="type"
                  onChange={handleOnChange}
                  value={eventData.type}
                  label="Event Type"
                  option={["Select", "fee", "paid"]}
                  fieldSize="w-100 h-md"
                />
                {errorMessage.type && (
                  <p style={errorTxt}>{errorMessage.type}</p>
                )}
              </Col>

              <Col xl={6}>
                <LabelField
                  onChange={handleOnChange}
                  type="number"
                  label="Latitude"
                  name="lat"
                  value={eventData.lat}
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
                  value={eventData.long}
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
              {eventData.type === "paid" && (
                <Col xl={6}>
                  <LabelField
                    onChange={handleOnChange}
                    type="number"
                    label="Ticket Price"
                    name="price"
                    onKeyPress={(event) =>
                      !/[0-9]/.test(event.key) && event.preventDefault()
                    }
                    value={eventData.price}
                    placeholder="Enter description"
                    fieldSize="w-100 h-md"
                  />
                  {errorMessage.price && (
                    <p style={errorTxt}>{errorMessage.price}</p>
                  )}
                </Col>
              )}

              <Col>
                <div className="submit_btn">
                  <button
                    className="btn normal-case btn-primary "
                    style={{
                      height: "45px",
                      // width: "100%",
                      padding: "2px 10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "20px auto 20px auto",
                    }}
                    onClick={handleSignUpSubmit}
                  >
                    Submit
                  </button>
                </div>
              </Col>
            </Row>
            {/* {errorMessage.general && (
              <p className="d-flex justify-content-center position-relative text-warning" style={errorTxt}>{errorMessage.general}</p>)} */}
          </CardLayout>
        </Col>
      </Row>
    </PageLayout>
  );
}
