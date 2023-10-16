import React, { useContext, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { LabelField } from "../../../components/fields";
import { CardLayout } from "../../../components/cards";
import PageLayout from "../../../layouts/PageLayout";
import { ThemeContext } from "../../../context/Themes";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EventImageUploader from "../imgUploader/ImageUploader";
import data from "../../../data/master/addEvents.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Box, Anchor, Label } from "../../../components/elements";
import Breadcrumb from "../../../components/Breadcrumb";

export default function AddEvents() {
  const navigate = useNavigate();

  const serverUrl = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem("token");
  const { theme } = useContext(ThemeContext);

  const [eventData, setEventData] = useState({
    name: "",
    description: "",
    img: [],
    address: "",
    type: "",
    start_time: "",
    end_time: "",
    start_date: "",
    end_date: "",
    capacity: "",
    lat: "",
    long: "",
    price: "",
  });

  console.log(eventData, "event data");

  const [errorMessage, setErrorMessage] = useState({
    name: "",
    description: "",
    img: "",
    address: "",
    type: "",
    start_time: "",
    end_time: "Please maintain the time gap for at least 30 minutes.",
    start_date: "",
    end_date: "",
    capacity: "",
    lat: "",
    long: "",
    price: "",
  });

  const [submitter, setSubmitter] = useState("Submit");

  const handleOnChange = (e) => {
    const { name } = e.target;
    setErrorMessage((prevErrors) => ({ ...prevErrors, [name]: "" }));
    setEventData((prevValue) => ({ ...prevValue, [name]: e.target.value }));
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
    // form validation
    const errors = {};

    if (!eventData.name) {
      errors.name = "Event Name is required.";
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
    if (!eventData.start_time) {
      errors.start_time = "Open Time is required.";
    }
    if (!eventData.end_time) {
      errors.end_time = "Close Time is required.";
    }
    if (eventData.start_time === eventData.end_time) {
      // Start and end Time cannot be the same
      toast.warn("Please maintain the time gap for at least 30 minutes.");
      errors.end_time = "Start Time and End Time Cannot be the Same";
    }
    if (!eventData.start_date) {
      errors.start_date = "Start Date is required.";
    }
    if (!eventData.end_date) {
      errors.end_date = "End Data is required.";
    }
    // if (eventData.start_date === eventData.end_date) {
    //   // Start and end date cannot be the same
    //   toast.warn("Start Date and End Date Cannot be the Same");
    //   errors.end_date = "End Date Cannot be the Same as Start Date";
    // } else if (eventData.end_date < eventData.start_date) {
    //   // End date cannot be before the start date
    //   toast.warn("End Date Cannot be Before the Start Date");
    //   errors.end_date = "End Date Cannot be Before the Start Date";
    // }
    if (!eventData.capacity) {
      errors.capacity = "Capacity is required.";
    }
    if (!eventData.lat) {
      errors.lat = "Latitude is required.";
    }
    if (!eventData.long) {
      errors.long = "Longitude is required.";
    }
    if (eventData.type === "paid") {
      if (!eventData.price) {
        errors.price = "Price  is required.";
      }
    }
    if (!eventData.img.length > 0) {
      errors.img = "Event Image required.";
    }
    setErrorMessage(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddEvent = async (e) => {
    //submit function for submit button
    e.preventDefault();

    const isFormValid = validateForm();

    console.log(isFormValid);

    if (isFormValid) {
      try {
        setSubmitter("Submitting...");
        const headers = {
          token: token,
        };
        const formData = new FormData();
        formData.append("name", eventData.name);
        formData.append("description", eventData.description);
        for (let i = 0; i < eventData.img.length; i++) {
          formData.append("img", eventData.img[i]);
        }
        formData.append("address", eventData.address);
        formData.append("type", eventData.type);
        formData.append("start_time", eventData.start_time);
        formData.append("end_time", eventData.end_time);
        formData.append("start_date", eventData.start_date);
        formData.append("end_date", eventData.end_date);
        formData.append("capacity", eventData.capacity);
        formData.append("lat", eventData.lat);
        formData.append("long", eventData.long);
        formData.append("price", eventData.price);

        console.log(formData, "event data to be send in fromdata format");
        const response = await axios.post(`${serverUrl}/event/add`, formData, {
          headers,
        });
        if (response.status === 200) {
          setSubmitter("Submit");
          toast.success("Event has been created successfully");
          setTimeout(() => {
            navigate("/upcoming-events");
          }, 2000);
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

  const getUploadedImageFile = (imageAsInput) => {
    setEventData((prevData) => ({ ...prevData, img: imageAsInput }));
  };

  function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  

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
                <h5 className="opacity-0">Add Event</h5>
                <button
                  className="btn btn-sm btn-circle absolute"
                  style={crossBtn_style}
                  onClick={() => navigate("/upcoming-events")}
                >
                  ✕
                </button>
              </div>
              <Row>
                <Col xl={6}>
                  <LabelField
                    onChange={handleOnChange}
                    type="text"
                    label="Event Name"
                    name="name"
                    value={eventData.name}
                    placeholder="Enter Event Name"
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

                <Col xl={12}>
                  <Box className=" d-flex flex-column justify-content-start gap-2">
                    <Label className="mc-label-field-title">description</Label>
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
                    name="start_time"
                    value={eventData.start_time}
                    placeholder="Enter address"
                    fieldSize="w-100 h-md"
                  />
                  {errorMessage.start_time && (
                    <p style={errorTxt}>{errorMessage.start_time}</p>
                  )}
                </Col>
                <Col xl={6}>
                  <LabelField
                    onChange={handleOnChange}
                    type="time"
                    label="Closing Time"
                    name="end_time"
                    value={eventData.end_time}
                    placeholder="Enter address"
                    fieldSize="w-100 h-md"
                  />
                  {errorMessage.end_time && (
                    <p style={errorTxt}>{errorMessage.end_time}</p>
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
                      min={getCurrentDate()} // Set the minimum date to the current date
                      onChange={handleOnChange}
                    />
                  </div>
                  {errorMessage.start_date && (
                    <p style={errorTxt}>{errorMessage.start_date}</p>
                  )}
                </Col>
                <Col xl={6}>
                  <span className="mc-label-field-title">End Date</span>
                  <div
                    style={{ height: "45px" }}
                    className="checkbox-container d-flex justify-content-between align-items-center mt-2 mc-label-field-input"
                  >
                    <input
                      type="date"
                      value={eventData.end_date}
                      name="end_date"
                      min={getCurrentDate()} // Set the minimum date to the current date
                      onChange={handleOnChange}
                    />
                  </div>
                  {errorMessage.end_date && (
                    <p style={errorTxt}>{errorMessage.end_date}</p>
                  )}
                </Col>

                <Col xl={6}>
                  <LabelField
                    name="type"
                    onChange={handleOnChange}
                    value={eventData.type}
                    label="Event Type"
                    option={["Select", "free", "paid"]}
                    fieldSize="w-100 h-md"
                  />
                  {errorMessage.type && (
                    <p style={errorTxt}>{errorMessage.type}</p>
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
                      placeholder="Enter Price"
                      fieldSize="w-100 h-md"
                    />
                    {errorMessage.price && (
                      <p style={errorTxt}>{errorMessage.price}</p>
                    )}
                  </Col>
                )}
                <Col xl={eventData.type === "paid" ? 12 : 6}>
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

                <Col xl={12}>
                  <span className="mc-label-field-title">Event Images </span>
                  <div
                    style={{ height: "45px" }}
                    className="checkbox-container d-flex  gap-3 flex-row-reverse align-items-center mt-2 mc-label-field-input"
                  >
                    <EventImageUploader
                      imgArrayLimit={6}
                      getUploadedImageFile={getUploadedImageFile}
                    />
                  </div>
                  {errorMessage.img && (
                    <p style={errorTxt}>{errorMessage.img}</p>
                  )}
                </Col>
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
                      onClick={handleAddEvent}
                    >
                      {submitter}
                    </button>
                  </div>
                </Col>
              </Row>
            </CardLayout>
          </Col>
        </Row>
        <ToastContainer />
      </PageLayout>
    </>
  );
}
