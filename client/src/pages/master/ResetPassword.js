import React, { useEffect, useState, use } from "react";
import { Row, Col, Tab, Tabs, Form } from "react-bootstrap";
import {
  LegendField,
  LegendTextarea,
  IconField,
} from "../../components/fields";
import { Item, Anchor, Box, Button, Image } from "../../components/elements";
import { CardLayout, TabCard } from "../../components/cards";
import { Breadcrumb, FileUpload } from "../../components";
import PageLayout from "../../layouts/PageLayout";
import data from "../../data/master/myAccount.json";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ResetPassword() {
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");
  const serverUrl = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();


  const [resetPassData, setResetPassData] = useState({
    oldPass: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState({
    oldPass: "",
    password: "",
  });

  const [submitter, setSubmitter] = useState("save changes");

  const handleOnChange = (e) => {
    const { name } = e.target;
    setErrorMessage((prevErrors) => ({ ...prevErrors, [name]: "" }));

    setResetPassData((prevValue) => ({ ...prevValue, [name]: e.target.value }));
    // }
  };

  // const isStrongpassword = (password) => {
  //   const regex =
  //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  //   return regex.test(password);
  // };





  const validateForm = () => {
    const errors = {};
    if (!resetPassData.password) {
      errors.password = "New Password is required.";
    }
    //  else if (!isStrongpassword(resetPassData.password)) {
    //   errors.Password = "Invalid Password format.";
    // }
    if (!resetPassData.oldPass) {
      errors.oldPass = "Old Password is required.";
    }
    // else if (!isStrongpassword(resetPassData.oldPass)) {
    //   errors.ConfirmPassword = "Invalid Password format.";
    // }

    setErrorMessage(errors);
    return Object.keys(errors).length === 0;
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const isFormValid = validateForm();

    if (isFormValid) {
      try {
        setSubmitter("Submitting...");
        const headers = {
          token: token,
        };

        const data = {
          oldPass: resetPassData.oldPass,
          password: resetPassData.password,
          email: email,
        };

        const response = await axios.post(
          `${serverUrl}/auth/changePass`,
          data,
          {
            headers,
          }
        );
        console.log(response, "reset password response");

        if (response.status === 200) {
          setSubmitter("save changes");
          toast.success(response.data.result);
          setResetPassData({
            oldPass: "",
            password: "",
          });
          setTimeout(() => {
          navigate("/login")
          localStorage.clear();
          }, 2000);
        }
      } catch (error) {
        console.error("Error:", error.response.data.error);
        toast.error(error.response.data.error);
        setSubmitter("save changes");
      }
    } else {
      toast.warn("All Fields are required");
    }
  };

  const errorTxt = {
    // color: theme === "dark_mode" ? "f8d85da8" : "black",
    fontSize: "11px",
    padding: "2px 0px",
    color: "#940e1d",
    position: "absolute",
  };
  return (
    <PageLayout>
      <Row>
        <ToastContainer />
        <Col xl={12}>
          <Breadcrumb title={data?.pageTitle}>
            {data?.breadcrumb.map((item, index) => (
              <Item key={index} className="mc-breadcrumb-item">
                {item.path ? (
                  <Anchor className="mc-breadcrumb-link" href={item.path}>
                    {item.text}
                  </Anchor>
                ) : (
                  item.text
                )}
              </Item>
            ))}
          </Breadcrumb>
        </Col>
        <Col xl={12}>
          <CardLayout>
            <Tabs defaultActiveKey="password" id="mc" className="mc-tabs">
              <Tab
                eventKey="password"
                title="Change Password"
                className="mc-tabpane password"
              >
                <TabCard title="generate password">
                  <Row>
                    <Col xs={12} md={12}>
                      <IconField
                        icon="email"
                        type="email"
                        readOnly={true}
                        value={email}
                        classes="w-100 h-lg"
                      />
                    </Col>
                    <Col xs={12} md={6}>
                      <IconField
                        icon="add_moderator"
                        type="password"
                        name="oldPass"
                        onChange={handleOnChange}
                        value={resetPassData.oldPass}
                        placeholder="old password"
                        classes="w-100 h-lg"
                        passwordVisible
                      />
                      {errorMessage.oldPass && (
                        <p style={errorTxt}>{errorMessage.oldPass}</p>
                      )}
                    </Col>
                    <Col xs={12} md={6}>
                      <IconField
                        icon="verified_user"
                        type="password"
                        name="password"
                        onChange={handleOnChange}
                        value={resetPassData.password}
                        placeholder="new password"
                        classes="w-100 h-lg"
                        passwordVisible
                      />
                      {errorMessage.password && (
                        <p style={errorTxt}>{errorMessage.password}</p>
                      )}
                    </Col>
                  </Row>
                </TabCard>

                <Button
                  className="mc-btn primary"
                  icon="verified"
                  text={submitter}
                  onClick={handleResetPassword}
                />
              </Tab>
              {/* <Tab
                eventKey="settings"
                title="other settings"
                className="mc-tabpane settings"
              >
                <Row xs={1} md={2}>
                  <Col>
                    <TabCard title="activity email settings">
                      <Form.Check
                        type="switch"
                        id="switch1"
                        label="Someone adds you as a connection"
                      />
                      <Form.Check
                        type="switch"
                        id="switch2"
                        label="you're sent a direct message"
                        defaultChecked
                      />
                      <Form.Check
                        type="switch"
                        id="switch3"
                        label="New membership approval"
                        defaultChecked
                      />
                      <Form.Check
                        type="switch"
                        id="switch4"
                        label="Send Copy To Personal Email"
                        defaultChecked
                      />
                      <Form.Check
                        type="switch"
                        id="switch5"
                        label="Tips on getting more out of PCT-themes"
                      />
                    </TabCard>
                  </Col>
                  <Col>
                    <TabCard title="product email settings">
                      <Form.Check
                        type="checkbox"
                        id="check1"
                        label="Someone adds you as a connection"
                        defaultChecked
                      />
                      <Form.Check
                        type="checkbox"
                        id="check2"
                        label="you're sent a direct message"
                        defaultChecked
                      />
                      <Form.Check
                        type="checkbox"
                        id="check3"
                        label="New membership approval"
                        defaultChecked
                      />
                      <Form.Check
                        type="checkbox"
                        id="check4"
                        label="Send Copy To Personal Email"
                      />
                      <Form.Check
                        type="checkbox"
                        id="check5"
                        label="Tips on getting more out of PCT-themes"
                      />
                    </TabCard>
                  </Col>
                </Row>
                <Button
                  className="mc-btn primary"
                  icon="verified"
                  text="update changes"
                />
              </Tab> */}
            </Tabs>
          </CardLayout>
        </Col>
      </Row>
    </PageLayout>
  );
}
