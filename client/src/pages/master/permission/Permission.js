import React, { useState, useContext, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { CardLayout, FloatCard } from "../../../components/cards";
import PermissionTable from "../../../components/tables/PermissionTable";
import LabelField from "../../../components/fields/LabelField";
import { Pagination, Breadcrumb } from "../../../components";
import Anchor from "../../../components/elements/Anchor";
import PageLayout from "../../../layouts/PageLayout";
import data from "../../../data/master/permission.json";
import "./Permission.css";
import axios from "axios";
import { ThemeContext } from "../../../context/Themes";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ParkingPage() {
  const token = localStorage.getItem("token");
  const serverUrl = process.env.REACT_APP_BASE_URL;

  const { theme } = useContext(ThemeContext);

  const [permissionList, setPermissionList] = useState([]);

  const [permissionData, setPermissionData] = useState({
    label: "",
  });

  const [errorMessage, setErrorMessage] = useState({
    label: "",
  });

  const [isPermissionAdding, setIsPermissionAdding] = useState(false);

  const handleOnChange = (e) => {
    const { name } = e.target;
    setErrorMessage((prevErrors) => ({ ...prevErrors, [name]: "" }));

    setPermissionData((prevValue) => ({
      ...prevValue,
      [name]: e.target.value,
    }));
  };

  const errorTxt = {
    fontSize: "11px",
    padding: "2px 0px",
    color: "#940e1d",
    position: "absolute",
  };
  const crossBtn_style = {
    color: theme === "dark_mode" ? "white" : "black",
    fontWeight: "900",
    fontSize: "15px",
    padding: "2px 6px",
  };

  const fetchEventList = async () => {
    try {
      //   console.log(token,'token from local storage')

      const headers = { token: token };
      //   console.log("header", headers);

      const response = await axios.get(`${serverUrl}/permission/fetchAll`, {
        headers,
      });
      console.log("permission", response.data);
      setPermissionList(response.data);
    } catch (error) {
      console.log(error, "error");
    }
  };

  useEffect(() => {
    if (token) {
      // if(role === 'super_admin'){
      fetchEventList(); // Call the async function immediately
      // }
    }
  }, [token]);

  useEffect(() => {
    if (!isPermissionAdding) {
      fetchEventList(); // Call the async function immediately
    }
  }, [isPermissionAdding]);

  const validateForm = () => {
    const errors = {};
    if (!permissionData.label) {
      errors.label = " Permission Name is required.";
    }
    setErrorMessage(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    const isFormValid = validateForm();

    console.log(isFormValid);

    if (isFormValid) {
      console.log("form submitted");
      try {
        const headers = {
          token: token,
        };
        const data = {
          label: permissionData.label,
        };
        console.log(data, " data to be sent");
        const response = await axios.post(`${serverUrl}/permission/add`, data, {
          headers,
        });
        if (response.status === 200) {
          toast.success(response.data.result);
          setPermissionData({
            label: "",
          });
          setIsPermissionAdding(false);
        }
      } catch (error) {
        console.error("Error:", error.response.data.error);
        toast.error(error.response.data.error);
      }
    } else {
      toast.warn("Please fill the All required fields");
    }
  };

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

        <Col xl={12}>
          <CardLayout className="mb-4">
            <Row>
              <div className="header d-flex justify-content-between align-items-center mb-4">
                <h5>Add a New Permission</h5>
                {isPermissionAdding ? (
                  <button
                    className="btn btn-sm btn-circle absolute"
                    style={crossBtn_style}
                    onClick={() => setIsPermissionAdding(false)}
                  >
                    ✕
                  </button>
                ) : (
                  <button
                    className="btn px-6 normal-case btn-primary "
                    style={{
                      height: "30px",
                      padding: "2px 10px",
                      display: "flex",
                      alignItems: "center",
                    }}
                    onClick={() => setIsPermissionAdding(true)}
                  >
                    Add Permission
                  </button>
                )}
              </div>
              {/* <div class="carousel-container">
                <div class="carousel">
                  {eventsData.Ongoing_Events.map((events, index) => (
                    <Col key={index} xl={3}>
                      <EventCard events={events} type="Ongoing_Events" />
                    </Col>
                  ))}
                </div>
              </div> */}
              {/* {data?.product.filter.map((item, index) => (
                <Col xs={12} sm={6} md={4} lg={3} key={index}>
                  <LabelField
                    type={item.type}
                    label={item.label}
                    option={item.option}
                    placeholder={item.placeholder}
                    labelDir="label-col"
                    fieldSize="w-100 h-md"
                  />
                </Col>
              ))} */}
              {isPermissionAdding && (
                <Col xl={12}>
                  {/* <div className="addPermission d-flex justify-content-row align-items-end gap-3"> */}
                  <LabelField
                    onChange={handleOnChange}
                    type="text"
                    label="Permission Name"
                    name="label"
                    value={permissionData.label}
                    placeholder="Enter Permission Name"
                    fieldSize="w-100 h-md"
                  />
                  {errorMessage.label && (
                    <p style={errorTxt}>{errorMessage.label}</p>
                  )}
                  <div className="submit_btn">
                    <button
                      className="btn normal-case btn-primary "
                      style={{
                        height: "35px",
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
                  {/* </div> */}
                </Col>
              )}
            </Row>
          </CardLayout>
          <CardLayout>
            <Row>
              <div className="header d-flex justify-content-between align-items-center">
                {/* <CardHeader title="basic information" /> */}
                <h5>Permission List</h5>
              </div>
              {/* <div class="carousel-container">
                <div class="carousel">
                  {eventsData.Ongoing_Events.map((events, index) => (
                    <Col key={index} xl={3}>
                      <EventCard events={events} type="Ongoing_Events" />
                    </Col>
                  ))}
                </div>
              </div> */}
              {/* {data?.product.filter.map((item, index) => (
                <Col xs={12} sm={6} md={4} lg={3} key={index}>
                  <LabelField
                    type={item.type}
                    label={item.label}
                    option={item.option}
                    placeholder={item.placeholder}
                    labelDir="label-col"
                    fieldSize="w-100 h-md"
                  />
                </Col>
              ))} */}
              <Col xl={12}>
                <PermissionTable
                  thead={data?.product.thead}
                  tbody={permissionList}
                />
                {/* <Pagination /> */}
              </Col>
            </Row>
          </CardLayout>
        </Col>
      </Row>
    </PageLayout>
  );
}
