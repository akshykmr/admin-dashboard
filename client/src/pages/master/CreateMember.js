import React, { useContext, useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { Box, Anchor, Button, Image, Input, Label, Icon, Text } from "../../components/elements"; 
import { LabelField, LabelTextarea } from "../../components/fields";
import { CardLayout, CardHeader } from "../../components/cards";
import Breadcrumb from "../../components/Breadcrumb";
import PageLayout from "../../layouts/PageLayout";
import data from "../../data/master/productUpload.json";
import { ThemeContext } from "../../context/Themes";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import MemberAvatar from "./MemberAvatar";
import { ToastContainer, toast } from "react-toastify";



export default function ProductUpload() {
    
    const navigate = useNavigate();


    const serverUrl = process.env.REACT_APP_BASE_URL;

    const { theme } = useContext(ThemeContext);
  
    const [previewPassword, setPreviewPassword] = useState(false); /// to preview the password
    const [previewConfirmPassword, setPreviewConfirmPassword] = useState(false); /// to preview the confirmPassword
  
    const [memberData, setMemberData] = useState({
      Name: "",
      Email: "",
      // Password: "",
      // ConfirmPassword: "",
      Permissions: [],
      // Role: "",
      Mobile: "",
      // profilePic: "",
    });
  
    const [errorMessage, setErrorMessage] = useState({
      Name: "",
      Email: "",
      // Password: "",
      // ConfirmPassword: "",
      Permissions: [],
      // Role: "",
      Mobile: "",
      general: "",
      // profilePic: "",
    }); /// formdata for creating subadmin
  
    // const handlePasswordPreviewer = () => {
    //   setPreviewPassword((prev) => !prev);
    // };
  
    // const handleConfirmPasswordPreviewer = () => {
    //   setPreviewConfirmPassword((prev) => !prev);
    // };
  
    const token = localStorage.getItem("token");
  
    useEffect(() => {
      if (token) {
        const headers = { token: token};
        const fetchPermissionList = async () => {
          try {
            const response = await axios.get(
              `${serverUrl}/permission/fetchAll`,{headers}
            );
            console.log("response", response.data);
  
            // Assuming response.data.permissionList is an array
            const permissionsArray = response.data;
  
            setMemberData((prevData) => ({
              ...prevData,
              Permissions: permissionsArray,
            }));
          } catch (error) {
            console.log(error, "error");
          }
        };
        fetchPermissionList();
      }
    }, []);
  
    const handleOnChange = (e) => {
      const { name, type, checked } = e.target;
      setErrorMessage((prevErrors) => ({ ...prevErrors, [name]: "" }));
  
      if (type === "checkbox") {
        const updatedPermissions = [...memberData.Permissions];
  
        const permissionIndex = updatedPermissions.findIndex(
          (permission) => permission.label === name
        );
  
        if (permissionIndex !== -1) {
          updatedPermissions[permissionIndex].is_allowed = checked;
        }
  
        setMemberData((prevValue) => ({
          ...prevValue,
          Permissions: updatedPermissions,
        }));
      } else {
        // For other input fields, update normally
        setMemberData((prevValue) => ({ ...prevValue, [name]: e.target.value }));
      }
    };
  
    console.log(memberData, "=");
  
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
  
    // const isStrongpassword = (password) => {
    //   const regex =
    //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    //   return regex.test(password);
    // };
  
    const validateForm = () => {
      const errors = {};
  
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
      if (!memberData.Name) {
        errors.Name = "Name is required.";
      }
      if (memberData.Mobile.length < 10) {
        errors.Mobile = "Mobile must be at least 10 digits.";
      }
      // if (!memberData.Role) {
      //   errors.Role = "Role is required";
      // }
      // if (!memberData.Permissions.length > 0) {
      //   errors.Permissions = "Permissionsr is required";
      // }
      if (!memberData.Email) {
        errors.Email = "Email is required.";
      } else if (!emailRegex.test(memberData.Email)) {
        errors.Email = "Invalid Email format.";
      }
      // if (!memberData.Password) {
      //   errors.Password = "Password is required.";
      // } else if (!isStrongpassword(memberData.Password)) {
      //   errors.Password = "Invalid Password format.";
      // }
      // if (!memberData.ConfirmPassword) {
      //   errors.ConfirmPassword = "Confirm Password is required.";
      // } else if (!isStrongpassword(memberData.ConfirmPassword)) {
      //   errors.ConfirmPassword = "Invalid Confirm Password format.";
      // }
      // if(memberData.Password && memberData.ConfirmPassword){
      //   if (memberData.Password !== memberData.ConfirmPassword) {
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
                const headers = { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTA5NzFlNGEzZjAwMmNmYmQ5OTI2ODEiLCJpYXQiOjE2OTUyMDAwMDN9.Yyu3qoOQopJe9bpiIKkAfMjafSFc2aqGSbgaLG2vcR8"};
        //         // const formData = new FormData();
        //         // formData.append("name", memberData.Name)
        //         // formData.append("email", memberData.Email)
        //         // formData.append("phone", memberData.Mobile)
        //         // formData.append("permission", memberData.Permissions)
        const data = {
          name: memberData.Name,
          email: memberData.Email,
          phone: memberData.Mobile,
          permission: memberData.Permissions,
        };
        console.log(data, " data to be sent");
                const response = await axios.post('https://api.kullu.dev.client.kloudlite.io/profile/add', data, { headers });
                console.log(response,'response while creating user')
                if (response.status === 200) {
                  toast.success(response.data.result);
                  setTimeout(() => {
                    console.log("Message", response.data);
                    // localStorage.setItem("token", response.data.token);
                    // localStorage.setItem("role", response.data.role);
                    setMemberData({
                      Name: "",
                      Email: "",
                      Mobile: "",
                    });
                  window.location.href = "/member-list";
                    }, 1000);
                }
              } catch (error) {
                console.error("Error:", error.response.data.error);
                toast.error(error.response.data.error);
              }
      } else {
              toast.error("Form Data is Not Valid");
              console.log("condition not fullfilled");
      }
    };
  
    const setProfileImg = (profilePic) => {
      setMemberData((prevData) => ({ ...prevData, profilePic }));
    };

    return (
        <PageLayout>
            <Row style={{ margin: "20px 0 30px 0" }}>
                <Col xl={12}>
                    <CardLayout>
                        <Breadcrumb title={ data?.pageTitle }>
                            {data?.breadcrumb.map((item, index) => (
                                <li key={ index } className="mc-breadcrumb-item">
                                    {item.path ? <Anchor className="mc-breadcrumb-link" href={ item.path }>{ item.text }</Anchor> : item.text }
                                </li>
                            ))}
                        </Breadcrumb>
                    </CardLayout>
                </Col>
                <Col xl={7} style={{ margin: "70px auto" }}>
        <CardLayout>
          <div className="header d-flex justify-content-between align-items-center mb-4">
            {/* <CardHeader title="basic information" /> */}
            <h5>Basic Information</h5>
            <ToastContainer/>
            <button
              className="btn btn-sm btn-circle absolute"
              style={crossBtn_style}
              onClick={()=> navigate("/member-list")}
            >
              ✕
            </button>
          </div>
          <div className="avatar d-flex justify-content-center mb-4">
            <MemberAvatar setProfileImg={setProfileImg} />
          </div>
          <Row>
            <Col xl={6}>
              <LabelField
                onChange={handleOnChange}
                type="text"
                label="Name"
                name="Name"
                value={memberData.Name}
                placeholder="Enter Name"
                fieldSize="w-100 h-md"
              />
              {errorMessage.Name && <p style={errorTxt}>{errorMessage.Name}</p>}
            </Col>

            <Col xl={6}>
              <LabelField
                onChange={handleOnChange}
                type="text"
                label="Email"
                name="Email"
                value={memberData.Email}
                placeholder="Enter Email"
                fieldSize="w-100 h-md"
              />
              {errorMessage.Email && (
                <p style={errorTxt}>{errorMessage.Email}</p>
              )}
            </Col>
            {/* <Col className="position-relative" xl={6}>
              <LabelField
                onChange={handleOnChange}
                type={previewPassword ? "text" : "password"}
                label="Password"
                name="Password"
                value={memberData.Password}
                placeholder={
                  previewPassword ? "Create a Password" : "*********"
                }
                fieldSize="w-100 h-md"
              />
               {errorMessage.Password && (
              <p  style={errorTxt}>{errorMessage.Password}</p>
            )}
              <span
                className="position-absolute top-50"
                onClick={handlePasswordPreviewer}
                style={{ right: "17px", cursor: "pointer" }}
              >
                {previewPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </Col>
            <Col xl={6} className="position-relative">
              <LabelField
                onChange={handleOnChange}
                type={previewConfirmPassword ? "text" : "password"}
                label="Confirm Password"
                name="ConfirmPassword"
                value={memberData.ConfirmPassword}
                placeholder={
                  previewConfirmPassword ? "Create a Password" : "*********"
                }
                fieldSize="w-100 h-md"
              />
               {errorMessage.ConfirmPassword && (
              <p  style={errorTxt}>{errorMessage.ConfirmPassword}</p>
            )}
              <span
                className="position-absolute top-50"
                onClick={handleConfirmPasswordPreviewer}
                style={{ right: "17px", cursor: "pointer" }}
              >
                {previewConfirmPassword ? (
                  <AiOutlineEyeInvisible />
                ) : (
                  <AiOutlineEye />
                )}
              </span>
            </Col> */}

            {/* </span> */}

            {/* <Col xl={6}>
              <LabelField
                name="Permissions"
                onChange={handleOnChange}
                value={memberData.Permissions}
                label="Permission"
                option={["Select", "Parking", "Event"]}
                fieldSize="w-100 h-md"
              />
            </Col> */}
            {/* <Col xl={6}>
              <LabelField
                name="Role"
                onChange={handleOnChange}
                value={memberData.Role}
                label="Role"
                option={["Select", "SubAdmin", "User"]}
                fieldSize="w-100 h-md"
              />
               {errorMessage.Role && (
              <p  style={errorTxt}>{errorMessage.Role}</p>
            )}
            </Col> */}
            <Col xl={6}>
              <LabelField
                onChange={handleOnChange}
                type="text"
                label="Mobile"
                name="Mobile"
                value={memberData.Mobile}
                placeholder="Enter Mobile"
                fieldSize="w-100 h-md"
                onKeyPress={(event) =>
                  /[0-9]/.test(event.key) && event.target.value.length < 10
                    ? true
                    : event.preventDefault()
                }
              />
              {errorMessage.Mobile && (
                <p style={errorTxt}>{errorMessage.Mobile}</p>
              )}
            </Col>
            <Col xl={6}>
              <span className="mc-label-field-title">Permission</span>
              <div
                style={{ height: "45px" }}
                className="checkbox-container d-flex justify-content-between align-items-center mt-2 mc-label-field-input"
              >
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="Parking Management"
                    checked={memberData.Permissions.some(
                      (permission) =>
                        permission.label === "Parking Management" &&
                        permission.is_allowed
                    )}
                    onChange={handleOnChange}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault"
                  >
                    Parking
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="Event Management"
                    checked={memberData.Permissions.some(
                      (permission) =>
                        permission.label === "Event Management" &&
                        permission.is_allowed
                    )}
                    onChange={handleOnChange}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault"
                  >
                    Events
                  </label>
                </div>
              </div>

              {/* <LabelField
                name="Status"
                onChange={handleOnChange}
                value={memberData.Status}
                label="Status"
                option={["Select","Active", "Deactivate"]}
                fieldSize="w-100 h-md"
              /> */}
              {errorMessage.Permissions && (
                <p style={errorTxt}>{errorMessage.Permissions}</p>
              )}
            </Col>
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
    )
}