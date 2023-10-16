import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { CardLayout } from "../../../components/cards";
import EventTable from "../../../components/tables/EventTable";
import LabelField from "../../../components/fields/LabelField";
// import { Pagination} from "../../../components";
import { Breadcrumb } from "../../../components";
import Anchor from "../../../components/elements/Anchor";
import PageLayout from "../../../layouts/PageLayout";
import data from "../../../data/master/onGoingEvent.json";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function OngoingEvent() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const serverUrl = process.env.REACT_APP_BASE_URL;

  const [fetchedOngoingEventData, setFetchedOngoingEventData] = useState();
  const [selectedParam, setSelectedParam] = useState();
  const [searchTerm, setSearchTerm] = useState();
  const [loader, setLoader] = useState(false);

  const fetchOngoingEvent = async () => {
    try {
      setLoader(true);
      const headers = { token: token };
      if (selectedParam === "free" || selectedParam === "paid") {
        const response = await axios.get(
          `${serverUrl}/event/fetchAllOngoing?type=${selectedParam}`,
          { headers }
        );
        console.log("Ongoing Event List with fileter param", response.data);
        setFetchedOngoingEventData(response.data);
        setLoader(false);
      } else if (searchTerm) {
        if (searchTerm.length > 2) {
          const response = await axios.get(
            `${serverUrl}/event/searchOnGoingEvent/${searchTerm}`, { headers }
          );
          console.log("Ongoing Event List with search term", response.data);
          setFetchedOngoingEventData(response.data);
          setLoader(false);
        }
      } else {
        const response = await axios.get(`${serverUrl}/event/fetchAllOngoing`, {
          headers,
        });

        console.log("All Ongoing Events ", response.data);
        setFetchedOngoingEventData(response.data);
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
      console.log(error, "error");
    }
  };

  useEffect(() => {
    if (token) {
      fetchOngoingEvent(); // Call the async function immediately
    }
  }, []);

  useEffect(() => {
    fetchOngoingEvent(); // Call the async function immediately
  }, [selectedParam, searchTerm]);

  const handleFilter = (e) => {
    setSelectedParam(e.target.value);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
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
                  onClick={() => navigate("/add-event")}
                >
                  Add Event
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
              <Row md={2} className="mb-4">
                {data?.product.filter.map((item, index) => (
                  <Col key={index}>
                    <LabelField
                      value={index === 0 ? selectedParam : searchTerm}
                      type={item.type}
                      label={item.label}
                      option={item.option}
                      placeholder={item.placeholder}
                      onChange={index === 0 ? handleFilter : handleSearch}
                      labelDir="label-col"
                      fieldSize="w-100 h-sm"
                    />
                  </Col>
                ))}
              </Row>
              <Col xl={12}>
                <EventTable
                  type={"ongoing-events"}
                  thead={data?.product.thead}
                  tbody={fetchedOngoingEventData}
                  loader={loader}
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
