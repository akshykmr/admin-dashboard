import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { CardLayout } from "../../../components/cards";
import ParkingTable from "../../../components/tables/ParkingTable";
import LabelField from "../../../components/fields/LabelField";
// import { Pagination} from "../../../components";
import { Breadcrumb } from "../../../components";
import Anchor from "../../../components/elements/Anchor";
import PageLayout from "../../../layouts/PageLayout";
import data from "../../../data/master/parkingSlotDetails.json";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ParkingSlotDetails() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const parkId = localStorage.getItem("parkId");
  
  const serverUrl = process.env.REACT_APP_BASE_URL;

  const [fetchedAllParkingData, setFetchedAllParkingData] = useState();
  const [selectedParam, setSelectedParam] = useState();
  const [loader, setLoader] = useState();



  const FetchSingleParking = async () => {
    try {
      setLoader(true);
      const response = await axios.get(
        `${serverUrl}/vechicle/getAllVehicleList/${parkId}`,
       
      );
      console.log("Parking List with fileter param", response.data);
      setFetchedAllParkingData(response.data);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.log(error, "error");
    }
  };

  useEffect(() => {
    if (token) {
      FetchSingleParking();
    }
  }, []);

  useEffect(() => {
    FetchSingleParking();
  }, [selectedParam]);

  const handleFilter = (e) => {
    setSelectedParam(e.target.value);
    if (e.target.value === "Active") {
      setParam(false);
    } else if (e.target.value === "Inactive") {
      setParam(true);
    }
  };

  return (
    <PageLayout>
      <Row>
        <Col xl={12}>
          <CardLayout>
            <Breadcrumb title="A Block Parking">
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
        {/* {data?.float.map((item, index) => (
          <Col key={index} sm={6} lg={4}>
            <FloatCard
              variant={item.variant}
              digit={item.digit}
              title={item.title}
              icon={item.icon}
            />
          </Col>
        ))} */}
        <Col xl={12}>
          <CardLayout>
            <Row>
              <div className="header d-flex justify-content-between align-items-center">
                {/* <CardHeader title="basic information" /> */}
                <h5>Check In - Check Out History</h5>
                {/* <button
                  className="btn px-6 normal-case btn-primary "
                  style={{
                    height: "30px",
                    padding: "2px 10px",
                    display: "flex",
                    alignItems: "center",
                  }}
                  onClick={() => navigate("/add-parking")}
                >
                  Add Parking
                </button> */}
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
              <Row md={12} className="mb-4">
                {data?.product.filter.map((item, index) => (
                  <Col key={index}>
                    <LabelField
                      value={selectedParam}
                      type={item.type}
                      label={item.label}
                      option={item.option}
                      placeholder={item.placeholder}
                      onChange={handleFilter}
                      labelDir="label-col"
                      fieldSize="w-100 h-sm"
                    />
                  </Col>
                ))}
              </Row>
              <Col xl={12}>
                <ParkingTable
                  type={"all-parking"}
                  thead={data?.product.thead}
                  tbody={fetchedAllParkingData}
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
