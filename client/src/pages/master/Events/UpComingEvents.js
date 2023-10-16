import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { CardLayout } from "../../../components/cards";
import EventTable from "../../../components/tables/EventTable";
import LabelField from "../../../components/fields/LabelField";
// import { Pagination} from "../../../components";
import { Breadcrumb } from "../../../components";
import Anchor from "../../../components/elements/Anchor";
import PageLayout from "../../../layouts/PageLayout";
import data from "../../../data/master/upComingEvent.json";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UpComingEvents() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const serverUrl = process.env.REACT_APP_BASE_URL;

  const [fetchedUpcomingEventData, setFetchedUpcomingEventData] = useState();

  const [statusTerm, setStatusTerm] = useState();

  const [selectedParam, setSelectedParam] = useState();

  const [searchTerm, setSearchTerm] = useState();
  const [loader, setLoader] = useState(false);



  const fetchUpcomingEvent = async () => {
    try {
      setLoader(true);

      const headers = { token: token };

      if (statusTerm === "active" || statusTerm === "Inactive") {
        const response = await axios.get(
          `${serverUrl}/event/fetchAllUpComming?type=${selectedParam}`,
          { headers }
        );
        setLoader(false);
        console.log("Upcoming Event List based on Status", response.data);
        setFetchedUpcomingEventData(response.data);


      } else if (selectedParam === "free" || selectedParam === "paid") {
        const response = await axios.get(
          `${serverUrl}/event/fetchAllUpComming?type=${selectedParam}`,
          { headers }
        );
        setLoader(false);
        console.log("Upcoming Event List with fileter param", response.data);
        setFetchedUpcomingEventData(response.data);


      } else if (searchTerm) {
        if (searchTerm.length > 2) {
          const response = await axios.get(
            `${serverUrl}/event/searchUpcommingEvent/${searchTerm}`,
            { headers }
          );
          setLoader(false);
          console.log("Upcoming Event List with search term", response.data);
          setFetchedUpcomingEventData(response.data);


        }
      } else {
        const response = await axios.get(
          `${serverUrl}/event/fetchAllUpComming`,
          { headers }
        );
        setLoader(false);
        console.log("All Events ", response.data);
        setFetchedUpcomingEventData(response.data);
      }
    } catch (error) {
      setLoader(false);

      console.log(error, "error");
    }
  };

  useEffect(() => {
    if (token) {
      fetchUpcomingEvent(); // Call the async function immediately
    }
  }, []);

  useEffect(() => {
    fetchUpcomingEvent(); // Call the async function immediately
  }, [statusTerm, selectedParam, searchTerm]);

  const handleFilterByStatus = (e) => {
    setStatusTerm(e.target.value);
  };

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
                <h5>Upcoming Events</h5>
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
             
              <Row md={3} className="mb-4">
                {data?.event.filter.map((item, index) => (
                  <Col key={index}>
                    <LabelField
                      value={
                        index === 0
                          ? statusTerm
                          : index === 1
                          ? selectedParam
                          : searchTerm
                      }
                      type={item.type}
                      label={item.label}
                      option={item.option}
                      placeholder={item.placeholder}
                      onChange={
                        index === 0
                          ? handleFilterByStatus
                          : index === 1
                          ? handleFilter
                          : handleSearch
                      }
                      labelDir="label-col"
                      fieldSize="w-100 h-sm"
                    />
                  </Col>
                ))}
              </Row>
              <Col xl={12}>
                <EventTable
                  type={"upcoming-events"}
                  thead={data?.event.thead}
                  tbody={fetchedUpcomingEventData}
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
