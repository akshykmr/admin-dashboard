import React, { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../../../context/Themes";
import "./TicketDetails.css";
import { Row, Col } from "react-bootstrap";
import {
  List,
  Item,
  Icon,
  Text,
  Box,
  Anchor,
} from "../../../components/elements";
import {
  Breadcrumb,
  DivideTitle,
  DuelText,
} from "../../../components";
import { CardLayout } from "../../../components/cards";
import PageLayout from "../../../layouts/PageLayout";
import data from "../../../data/master/ticketDetails.json";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BsQrCode } from "react-icons/bs";

export default function TicketDetails() {
  const navigate = useNavigate();

  const { theme } = useContext(ThemeContext);
  const serverUrl = process.env.REACT_APP_BASE_URL;
  const ticketId = localStorage.getItem("ticketId");
  const redirectedFrom = localStorage.getItem("redirectedFrom");

  const style = {
    color: theme === "dark_mode" ? "white" : "black",
    fontWeight: "900",
    fontSize: "15px",
    padding: "2px 6px",
  };

  const [ticketData, setTicketData] = useState();


  const fetchTicketData = async () => {
    try {
      const response = await axios.get(
        `${serverUrl}/eventBooking/getSingleTicket/${ticketId}`
      );
      console.log("fetched Ticket Data", response.data);
      setTicketData(response.data);
    } catch (error) {
      navigate(`/${redirectedFrom}`);
      console.log(error, "error");
    }
  };

  useEffect(() => {
    fetchTicketData();
  }, []);


  return (
    <PageLayout>
      <Row>
        <Col xl={12}>
          <CardLayout>
            <Breadcrumb title="ticket Details">
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
        <Col style={{ margin: "20px auto" }} xl={5}>
          <CardLayout>
            <div className="header  d-flex justify-content-between align-items-center ">
              {/* <CardHeader title="basic information" /> */}
              <h5 className="opacity-0">Ticket Details</h5>
              <button
                className="btn btn-sm btn-circle absolute"
                style={style}
                onClick={() => navigate(`/${redirectedFrom}`)}
              >
                ✕
              </button>
            </div>
            <Box className="mc-user-group">
              <Box className="mc-user-profile">
                <span className="ticket_svg">
                  <BsQrCode />
                </span>

                <div className="role">
                  <DuelText
                    title={ticketData?.booked_by?.name}
                    size={data?.profile?.size}
                  />
                  <span className="d-flex  flex-row gap-2 mt-2  align-items-center">
                    <Icon
                      className="material-icons"
                      style={{ fontSize: "18px", color: "#be0ee1" }}
                    >
                      event
                    </Icon>
                    <h6> Event Name :</h6>
                    <p> {ticketData?.event_id?.name}</p>
                  </span>
                  <span className="d-flex  flex-row gap-2 mt-2  align-items-center">
                    <Icon
                      className="material-icons"
                      style={{ fontSize: "18px", color: "#be0ee1" }}
                    >
                      format_list_numbered
                    </Icon>
                    <h6> Booking Id : </h6>
                    <p>{ticketData?.booking_id}</p>
                  </span>
                </div>
              </Box>
              <Box className="mb-4">
                <DivideTitle title="communication" className="mb-4" />
                <List className="mc-user-metalist">
                  <Item>
                    <Icon>phone_in_talk</Icon>
                    <Text as="span">{ticketData?.booked_by?.phone}</Text>
                  </Item>
                  <Item>
                    <Icon>feed</Icon>
                    <Text as="span">{ticketData?.booked_by?.email}</Text>
                  </Item>
                </List>
              </Box>
              <Box className="d-flex gap-2">
                <DivideTitle title="Quantity" className="mb-3 devider" />
                <DivideTitle title="Ticket Price" className="mb-3 devider" />
                <DivideTitle title="Paid Amount" className="mb-3 devider" />
              </Box>
              <Box className="mb-4 d-flex gap-2">
                <Text className=" devider">
                  {ticketData?.totalUser}
                </Text>
                <Text className=" devider">
                ⟨₹⟩ {ticketData?.event_id?.price}
                </Text>
                <Text className=" devider">
                ⟨₹⟩   {ticketData?.ticket_amount}
                </Text>
              </Box>

              <Box className="d-flex gap-2">
              <DivideTitle title="Status" className="mb-3 devider" />
                <DivideTitle title="Booking Date" className="mb-3 devider" />
                <DivideTitle title="Event Date" className="mb-3 devider" />
              </Box>
              <Box className="mb-4 d-flex gap-2">
              {ticketData?.is_checked === false ? (
                  <Text className="devider green">Unchecked Ticket</Text>
                ) : (
                  <Text className="devider red">Checked</Text>
                )}
                <Text className="devider">
                  {`${ticketData?.createdAt.slice(
                    8,
                    10
                  )}-${ticketData?.createdAt.slice(
                    5,
                    7
                  )}-${ticketData?.createdAt.slice(0, 4)}`}
                </Text>
                <Text className="devider">
                  {ticketData?.event_id?.start_date
                    .split("-")
                    .reverse()
                    .join("-")}
                </Text>
               
              </Box>
            </Box>
          </CardLayout>
        </Col>
      </Row>
    </PageLayout>
  );
}
