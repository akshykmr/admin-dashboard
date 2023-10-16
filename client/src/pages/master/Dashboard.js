import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { Breadcrumb } from "../../components";
import PageLayout from "../../layouts/PageLayout";
import data from "../../data/master/ecommerce.json";
import { Box, Item, Anchor } from "../../components/elements";
import { EcommerceCard } from "../../components/cards";
import CardLayout from "../../components/cards/CardLayout";
import axios from "axios";
import "./Dashboard.css";

const loader = () => {
  return (
    <div class="dashboard_loading">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
};

export default function Dashboard() {
  const serverUrl = process.env.REACT_APP_BASE_URL;

  const token = localStorage.getItem("token");

  const [dashboradData, setDashboardData] = useState({
    totalBanner: "",
    activeBanner: "",
    inactiveBanner: "",

    totalAdmin: "",
    activeAdmin: "",
    blockedAdming: "",

    totalUsers: "",
    activeUsers: "",
    blockedUsers: "",

    totalEvents: "",
    upcomingEvents: "",
    ongoingEvents: "",
    ExpiredEvents: "",

    freeEvents: "",
    paidEvents: "",

    totalParking: "",
    assignedParking: "",
    unassignedParking: "",

    activeparking: "",
    inactiveParking: "",

    totalTicketBooked: "",
    scannedTickets: "",
    remainingTickets: "",
  });

  const fetcheDashBaordCount = async () => {
    try {
      const headers = { token: token };

      const response = await axios.get(
        `${serverUrl}/dashboard/getDashboardData`,
        { headers }
      );

      if (response.status === 200) {
        console.log("fetchedData of Dashboard", response);

        setDashboardData({
          totalBanner: response.data?.bannerData?.totalBannerCount,
          activeBanner: response.data?.bannerData?.activeBanner,
          inactiveBanner: response.data?.bannerData?.notActiveBanner,

          totalAdmin: response.data?.membersData?.total,
          activeAdmin: response.data?.membersData?.activeCount,
          blockedAdming: response.data?.membersData?.inActiveCount,

          totalUsers: response.data?.userData?.total,
          activeUsers: response.data?.userData?.activeCount,
          blockedUsers: response.data?.userData?.inActiveCount,

          totalEvents: response.data?.eventData?.allEvents,
          upcomingEvents: response.data?.eventData?.upComingEvent,
          ongoingEvents: response.data?.eventData?.ongoingEvent,
          ExpiredEvents: response.data?.eventData?.expiredEvent,

          freeEvents: response.data?.eventData?.freeEventCount,
          paidEvents: response.data?.eventData?.paidEventCount,

          totalParking: response.data?.parkingData?.countTotalCount,
          assignedParking: response.data?.parkingData?.assignList,
          unassignedParking: response.data?.parkingData?.unassignList,

          // activeparking:response.data?.parkingData?.activeCount,
          // inactiveParking:response.data?.parkingData?.inActiveCount,

          // totalTicketBooked:response.data?,
          // scannedTickets:response.data?,
          // remainingTickets:response.data?
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (token) {
      fetcheDashBaordCount();
    }
  }, []);

  console.log(dashboradData, "dashboradData");

  return (
    <PageLayout>
      <Row>
        <Col xl={12}>
          <Box className="mc-card">
            <Breadcrumb title={data?.pageTitle}>
              {data?.breadcrumb?.map((item, index) => (
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
          </Box>
        </Col>

        <Col xl={12}>
          <CardLayout>
            <Row md={2} className="mb-4">
              <h3>Homapage</h3>
              <Col xs={12} xl={12}>
                <Row xs={1} sm={3}>
                  {data?.homepage?.map((item, index) => {
                    let count = ""; // Initialize the count variable

                    if (index === 0) {
                      count =
                        dashboradData.totalBanner !== undefined
                          ? dashboradData.totalBanner
                          : loader();
                    } else if (index === 1) {
                      count =
                        dashboradData.activeBanner !== undefined
                          ? dashboradData.activeBanner
                          : loader();
                    } else if (index === 2) {
                      count =
                        dashboradData.inactiveBanner !== undefined
                          ? dashboradData.inactiveBanner
                          : loader();
                    }

                    return (
                      <Col key={index}>
                        <EcommerceCard
                          icon={item.icon}
                          // trend={item.trend}
                          title={item.title}
                          number={count} // Use the dynamically calculated count
                          variant={item.variant}
                          // percent={item.percent}
                          // compare={item.compare}
                          // dotsMenu={item.dotsMenu}
                        />
                      </Col>
                    );
                  })}
                </Row>
              </Col>
            </Row>
          </CardLayout>
        </Col>

        <Col xl={12}>
          <CardLayout>
            <Row md={2} className="mb-4">
              <h3>Team</h3>
              <Col xs={12} xl={12}>
                <Row xs={1} sm={3}>
                  {data?.team?.map((item, index) => {
                    let count = ""; // Initialize the count variable

                    if (index === 0) {
                      count =
                        dashboradData.totalAdmin !== undefined
                          ? dashboradData.totalAdmin
                          : loader();
                    } else if (index === 1) {
                      count =
                        dashboradData.activeAdmin !== undefined
                          ? dashboradData.activeAdmin
                          : loader();
                    } else if (index === 2) {
                      count =
                        dashboradData.blockedAdming !== undefined
                          ? dashboradData.blockedAdming
                          : loader();
                    }

                    return (
                      <Col key={index}>
                        <EcommerceCard
                          icon={item.icon}
                          // trend={item.trend}
                          title={item.title}
                          number={count}
                          variant={item.variant}
                          // percent={item.percent}
                          // compare={item.compare}
                          // dotsMenu={item.dotsMenu}
                        />
                      </Col>
                    );
                  })}
                </Row>
              </Col>
            </Row>
          </CardLayout>
        </Col>

        <Col xl={12}>
          <CardLayout>
            <Row md={2} className="mb-4">
              <h3>Users</h3>
              <Col xs={12} xl={12}>
                <Row xs={1} sm={3}>
                  {data?.users?.map((item, index) => {
                    let count = ""; // Initialize the count variable

                    if (index === 0) {
                      count =
                        dashboradData.totalUsers !== undefined
                          ? dashboradData.totalUsers
                          : loader();
                    } else if (index === 1) {
                      count =
                        dashboradData.activeUsers !== undefined
                          ? dashboradData.activeUsers
                          : loader();
                    } else if (index === 2) {
                      count =
                        dashboradData.blockedUsers !== undefined
                          ? dashboradData.blockedUsers
                          : loader();
                    }

                    return (
                      <Col key={index}>
                        <EcommerceCard
                          icon={item.icon}
                          // trend={item.trend}
                          title={item.title}
                          number={count}
                          variant={item.variant}
                          // percent={item.percent}
                          // compare={item.compare}
                          // dotsMenu={item.dotsMenu}
                        />
                      </Col>
                    );
                  })}
                </Row>
              </Col>
            </Row>
          </CardLayout>
        </Col>

        <Col xl={12}>
          <CardLayout>
            <Row md={2} className="mb-4">
              <h3>Events</h3>
              <Col xs={12} xl={12}>
                <Row xs={1} sm={4}>
                  {data?.event?.map((item, index) => {
                    let count = ""; // Initialize the count variable

                    if (index === 0) {
                      count =
                        dashboradData.totalEvents !== undefined
                          ? dashboradData.totalEvents
                          : loader();
                    } else if (index === 1) {
                      count =
                        dashboradData.upcomingEvents !== undefined
                          ? dashboradData.upcomingEvents
                          : loader();
                    } else if (index === 2) {
                      count =
                        dashboradData.ongoingEvents !== undefined
                          ? dashboradData.ongoingEvents
                          : loader();
                    } else if (index === 3) {
                      count =
                        dashboradData.ExpiredEvents !== undefined
                          ? dashboradData.ExpiredEvents
                          : loader();
                    }

                    return (
                      <Col key={index}>
                        <EcommerceCard
                          icon={item.icon}
                          // trend={item.trend}
                          title={item.title}
                          number={count}
                          variant={item.variant}
                          // percent={item.percent}
                          // compare={item.compare}
                          // dotsMenu={item.dotsMenu}
                        />
                      </Col>
                    );
                  })}
                </Row>
              </Col>
              <Col xs={12} xl={12}>
                <Row xs={1} sm={2}>
                  {data?.eventsStatus?.map((item, index) => {
                    let count = ""; // Initialize the count variable

                    if (index === 0) {
                      count =
                        dashboradData.freeEvents !== undefined
                          ? dashboradData.freeEvents
                          : loader();
                    } else if (index === 1) {
                      count =
                        dashboradData.paidEvents !== undefined
                          ? dashboradData.paidEvents
                          : loader();
                    }

                    return (
                      <Col key={index}>
                        <EcommerceCard
                          icon={item.icon}
                          // trend={item.trend}
                          title={item.title}
                          number={count}
                          variant={item.variant}
                          // percent={item.percent}
                          // compare={item.compare}
                          // dotsMenu={item.dotsMenu}
                        />
                      </Col>
                    );
                  })}
                </Row>
              </Col>
            </Row>
          </CardLayout>
        </Col>

        <Col xl={12}>
          <CardLayout>
            <Row md={2} className="mb-4">
              <h3>Parking</h3>
              <Col xs={12} xl={12}>
                <Row xs={1} sm={3}>
                  {data?.parking?.map((item, index) => {
                    let count = ""; // Initialize the count variable

                    if (index === 0) {
                      count =
                        dashboradData.totalParking !== undefined
                          ? dashboradData.totalParking
                          : loader();
                    } else if (index === 1) {
                      count =
                        dashboradData.assignedParking !== undefined
                          ? dashboradData.assignedParking
                          : loader();
                    } else if (index === 2) {
                      count =
                        dashboradData.unassignedParking !== undefined
                          ? dashboradData.unassignedParking
                          : loader();
                    }

                    return (
                      <Col key={index}>
                        <EcommerceCard
                          icon={item.icon}
                          // trend={item.trend}
                          title={item.title}
                          number={count}
                          variant={item.variant}
                          // percent={item.percent}
                          // compare={item.compare}
                          // dotsMenu={item.dotsMenu}
                        />
                      </Col>
                    );
                  })}
                </Row>
              </Col>
              <Col xs={12} xl={12}>
                <Row xs={1} sm={2}>
                  {data?.parkingStatus?.map((item, index) => {
                    let count = ""; // Initialize the count variable

                    if (index === 0) {
                      count = dashboradData.activeparking || loader();
                    } else if (index === 1) {
                      count = dashboradData.inactiveParking || loader();
                    }
                    return (
                      <Col key={index}>
                        <EcommerceCard
                          icon={item.icon}
                          // trend={item.trend}
                          title={item.title}
                          number={count}
                          variant={item.variant}
                          // percent={item.percent}
                          // compare={item.compare}
                          // dotsMenu={item.dotsMenu}
                        />
                      </Col>
                    );
                  })}
                </Row>
              </Col>
            </Row>
          </CardLayout>
        </Col>

        {/* <Col xl={12}>
          <CardLayout>
            <Row md={2} className="mb-4">
              <h3>Ticket History</h3>
              <Col xs={12} xl={12}>
                <Row xs={1} sm={3}>
                  {data?.ticketHistory?.map((item, index) => {
                    let count = ""; // Initialize the count variable

                    if (index === 0) {
                      count = dashboradData.totalTicketBooked || loader();
                    } else if (index === 1) {
                      count = dashboradData.scannedTickets || loader();
                    } else if (index === 2) {
                      count = dashboradData.remainingTickets || loader();
                    }
                    return (
                      <Col key={index}>
                        <EcommerceCard
                          icon={item.icon}
                          // trend={item.trend}
                          title={item.title}
                          number={count}
                          variant={item.variant}
                          // percent={item.percent}
                          // compare={item.compare}
                          // dotsMenu={item.dotsMenu}
                        />
                      </Col>
                    );
                  })}
                </Row>
              </Col>
            </Row>
          </CardLayout>
        </Col> */}
      </Row>
    </PageLayout>
  );
}
