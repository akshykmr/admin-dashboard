import React, { useState, useEffect } from "react";
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
import data from "../../data/master/forgot.json";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();

  // const navigate = useNavigate();

  const serverUrl = process.env.REACT_APP_BASE_URL;

  const [warningText, setWarningText] = useState("");
  const [submitter, setSubmitter] = useState(null)

  const [forgotPassData, setForgotPassData] = React.useState({
    // to store the input text
    UserId: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const [otpStatus, setOtpStatus] = useState("");

  const warningTxt = {
    fontSize: "11px",
    padding: "2px 0px",
    color: "#940e1d",
    position: "absolute",
  };

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    // const inputType = event.target.type;
    // console.log(inputType,'input type')
    setForgotPassData((prevValue) => {
      const updatedData = { ...prevValue, [name]: value };
      console.log(updatedData); // Add this line for debugging
      return updatedData;
    });
  };

  const isStrongpassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const validatePassword = () => {
    if (!forgotPassData.password) {
      toast.warn("Password is required.");
      return false; // Return false if password is missing.
    } else if (!isStrongpassword(forgotPassData.password)) {
      toast.warn("Invalid Password format.");
      return false; // Return false if password format is invalid.
    }
  
    if (!forgotPassData.confirmPassword) {
      toast.warn("Confirm Password is required.");
      return false; // Return false if confirm password is missing.
    } else if (!isStrongpassword(forgotPassData.confirmPassword)) {
      toast.warn("Invalid Confirm Password format.");
      return false; // Return false if confirm password format is invalid.
    }
  
    if (forgotPassData.password !== forgotPassData.confirmPassword) {
      toast.warn("Password and Confirm Password do not match");
      return false; // Return false if passwords don't match.
    }
  
    // If all conditions are met, return true.
    return true;
  };
  
  const initialTimeInSeconds = 15 * 60; // 15 minutes in seconds
  const [timeInSeconds, setTimeInSeconds] = useState(initialTimeInSeconds);
  const [counting, setCounting] = useState(false);

  useEffect(() => {
    let timer;

    if (counting && timeInSeconds > 0) {
      timer = setInterval(() => {
        setTimeInSeconds((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }

    return () => clearInterval(timer); // Clean up the timer when the component unmounts
  }, [counting, timeInSeconds]);

  // Convert the timeInSeconds to a decrease format
  const formatTime = () => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const startCountdown = () => {
    setTimeInSeconds(initialTimeInSeconds);
    setCounting(true);
  };

  const stopCountdown = () => {
    setCounting(false);
  };

  console.log(otpStatus, "otpstatus");

  useEffect(() => {
    let timeoutId;

    if (otpStatus === "otpIsSent") {
      startCountdown();
      setWarningText("Otp is valid for 15 minutes only");
      timeoutId = setTimeout(() => {
        setOtpStatus("otpIsExpired");
        setWarningText("Otp Expired");
        stopCountdown();
        setTimeInSeconds(null);
      }, 900000);
    }

    if (otpStatus === "otpIsVerified") {
      clearTimeout(timeoutId);
      stopCountdown();
      setTimeInSeconds(null);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [otpStatus]);

  useEffect(() => {
    return () => {
      stopCountdown();
    };
  }, []);


  
  const generateOtp = async () => {
    try {
      setSubmitter("Submitting...");
      const response = await axios.get(
        `${serverUrl}/auth/resend/${forgotPassData.UserId}`
      );
      if (response.status === 200) {
        toast.success("OTP is sent to your Registered Email Address");
        setOtpStatus("otpIsSent");
      setSubmitter(null);
      }
    } catch (error) {
      setSubmitter(null);

      if (error.response) {
        toast.error(error.response.msg);
        toast.error("error occured");
      } else if (error.request) {
        toast.error("Network error");
      } else {
        toast.error("An error occurred");
      }
    }
  };

  const handleVerifyOtp = async () => {
    console.log(forgotPassData.email,'email selected')
    try {
      setSubmitter("Submitting...");

      const data = {
        otp: forgotPassData.otp,
        email: forgotPassData.UserId
      };

      console.log('otp to be send', data)
      const response = await axios.post(`${serverUrl}/auth/verifyOtp`, data);
      console.log("response", response);
      if (response.status === 200) {
      setSubmitter(null);
        toast.success("OTP is Verified ");
        setOtpStatus("otpIsVerified");
      } else {
        setWarningText("Something went Wrong");
      setSubmitter(null);

  setForgotPassData((preData)=>({
    ...preData,
    otp :""
  }))
      }
    } catch (error) {
      setSubmitter(null);

    setForgotPassData((preData)=>({
        ...preData,
        otp :""
      }))
      if (error.response) {
        toast.error(error.response.msg);
        toast.error("An error occurred");
      } else if (error.request) {
        toast.error("Network error");
      } else {
        toast.error("An error occurred");
      }
    }
  };


  const handleResendOtp = async () => {
   generateOtp();
  };


  const handleSubmitPassword = async () => {
    const data = {
      password: forgotPassData.password,
       email : forgotPassData.UserId
    };
    console.log('generated password to be send', data)

  try {
    setSubmitter("Submitting...");

    const response = await axios.post(`${serverUrl}/auth/forgot-pass`, data);
    console.log("response", response);
  
    if (response.status === 200) {
      setSubmitter(null);

    setForgotPassData({
        password:"",
        confirmPassword :"",
        userId :"",
        email :""
      })
      toast.success("Password has been changed");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      setSubmitter(null);
      
      setWarningText("Something went Wrong");
    }
  } catch (error) {
    setSubmitter(null);

    if (error.response) {
      toast.error(error.response.msg);
      toast.error("An error occurred");
    } else if (error.request) {
      toast.error("Network error");
    } else {
      toast.error("An error occurred");
    }
  }
  };

  const submitForm = async (
    event,
    isSendingOtp,
    isResendingOtp,
    isVerifyingOtp,
    isSubmittingPassword
  ) => {
    event.preventDefault();

    if (isSendingOtp) {
      console.log("index 1")
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // check for Email Id ( Must be In Proper Formate)
      // const mobileRegex = /^[0-9]{10}$/; // check for Mobile No ( must be 10 digit)
      const userId = forgotPassData.UserId.trim();
      // const otp = forgotPassData.otp.trim();

      if (userId === "") {
        return toast.warn("Email is required!");
      } else if (emailRegex.test(userId)) {
        // Valid email address
        console.log("GettingOtp With Email Id");
        // Call API to check user credentials and save token in localstorage
        generateOtp();
      }
      // else if (mobileRegex.test(userId)) {
      //   // Valid mobile number

      //   // Call API to check user credentials and save token in localstorage
      //   generateOtp();
      //   console.log("GettingOtp with mobile no");
      // }
      else {
        // Neither email nor mobile format
        return toast.warn("Invalid email format");
      }
    }
    if (isResendingOtp) {
      handleResendOtp();

    }
    if (isVerifyingOtp) {
      if (!forgotPassData.otp) {
        toast.warn("Otp Is Required");

      } else handleVerifyOtp();
    }
    if (isSubmittingPassword) {

      const isFormValid = validatePassword();
      if (isFormValid) {
        handleSubmitPassword();
      }
    }
  };

  //   const generateOtp = async () => {
  //   toast.success("OTP is sent to your Registered Email Address");

  //   setOtpStatus("otpIsSent");
  //   console.log(otpStatus, "otpstatus");
  // };

  // const handleVerifyOtp = async () => {
  //   toast.success("OTP is Verified ");
  //   setOtpStatus("otpIsVerified");
    
  // };

  // const handleResendOtp = async () => {
  //   setOtpStatus("otpIsSent");
  // };

  // const handleSubmitPassword = async () => {
  //   toast.success("Reset Password is Successful");
  //   setOtpStatus(null);
  //   setForgotPassData({
  //     password:"",
  //     confirmPassword :"",
  //     userId :"",
  //     email :""
  //   })
  // };

  console.log('forgot data in form' ,forgotPassData)

  return (
    <Box className="mc-auth">
      <Image
        className="mc-auth-pattern"
        src={data?.pattern.src}
        alt={data?.pattern.alt}
      />
      <Box className="mc-auth-group">
        <Logo
          src={data?.logo.src}
          alt={data?.logo.alt}
          href={data?.logo.path}
          className="mc-auth-logo"
        />
        <Heading as="h4" className="mc-auth-title">
          {data?.title}
        </Heading>

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

        <Form className="mc-auth-form">
          {data?.input.map((item, index) => {
            if (
              index === 0 ||
              (otpStatus === "otpIsSent" && index === 1) ||
              (otpStatus === "otpIsVerified" && (index === 2 || index === 3))
            ) {
              let value;
              if (index === 0) {
                value = forgotPassData.UserId;
              } else if (index === 1) {
                value = forgotPassData.otp;
              } else if (index === 2) {
                value = forgotPassData.password;
              } else if (index === 3) {
                value = forgotPassData.confirmPassword;
              }

              return (
                <IconField
                  key={index}
                  icon={item.icon}
                  type={item.type}
                  name={item.name}
                  value={value}
                  onChange={handleOnChange}
                  classes={item.fieldSize}
                  placeholder={item.placeholder}
                  passwordVisible={item.passwordVisible}
                />
              );
            } else {
              return null;
            }
          })}
          {(otpStatus === "otpIsSent" || otpStatus === "otpIsExpired") && (
            <p
              className="d-flex justify-content-center position-relative text-warning"
              style={warningTxt}
            >
              {warningText} ({formatTime()})
            </p>
          )}
          {/* {data?.button.map((item, index) =>
            (isOtpSentExpired && index > 0) ||
            (!isOtpSentExpired && index === 0) ? (
              <Button
                key={index}
                onClick={submitForm}
                className={`mc-auth-btn ${item.fieldSize}`}
                type={item.type}
              >
                <span>{item.text} </span>
              </Button>
            ) : null
          )} */}
          {otpStatus === "otpIsSent" ? (
            <Button
              onClick={(event) => submitForm(event, false, false, true, false)} // Pass the event object
              className={`mc-auth-btn h-sm`}
              type="button"
            >
              <span>{submitter || "Verify OTP"}</span>
            </Button>
          ) : otpStatus === "otpIsExpired" ? (
            <Button
              onClick={(event) => submitForm(event, false, true, false, false)} // to resend the otp
              className={`mc-auth-btn h-sm`}
              type="button"
            >
              <span>{submitter || "Resend OTP"}</span>
            </Button>
          ) : otpStatus === "otpIsVerified" ? (
            <Button
              onClick={(event) => submitForm(event, false, false, false, true)} // Pass the event object
              className={`mc-auth-btn h-sm`}
              type="button"
            >
              <span>{submitter || "Submit"}</span>
            </Button>
          ) : (
            <Button
              onClick={(event) => submitForm(event, true, false, false, false)} // Pass the event object
              className={`mc-auth-btn h-sm`}
              type="button"
            >
              <span>{submitter ||  "Get OTP"}</span>
            </Button>
          )}
        </Form>
        <Box className="mc-auth-navigate">
          <Text as="span">{data?.navigate.title}</Text>
          <Anchor href={data?.navigate.path}>{data?.navigate.text}</Anchor>
        </Box>
      </Box>
    </Box>
  );
}
