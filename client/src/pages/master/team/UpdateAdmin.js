import React, { useContext, useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import {Anchor} from "../../../components/elements";
import { LabelField } from "../../../components/fields";
import { CardLayout } from "../../../components/cards";
import Breadcrumb from "../../../components/Breadcrumb";
import PageLayout from "../../../layouts/PageLayout";
import data from "../../../data/master/editMember.json";
import { ThemeContext } from "../../../context/Themes";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MemberAvatar from "./ProfileImageUploader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactSelect from "../../../components/fields/ReactSelect";


export default function UpdateAdmin() { 


  const navigate = useNavigate();
  const serverUrl = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem("token");
  const memberId = localStorage.getItem("memberId");
  const { theme } = useContext(ThemeContext);

  const [adminData, setAdminData] = useState({
    name: "",
    email: "",
    permissions: [],
    // parkingList: [],
    phone: "",
    img: [],
    // parkId: "",
    // status:"",
    // assign_for:""
  });

  const [submitter, setSubmitter] =  useState("Submit")
   
  const [errorMessage, setErrorMessage] = useState({
    name: "",
    email: "",
    permissions: "",
    // parkingList: "",
    phone: "",
    // status:"",
  }); 

  const [defaultPermission, setDefaultPermission] = useState(null);

  // const [defaultStatus, setDefaultStatus] = useState(null);

  // const [defaultParking, setDefaultParking] = useState(null);

  
  useEffect(() => {
    const fetchAdminDetails = async () => {

      try {
        const response = await axios.get(
          `${serverUrl}/profile/viewProfile/${memberId}`
        );

        if (response.status === 200) {
          console.log("fetched adming data", response.data);

          const commonEventData = {
            name: response.data.name,
            email: response.data.email,
            phone: response.data.phone,
            // status: response.data.status,
            permissions: response.data.permission,
          };
          setAdminData(commonEventData);

          if(response.data.img){
            setAdminData((prevData) =>({
              ...prevData,
              img:response.data.img
            }))
          }

          // if(response.data.assign_for){
          //   setAdminData((prevData) => ({
          //     ...prevData,
          //     assign_for: response.data.assign_for,
          //   }));
          //   setDefaultParking({
          //     value : response.data.assign_for.name,
          //     label:response.data.assign_for.name,
          //   })
          // }

          const allowedPermission = response.data.permission.find(
            (permission) => permission.is_allowed === true
          );
          
          if (allowedPermission) {
            setDefaultPermission(allowedPermission);
          }

          // setDefaultStatus({
          //   label:response.data.status,
          // })
          
        }
      } catch (error) {
        navigate("/team");
        console.log(error, "error");
      }
    };
    fetchAdminDetails();
  }, []);



  // const targetLabel = "Parking Management";
  // const isParkingPermissionSelected = adminData.permissions?.find((permission) => {
  //   return permission.label === targetLabel && permission.is_allowed === true;
  // }); // if parking permission is selected then only parking list api will be called and parking list will be displayed


  // useEffect(() => {   //// fetching the parking list only if the isParkingPermissionSelected is true
  //   if (isParkingPermissionSelected) {
  //     const headers = { token: token };
  //     const fetchParkingList = async () => {
  //       try {
  //         const response = await axios.get(`${serverUrl}/park/fetchAll?isAssign=false&isActive=false`, {
  //           headers,
  //         });
  //         console.log("PARKING SLOTS DATA FETCHED", response.data);

  //       const parkingsArray = response.data.map((parking) => ({
  //           ...parking,
  //           label: parking.name,
  //         }));

  //         setAdminData((prevData) => ({
  //           ...prevData,
  //           parkingList: parkingsArray,
  //         }));
  //       } catch (error) {
  //         console.log(error, "error");
  //       }
  //     };
  //     fetchParkingList();
  //   }
  // }, [isParkingPermissionSelected]);




  const handleOnChange = (e) => {
    const { name} = e.target;
    setErrorMessage((prevErrors) => ({ ...prevErrors, [name]: "" }));
      setAdminData((prevValue) => ({ ...prevValue, [name]: e.target.value }));
    
  };



  //// HANDLING STATUS CHANGES
  // const handleSelectedStatus = (selectedOption) => {
  //   const selectedValue = selectedOption.value;
  //    setDefaultStatus({
  //     label :selectedOption.label
  //    })
  //   setAdminData((prevValue) => ({
  //     ...prevValue,
  //     status: selectedValue,
  //   }));
  // };
  
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!adminData.name) {
      errors.name = "name is required.";
    }
    if (adminData.phone.length < 10) {
      errors.phone = "phone must be at least 10 digits.";
    }
    if (!adminData.email) {
      errors.email = "email is required.";
    } else if (!emailRegex.test(adminData.email)) {
      errors.email = "Invalid email format.";
    }
    setErrorMessage(errors);
    return Object.keys(errors).length === 0;
  };


  

  const handleUpdateAdmin = async (e) => {
    e.preventDefault();

    const isFormValid = validateForm();

    console.log(isFormValid);

    if (isFormValid) {
      try {
        setSubmitter("Submitting...");
        const headers = {
          token: token,
        };
        const data = {
          permission: adminData.permissions,
          Id: memberId,
        };
        

        // for toggle : profile/changeStatus/_id , method get , to change the status
        // if (isParkingPermissionSelected && adminData.parkId) {  // if parkingpermission is selected and parkId is thers then only it will be included
        //   data.parkId = adminData.parkId;
        // }
        
        if (adminData.img) {
          data.img = adminData.img;
        }
        
        console.log(data, "Updated admin data to be send");
        const response = await axios.post(`${serverUrl}/profile/changePermission`, data, {
          headers,
        });
        if (response.status === 200) {
        setSubmitter("Submit");
          toast.success(response.data.result);
          setTimeout(() => {
            setAdminData({
              name: "",
              email: "",
              phone: "",
            });
            navigate("/team")
            // window.location.href = "/team";
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
    setAdminData((prevData) => ({ ...prevData, img: imageAsInput }));
  };


  const handleSelectedPermission = (selectedValue) => {
    setDefaultPermission(selectedValue);

    const updatedPermissions = adminData.permissions?.map((permission) => {
      if (permission.label === selectedValue.label) {
        return { ...permission, is_allowed: true };
      } else {
        return { ...permission, is_allowed: false };
      }
    });
    setAdminData({ ...adminData, permissions: updatedPermissions });
  };

  // const handleSelectedParking = (selectedItem) => {
  //   setDefaultParking(selectedItem);
  //   setAdminData({ ...adminData, parkId: selectedItem._id });
  // };

  // const getOptionLabel = (option) => `${option.name}`;  

  console.log(adminData,'admin data')

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
            <div className="header d-flex justify-content-between align-items-center mb-4">
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
              <MemberAvatar fetchImage={adminData.img}
                    imgArrayLimit={1}
                    getUploadedImageFile={getUploadedImageFile} />
            </div>
            <Row>
              <Col xl={6}>
                <LabelField
                  onChange={handleOnChange}
                  type="text"
                  label="name"
                  name="name"
                  readOnly={true}
                  value={adminData.name}
                  placeholder="Enter name"
                  fieldSize="w-100 h-md"
                />
                {errorMessage.name && (
                  <p style={errorTxt}>{errorMessage.name}</p>
                )}
              </Col>

              <Col xl={6}>
                <LabelField
                  onChange={handleOnChange}
                  type="text"
                  label="email"
                  name="email"
                  value={adminData.email}
                  placeholder="Enter email"
                  fieldSize="w-100 h-md"
                  readOnly={true} 
                />
                {errorMessage.email && (
                  <p style={errorTxt}>{errorMessage.email}</p>
                )}

                {errorMessage.email && (
                  <p style={errorTxt}>{errorMessage.email}</p>
                )}
              </Col>

              <Col xl={6}>
                <LabelField
                  onChange={handleOnChange}
                  type="text"
                  label="phone"
                  name="phone"
                  readOnly={true}
                  value={adminData.phone}
                  placeholder="Enter phone"
                  fieldSize="w-100 h-md"
                  onKeyPress={(event) =>
                    /[0-9]/.test(event.key) && event.target.value.length < 10
                      ? true
                      : event.preventDefault()
                  }
                />
                {errorMessage.phone && (
                  <p style={errorTxt}>{errorMessage.phone}</p>
                )}
              </Col>
              {/* <Col xl={6}>
                  <ReactSelect
                    label="status"
                    type="Normal_Select"
                    value={defaultStatus}
                    onChange={handleSelectedStatus}
                    options={["Active", "Block"]}
                  />
                   {errorMessage.type && (
                    <p style={errorTxt}>{errorMessage.type}</p>
                  )}
                </Col> */}
                

              {/* <Col xl={isParkingPermissionSelected && ( adminData.parkingList?.length > 0 || adminData.assign_for )  ? 6 : 12}> */}
              <Col xl={6}>
                  <ReactSelect
                    label="permissions"
                    value={defaultPermission}
                    onChange={handleSelectedPermission} 
                    options={adminData.permissions}
                    // getOptionLabel={getOptionLabel}
                  />
                   {errorMessage.type && (
                    <p style={errorTxt}>{errorMessage.type}</p>
                  )}
                </Col>
{/* 
                { isParkingPermissionSelected && ( adminData.parkingList?.length > 0 || adminData.assign_for ) && 
                 <Col xl={6}>
                 <ReactSelect
                   label="Parking"
                   value={defaultParking}
                   onChange={handleSelectedParking}
                   options={adminData.parkingList}
                  //  getOptionLabel={getOptionLabel}
                 />
                  {errorMessage.type && (
                   <p style={errorTxt}>{errorMessage.type}</p>
                 )}
               </Col>
                } */}


              <Col xl={12}>
               
               <div style={{ height: "45px" }} className=" d-flex justify-content-center ">
                 <button
                   className="btn normal-case btn-primary "
                   style={{
                     height: "40px",
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "center",
                     margin: "0px auto 20px auto",
                     animation: "none",
                   }}
                   onClick={handleUpdateAdmin}
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
