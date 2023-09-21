import React, { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom"
import {
  Box,
  Form,
  Heading,
  Button,
  Anchor,
  Image,
  Text,
} from "../../components/elements";
import IconField from "../../components/fields/IconField";
import Logo from "../../components/Logo";
import "./Login.css";
import data from "../../data/master/login.json";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {

  const navigate = useNavigate();

  // const serverUrl = `https://api.kullu.dev.client.kloudlite.io/auth/login`;
  
  const serverUrl = process.env.REACT_APP_BASE_URL;

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [logInData, setLogInData] = React.useState({
    // to store the input text
    UserId: "",
    password: "",
  });

  console.log(logInData, "logIndata");

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setLogInData((prevValue) => {
      const updatedData = { ...prevValue, [name]: value };
      console.log(updatedData); // Add this line for debugging
      return updatedData;
    });
  };

  //   useEffect(()=>{
  //     if(token){
  //         window.location.href = "/ecommerce";
  //     }
  //   },[token])

  const handleLogIn = async () => {
    try {
      setLoading(true);
      const data = {
        userId: logInData.UserId,
        password: logInData.password,
      };
      // console.log(data,'data')
      const response = await axios.post(`${serverUrl}/auth/login`, data);
      console.log("response", response);
      if (response.status === 200) {

        toast.success("Login successful");
        
        setTimeout(() => {
          console.log("Message", response.data.msg);
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("role", response.data.role);
          setLoading(false);
          setLogInData({
            emailId: "",
            password: "",
          });
          // window.location.href = "/home";
          navigate("/")
        }, 1000);
      } else {
        setLoading(false);
        setErrorMessage(response.error);
      }
    } catch (error) {
      setLoading(false);
      if (error.response) {
        const { status } = error.response;
        switch (status) {
          case 404:
            toast.error("Email and password not found");
            break;
          case 405:
            toast.error("Unable to log in");
            break;
          case 401:
            toast.error("Email and mobile not authorized");
            break;
          case 406:
            toast.error("Email or Password Invalid");
            break;
          default:
            toast.error("An error occurred");
            break;
        }
      } else if (error.request) {
        toast.error("Network error");
      } else {
        toast.error("An error occurred");
      }
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // check for Email Id ( Must be In Proper Formate)
    const mobileRegex = /^[0-9]{10}$/; // check for Mobile No ( must be 10 digit)
    const userId = logInData.UserId.trim();
    const password = logInData.password.trim();

    if (userId === "") {
      return  toast.warn(
        "Email or Mobile Number is required! (use any value)"
      );
    } else if (emailRegex.test(userId)) {
      // Valid email address
      if (password === "") {
        return  toast.warn("Password is required! (use any value)");
      } else {
        setLoading(true);
        console.log("api calling1");
        // Call API to check user credentials and save token in localstorage
        handleLogIn();
      }
    } else if (mobileRegex.test(userId)) {
      // Valid mobile number
      if (password === "") {
        return  toast.warn("Password is required! (use any value)");
      } else {
        setLoading(true);
        // Call API to check user credentials and save token in localstorage
        handleLogIn();
        console.log("api calling2");
      }
    } else {
      // Neither email nor mobile format
      return  toast.warn("Invalid email or mobile format");
    }
  };

  return (
    <Box className="mc-auth">
      <Image
        src={data?.pattern.src}
        alt={data?.pattern.alt}
        className="mc-auth-pattern"
      />
      <Box className="mc-auth-group d-flex flex-column justify-content-center h-100">
        <Logo
          src={data?.logo.src}
          alt={data?.logo.alt}
          href={data?.logo.path}
          className="mc-auth-logo"
        />
        <Heading as="h4" className="mc-auth-title">
          {data?.title}
        </Heading>
        <Form className="mc-auth-form">
          {data?.input.map((item, index) => (
            <IconField
              key={index}
              name={item.name}
              value={index === 0 ? logInData.UserId : logInData.password}
              onChange={handleOnChange}
              icon={item.icon}
              type={item.type}
              option={item.option}
              classes={item.fieldSize}
              placeholder={item.placeholder}
              passwordVisible={item.passwordVisible}
            />
          ))}
          <p className="text-danger mb-3" style={{ fontSize: "11px" }}>
            {errorMessage}
            <ToastContainer
              oastContainer
              // position="bottom-center"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </p>
          <Button
            onClick={submitForm}
            className={`mc-auth-btn ${data?.button.fieldSize}`}
            type={data?.button.type}
          >
            {!loading ? (
              <span>{data?.button.text} </span>
            ) : (
              <>
                {" "}
                Loading...
                <svg viewBox="25 25 50 50">
                  <circle r="20" cy="50" cx="50"></circle>
                </svg>
              </>
            )}
          </Button>
          {/* <Anchor className="mc-auth-forgot" href={ data?.forgot.path }>{ data?.forgot.text }</Anchor>
                    <Box className="mc-auth-divide"><Text as="span">{ data?.divide.text }</Text></Box>
                    <Box className="mc-auth-connect">
                        {data?.connect.map((item, index) => (
                            <Anchor key={ index } href={ item.path } className={ item.classes }>
                                <i className={ item.icon }></i>
                                <span>{ item.text }</span>
                            </Anchor>
                        ))}
                    </Box> */}
        </Form>
        {/* <Box className="mc-auth-navigate">
                    <Text as="span">{ data?.navigate.title }</Text>
                    <Anchor href={ data?.navigate.path }>{ data?.navigate.text }</Anchor>
                </Box> */}
      </Box>
    </Box>
  );
}
