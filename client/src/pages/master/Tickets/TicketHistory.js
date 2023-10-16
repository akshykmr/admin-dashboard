import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { CardLayout, FloatCard } from "../../../components/cards";
import { Breadcrumb } from "../../../components";
// import { Pagination} from "../../../components";
import Anchor from "../../../components/elements/Anchor";
import PageLayout from "../../../layouts/PageLayout";
import data from "../../../data/master/ticketHistory.json";
import axios from "axios";
import TicketHistoryTable from "../../../components/tables/TicketHistoryTable";
import LabelField from "../../../components/fields/LabelField";
import ReactSelect from "../../../components/fields/ReactSelect";

export default function TicketHistory() {


  const token = localStorage.getItem("token");
  const serverUrl = process.env.REACT_APP_BASE_URL;

  const [ticketHistoryData, setTicketHistoryData] = useState();
  const [selectedParam, setSelectedParam] = useState();
  const [searchTerm, setSearchTerm] = useState();
  const [loader, setLoader] = useState(false);

  const [selectedParamValue, setSelectedParamValue] = useState({
    label :"All",
    Id:undefined
  });
  const [eventList, setEventList] = useState([{
    label:"All",
    Id:undefined
  }]);

  useEffect(() => {
    const fetchEventList = async () => {
      try {
        const response = await axios.get(
          `${serverUrl}/event/fetchAllEventForFilter`,
        );

        const eventArray = response.data.map((event) => ({
          label: event.name,
          Id: event._id
        }));
        
        setEventList((prevEventList) => [
          ...prevEventList,
          ...eventArray
        ]);
      } catch (e) {
        console.log(e, "error");
      }
    };
    fetchEventList();
  }, []);



  const fetchTicketHistory = async () => {
    try {
      setLoader(true);
      if (selectedParam) {
        const response = await axios.get(
          `${serverUrl}/eventBooking/userCameList?eventId=${selectedParam}`
        );
        setLoader(false);
        console.log("Ticket History based on selected event", response.data);
        setTicketHistoryData(response.data);

      } else if (searchTerm) {
        if (searchTerm.length > 2) {
          const response = await axios.get(
            `${serverUrl}/eventBooking/userCameList?bookingId=${searchTerm}`
          );
          setLoader(false);
          console.log("Ticket History based on search term", response.data);
          setTicketHistoryData(response.data);
        }
      } else {
        const response = await axios.get(
          `${serverUrl}/eventBooking/userCameList`
        );
        console.log("All Ticket history fetched", response.data);
        setTicketHistoryData(response.data);
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
      console.log(error, "error");
    }
  };



  useEffect(() => {
    if (token) {
      fetchTicketHistory(); // Call the async function immediately
    }
  }, []);

  useEffect(() => {
    fetchTicketHistory(); // Call the async function immediately
  }, [ selectedParam, searchTerm]);



  const handleFilter = (selectedvalue) => {
    setSelectedParam(selectedvalue.Id); // this is to get the id of selected event for filter
    setSelectedParamValue((preData)=>({
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
            count = ticketHistoryData?.length;
          } else if (index === 1) {
            count = ticketHistoryData?.filter(
              (member) => member.is_checked === false
            ).length;
          } else if (index === 2) {
            count = ticketHistoryData?.filter(
              (member) => member.is_checked === true
            ).length;
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
                <TicketHistoryTable
                  type={"ticket-history"}
                  thead={data?.ticketHistory.thead}
                  tbody={ticketHistoryData}
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
