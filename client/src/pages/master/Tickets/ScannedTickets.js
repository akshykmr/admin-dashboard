import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { CardLayout, FloatCard } from "../../../components/cards";
import { Breadcrumb } from "../../../components";
// import { Pagination} from "../../../components";
import Anchor from "../../../components/elements/Anchor";
import PageLayout from "../../../layouts/PageLayout";
import data from "../../../data/master/scannedTicketHistory.json";
import axios from "axios";
import ScannedTicketTable from "../../../components/tables/ScanedTicketTable";
import LabelField from "../../../components/fields/LabelField";
import ReactSelect from "../../../components/fields/ReactSelect";

export default function ScannedTicket() {
  const token = localStorage.getItem("token");
  const serverUrl = process.env.REACT_APP_BASE_URL;

  const [scanTicketData, setScanTicketData] = useState();
  const [selectedParam, setSelectedParam] = useState();
  const [searchTerm, setSearchTerm] = useState();
  const [loader, setLoader] = useState(false);

  const [selectedParamValue, setSelectedParamValue] = useState({
    label: "All",
    Id: undefined,
  });


  const [eventList, setEventList] = useState([
    {
      label: "All",
      Id: undefined,
    },
  ]);



  useEffect(() => {
    const fetchEventList = async () => {
      try {
        const response = await axios.get(
          `${serverUrl}/event/fetchAllEventForFilter`,
        );

        const eventArray = response.data.map((event) => ({
          label: event.name,
          Id: event._id,
        }));

        setEventList((prevEventList) => [...prevEventList, ...eventArray]);
      } catch (e) {
        console.log(e, "error");
      }
    };
    fetchEventList();
  }, []);



  const fetchScanTicketHistory = async () => {
    const headers = { token: token };

    try {
      setLoader(true);
      if (selectedParam) {
        const response = await axios.get(
          `${serverUrl}/eventBooking/userCameList?eventId=${selectedParam}`
        );
        setLoader(false);
        console.log("Ticket History based on selected event", response.data);
        setScanTicketData(response.data);
      } else if (searchTerm) {
        if (searchTerm.length > 2) {
          const response = await axios.get(
            `${serverUrl}/eventBooking/userCameList?bookingId=${searchTerm}`
          );
          setLoader(false);
          console.log("Ticket History based on search term", response.data);
          setScanTicketData(response.data);
        }
      } else {
        setLoader(true);
        const response = await axios.get(
          `${serverUrl}/eventBooking/allTicket`,
          { headers }
        );
        console.log(" Scanned Ticket history fetched", response.data);
        setScanTicketData(response.data);
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
      console.log(error, "error");
    }
  };

  useEffect(() => {
    if (token) {
      fetchScanTicketHistory(); // Call the async function immediately
    }
  }, []);



  useEffect(() => {
    fetchScanTicketHistory(); // Call the async function immediately
  }, [selectedParam, searchTerm]);



  const handleFilter = (selectedvalue) => {
    setSelectedParam(selectedvalue.Id); // this is to get the id of selected event for filter
    setSelectedParamValue((preData) => ({
      ...preData,
      label: selectedvalue.label, // this is to display the name of selected event for filter
    }));
  };


  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // console.log(selectedParam, "selectedParam");
  // console.log(eventList, "eventlist");
  // console.log(searchTerm,'searchTerm')

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
        {data?.float.map((item, index) => {
          let count = 0;

          if (index === 0) {
            count = scanTicketData?.length;
          }
          return (
            <Col xl={4} key={index}>
              <FloatCard
                variant={item.variant}
                digit={count}
                title={item.title}
                icon={item.icon}
              />
            </Col>
          );
        })}

        <Col xl={12}>
          <CardLayout>
            <Row md={2} className="mb-4">
              <Col xl={6}>
                <ReactSelect
                  label="Filter By Event"
                  value={selectedParamValue}
                  onChange={handleFilter}
                  options={eventList}
                />
              </Col>
              <Col xl={6}>
                <LabelField
                  margin="5px"
                  value={searchTerm}
                  type="search"
                  label="search by"
                  placeholder="Booking Id"
                  onChange={handleSearch}
                  labelDir="label-col"
                  fieldSize="w-100 h-sm"
                />
              </Col>
            </Row>
            <Row>
              <Col xl={12}>
                <ScannedTicketTable
                  type={"scanned-ticket-history"}
                  thead={data?.scanTicketData.thead}
                  tbody={scanTicketData}
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
