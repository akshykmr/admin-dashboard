import React,{useState, useEffect} from "react";
import { Row, Col } from "react-bootstrap";
import { CardLayout, FloatCard } from "../../../components/cards";
import EventTable from "../../../components/tables/EventTable";
import LabelField from "../../../components/fields/LabelField";
import { Pagination, Breadcrumb } from "../../../components";
import Anchor from "../../../components/elements/Anchor";
import PageLayout from "../../../layouts/PageLayout";
import data from "../../../data/master/productList.json";
import eventsData from "../../../data/master/EventData.json";
import EventCard from "./../EventCard";
import "./../Events.css";
import axios from "axios";
import {useNavigate} from "react-router-dom"




export default function ParkingPage() {

  const navigate = useNavigate();


  const [eventList, setEventList] = useState()
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

    
  const serverUrl = process.env.REACT_APP_BASE_URL;

  
  useEffect(() => {
    if(token){
      const fetchEventList = async () => {
          try {
          //   console.log(token,'token from local storage')
  
            const headers = { token: token};
          //   console.log("header", headers);
  
            const response = await axios.get(`${serverUrl}/event/fetchAll`, {headers});
            console.log("response", response.data);
            // console.log("response", response.data[2].permission[0].label);
            setEventList(response.data)
          } catch (error) {
            console.log(error, "error");
          }
        }
    // if(role === 'super_admin'){
      fetchEventList(); // Call the async function immediately
    // }
     
    }
    }, [token]);

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
        {data?.float.map((item, index) => (
          <Col key={index} sm={6} lg={4}>
            <FloatCard
              variant={item.variant}
              digit={item.digit}
              title={item.title}
              icon={item.icon}
            />
          </Col>
        ))}
        <Col xl={12}>
          <CardLayout>
            <Row>
              <div className="header d-flex justify-content-between align-items-center">
                {/* <CardHeader title="basic information" /> */}
                <h5>Ongoing Event</h5>
                <button
                  className="btn px-6 normal-case btn-primary "
                  style={{
                    height: "30px",
                    padding: "2px 10px",
                    display: "flex",
                    alignItems: "center",
                  }}
                  onClick={()=> navigate("/create-event")}
                >
                  Create Event
                </button>
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
              {data?.product.filter.map((item, index) => (
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
              ))}
              <Col xl={12}>
                <EventTable
                  thead={data?.product.thead}
                  tbody={eventList} 
                />
                <Pagination />
              </Col>
            </Row>
          </CardLayout>
        </Col>
      </Row>
    </PageLayout>
  );
}
