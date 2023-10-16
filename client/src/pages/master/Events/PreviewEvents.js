import React, { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../../../context/Themes";
import "./PreviewEvents.css";
import { Row, Col } from "react-bootstrap";
import { Item, Anchor } from "../../../components/elements";
import { Breadcrumb } from "../../../components";
import { CardLayout } from "../../../components/cards";
import PageLayout from "../../../layouts/PageLayout";
import data from "../../../data/master/MemberProfile.json";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function PreviewEvents() {
  const serverUrl = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const token = localStorage.getItem("token");
  const eventId = localStorage.getItem("eventId");
  const redirectedFrom = localStorage.getItem("redirectedFrom");

  const [evetnDetails, setEventDetails] = useState();
  const [eventImage, setEventImage] = useState([]);

  console.log(evetnDetails, "event details");

  const style = {
    color: theme === "dark_mode" ? "white" : "black",
    fontWeight: "900",
    fontSize: "15px",
    padding: "2px 6px",
    top: "8px",
    right: "8px",
  };

  useEffect(() => {
    if (token) {
      const fetchEventDetails = async () => {
        try {
          const headers = { token: token };
          const response = await axios.get(
            `${serverUrl}/event/fetch/${eventId}`,
            { headers }
          );

          if (response.status === 200) {
            console.log("event details of selected event", response.data);
            setEventDetails(response.data);
            const imageArray = response.data.image.map(
              (url) => `${serverUrl}${url}`
            );
            setEventImage(imageArray);
          }
        } catch (error) {
          console.log(error, "error");
        }
      };

      fetchEventDetails();
    }
  }, []);

  return (
    <PageLayout>
      <Row>
        <Col xl={12}>
          <CardLayout>
            <Breadcrumb title="Event Details">
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
          </CardLayout>
        </Col>
        <Col style={{ margin: "20px auto" }} xl={8}>
          <CardLayout>
            <button
              className="btn  btn-sm btn-circle position-absolute "
              style={style}
              onClick={() => navigate(`/${redirectedFrom}`)}
            >
              ✕
            </button>

            <div className="eventdetails_body">
              <div className="gallary">
                <div className="leftbox">
                  <img src={eventImage[0]} alt="EventImage" />
                </div>
                <div className="rightbox">
                  <span className="first_img">
                    <img src={eventImage[1]} alt="EventImage" />
                  </span>

                  <span className="last_img">
                    <img src={eventImage[2]} alt="EventImage" />
                    {/* <button onClick={()=>alert('hello')} className="svg">
                        <AiOutlinePlus/>
                        </button> */}
                  </span>
                </div>
              </div>
              <div className="description_body">
                <div className="header common_style">
                  <h4>Event Name</h4>
                  <h5>{evetnDetails?.name}</h5>
                </div>
                <div className="description common_style">
                  <h4 editable="true">About the Event</h4>
                  <p>{evetnDetails?.description}</p>
                </div>
                <div className="footer">
                  <span className="row-1">
                    <span className="timing common_style">
                      <h4>Timings</h4>
                      <p>{`${evetnDetails?.start_time} - ${evetnDetails?.end_time}`}</p>
                    </span>
                    <span className="duration common_style">
                      <h4>Duration</h4>
                      <p>{`${evetnDetails?.start_date} - ${evetnDetails?.end_date}`}</p>
                    </span>
                  </span>
                  <span className="location common_style">
                    <span className="row_first">
                      <h4 className="add">Address</h4>
                      <h4 className="loc">Location</h4>
                      <h4 className="type">Event Type</h4>
                      <h4 className="price">Ticket Price</h4>
                      <h4 className="capacity">Capacity</h4>
                    </span>
                    <span className="row_sec">
                      <p className="add">{evetnDetails?.address}</p>
                      <p className="loc">{`${evetnDetails?.lat},${evetnDetails?.long}`}</p>
                      <p className="type">{evetnDetails?.type}</p>
                      <p className="price">{evetnDetails?.price}</p>
                      <p className="capacity">{evetnDetails?.capacity}</p>
                    </span> 
                  </span>
                </div>
              </div>
            </div>
          </CardLayout>
        </Col>
      </Row>
    </PageLayout>
  );
}
