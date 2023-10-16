import React, { useContext, useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import {
  Anchor,} from "../../../components/elements";
import { LabelField} from "../../../components/fields";
import { CardLayout} from "../../../components/cards";
import Breadcrumb from "../../../components/Breadcrumb";
import PageLayout from "../../../layouts/PageLayout";
import data from "../../../data/master/addMember.json";
import { ThemeContext } from "../../../context/Themes";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MemberAvatar from "./ProfileImageUploader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactSelect from "../../../components/fields/ReactSelect";


export default function AddAdmin() {


  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const serverUrl = process.env.REACT_APP_BASE_URL;
  const { theme } = useContext(ThemeContext);



  const [memberData, setMemberData] = useState({
    Name: "",
    Email: "",
    Permissions: [],
    // ParkingList: [],
    Mobile: "",
    img: "",
    // parkId: "",
  });

  const [errorMessage, setErrorMessage] = useState({
    Name: "",
    Email: "",
    Permissions: "",
    // ParkingList: "",
    Mobile: "",
  }); 

  const [selectedPermission, setSelectedPermissions] = useState("Select");
  // const [selectedParking, setSelectedParking] = useState("Select");
  const [submitter, setSubmitter] =  useState("Submit")



  const handleSelectedPermission = (selectedItem) => {
    // Update the selected option state
    setSelectedPermissions(selectedItem);
    // Update the Permissions array in the memberData state
    const updatedPermissions = memberData.Permissions.map((permission) => {
      if (permission._id === selectedItem._id) {
        return { ...permission, is_allowed: true };
      } else {
        return { ...permission, is_allowed: false };
      }
    });
    // Update the memberData state with the modified Permissions array
    setMemberData({ ...memberData, Permissions: updatedPermissions });
  };




  // const handleSelectedParking = (selectedItem) => {
  //   setSelectedParking(selectedItem);
  //   setMemberData({ ...memberData, parkId: selectedItem._id });
  // };





  useEffect(() => {   /// fetching permission array 
    if (token) {
      const headers = { token: token };
      const fetchPermissionList = async () => {
        try {
          const response = await axios.get(`${serverUrl}/permission/fetchAll`, {
            headers,
          });
          console.log("fetched persmission list", response.data);

          // Assuming response.data.permissionList is an array
          const PermissionsArray = response.data;

          setMemberData((prevData) => ({
            ...prevData,
            Permissions: PermissionsArray,
          }));
        } catch (error) {
          console.log(error, "error");
        }
      };
      fetchPermissionList();
    }
  }, []);


  ////// finding parking managment permission to be true if true it will fetch the parking slot data 
  // const targetLabel = "Parking Management";
  // const isParkingPermissionSelected = memberData.Permissions.find((permission) => {
  //   return permission.label === targetLabel && permission.is_allowed === true;
  // }); 


  // useEffect(() => {   //// fetching the parking slot data only if the isParkingPermissionSelected is true
  //   if (isParkingPermissionSelected) {
  //     const headers = { token: token };
  //     const fetchParkingList = async () => {
  //       try {
  //         const response = await axios.get(`${serverUrl}/park/fetchAll?isAssign=false&isActive=false`, {
  //           headers,
  //         });  
  //         console.log("fetched parking data", response.data);

  //       const parkingsArray = response.data.map((parking) => ({
  //           ...parking,
  //           label: parking.name,
  //         }));

  //         setMemberData((prevData) => ({
  //           ...prevData,
  //           ParkingList: parkingsArray,
  //         }));
  //       } catch (error) {
  //         console.log(error, "error");
  //       }
  //     };
  //     fetchParkingList();
  //   }
  // }, [isParkingPermissionSelected]);



  const handleOnChange = (e) => {
    const { name } = e.target;
    setErrorMessage((prevErrors) => ({ ...prevErrors, [name]: "" }));
    setMemberData((prevValue) => ({ ...prevValue, [name]: e.target.value }));
  };



 
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

  const isPerMissionSelected = memberData.Permissions.find((permission) => {
    return  permission.is_allowed === true;
  }); // to validate that there must be one permission selected before creating admin



  const validateForm = () => {
    const errors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!memberData.Name) {
      errors.Name = "Name is required.";
    }
    if (memberData.Mobile.length < 10) {
      errors.Mobile = "Mobile must be at least 10 digits.";
    }
    if (!isPerMissionSelected) {
      errors.Permissions = "Permissions is required";
    }
    if (!memberData.Email) {
      errors.Email = "Email is required.";
    } else if (!emailRegex.test(memberData.Email)) {
      errors.Email = "Invalid Email format.";
    }
    setErrorMessage(errors);
    return Object.keys(errors).length === 0;
  };




  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    const isFormValid = validateForm();
    if (isFormValid) {
      try {
        setSubmitter("Submitting...");
        const headers = {
          token: token,
        };
        const data = {
          name: memberData.Name,
          email: memberData.Email,
          phone: memberData.Mobile,
          permission: memberData.Permissions,
          // ...(isParkingPermissionSelected ? { parkId: memberData.parkId } : {}),
        };
        console.log(data, "admin data to be sent");
        const response = await axios.post(`${serverUrl}/profile/add`, data, {
          headers,
        });
        if (response.status === 200) {
        setSubmitter("Submit");
          toast.success(response.data.result);
          setTimeout(() => {
            setMemberData({
              Name: "",
              Email: "",
              Mobile: "",
            });
            navigate("/team")
          }, 1000);
        }
      } catch (error) {
        console.error("Error:", error.response.data.error);
        toast.error(error.response.data.error);
        setSubmitter("Submit");
      }
    } else {
      toast.error("Please fill the All required fields");
    }
  };

  const getUploadedImageFile = (imageAsInput) => {
    setMemberData((prevData) => ({ ...prevData, imageAsInput }));
  };

  console.log(memberData,',memberdata')

  return (
    <PageLayout>
      <Row>
        <Col xl={12}>
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
        <Col xl={7} style={{ margin: "20px auto" }}>
          <CardLayout>
            <div className="header d-flex justify-content-between align-items-center ">
              <h5 className="opacity-0">Add Admin</h5>
              <ToastContainer />
              <button
                className="btn btn-sm btn-circle absolute"
                style={crossBtn_style}
                onClick={() => navigate("/team")}
              >
                ✕
              </button>
            </div>
            <div className="avatar d-flex justify-content-center mb-4">
              <MemberAvatar getUploadedImageFile={getUploadedImageFile} />
            </div>
            <Row className="mb-4">
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
                {errorMessage.Name && (
                  <p style={errorTxt}>{errorMessage.Name}</p>
                )}
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

              {/* <Col xl={( isParkingPermissionSelected && memberData.ParkingList.length > 0 )  ? 6 : 12}> */}
              <Col xl={6}>
                  <ReactSelect
                    label="permissions"
                    value={selectedPermission}
                    onChange={handleSelectedPermission} 
                    options={memberData.Permissions}
                  />
                   {errorMessage.Permissions && (
                  <p style={errorTxt}>{errorMessage.Permissions}</p>
                )}
                </Col>

              {/* { ( isParkingPermissionSelected && memberData.ParkingList.length > 0 ) && (
                 <Col xl={6}>
                 <span className="mc-label-field-title ">Parking</span>
                  <ReactSelect
                    label="ParkingList"
                    value={selectedParking}
                    onChange={handleSelectedParking} 
                    options={memberData.ParkingList}
                  />
                 {errorMessage.Permissions && (
                   <p style={errorTxt}>{errorMessage.Permissions}</p>
                 )}
               </Col>
              )} */}

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
              <Col xl={12}>
               
                <div style={{ height: "45px" }} className=" d-flex justify-content-center ">
                  <button
                    className="btn normal-case btn-primary "
                    style={{
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "20px auto 20px auto",
                      animation: "none",
                    }}
                    onClick={handleAdminSubmit}
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
