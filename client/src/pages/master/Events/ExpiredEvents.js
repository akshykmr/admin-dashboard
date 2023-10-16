import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { CardLayout } from "../../../components/cards";
import EventTable from "../../../components/tables/EventTable";
import { Breadcrumb } from "../../../components";
// import { Pagination } from "../../../components";
import Anchor from "../../../components/elements/Anchor";
import PageLayout from "../../../layouts/PageLayout";
import data from "../../../data/master/expiredEvent.json";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LabelField from "../../../components/fields/LabelField";

export default function ExpiredEvent() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const serverUrl = process.env.REACT_APP_BASE_URL;

  const [fetchedExpiredEventData, setFetchedExpiredEventData] = useState();
  const [loader, setLoader] = useState(false);
  const [searchTerm, setSearchTerm] = useState();

  const fetchExpiredEvent = async () => {
    try {

      setLoader(true);
      const headers = { token: token };
      if (searchTerm) {
        if (searchTerm.length > 2) {
          const response = await axios.get(
           `${serverUrl}/event/searchExpiredEvent/${searchTerm}`,
            { headers }
          );
          setLoader(false);
          console.log("Expired Event List with search term", response.data);
          setFetchedExpiredEventData(response.data);
        }
      } else {
        const response = await axios.get(`${serverUrl}/event/fetchAllExpired`, {
          headers,
        });
        console.log("All Expired Events", response.data);
        setFetchedExpiredEventData(response.data);
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
      console.log(error, "error");
    }
  };

  useEffect(() => {
    if (token) {
      fetchExpiredEvent();
    }
  }, []);



  useEffect(() => {
    fetchExpiredEvent();
  }, [searchTerm]);

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
                <h5>Expired Events</h5>
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
              <Col xl={12}>
                <Row md={12} className="mb-4">
                  <Col>
                    <LabelField
                      value={searchTerm}
                      type="search"
                      label="search by"
                      placeholder="Event Name / Address"
                      onChange={handleSearch}
                      labelDir="label-col"
                      fieldSize="w-100 h-sm"
                    />
                  </Col>
                </Row>
                <EventTable
                  type={"expired-events"}
                  thead={data?.product.thead}
                  tbody={fetchedExpiredEventData}
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
