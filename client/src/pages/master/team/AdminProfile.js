import React, { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../../../context/Themes";
import "./AdminProfile.css";
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
  RoundAvatar,
  DivideTitle,
  DuelText,
} from "../../../components";
import { CardLayout } from "../../../components/cards";
import PageLayout from "../../../layouts/PageLayout";
import data from "../../../data/master/MemberProfile.json";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

export default function AdminProfile() {
  const navigate = useNavigate();

  const { theme } = useContext(ThemeContext);

  const serverUrl = process.env.REACT_APP_BASE_URL;
  const memberId = localStorage.getItem("memberId");
  const redirectedFrom = localStorage.getItem("redirectedFrom");

  const CrossBtnStyle = {
    color: theme === "dark_mode" ? "white" : "black",
    fontWeight: "900",
    fontSize: "15px",
    padding: "2px 6px",
  };

  const [memberData, setMemberData] = useState({
    name: "",
    email: "",
    permissions: {},
    status: "",
    role: "",
    phone: "",
    parkingSlot: "",
    parkingPermission: "",
  });

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const response = await axios.get(
          `${serverUrl}/profile/viewProfile/${memberId}`
        );

        if (response.status === 200) {
          console.log("feched admin's data", response.data);

          const commonEventData = {
            name: response.data?.name,
            email: response.data?.email,
            phone: response.data?.phone,
            status: response.data?.status,
            role: response.data?.role,
            parkingPermission: response.data?.parking_assign_for,
          };
          setMemberData(commonEventData);
          if (response.data?.permission.length > 0) {
            const allowedPermission = response.data?.permission.find(
              (permission) => permission.is_allowed === true
            );
            setMemberData((prevData) => ({
              ...prevData,
              permissions: allowedPermission,
            }));
          }

          if (response.data?.assign_for) {
            setMemberData((prevData) => ({
              ...prevData,
              parkingSlot: response.data?.assign_for.name,
            }));
          }
        }
      } catch (error) {
        navigate(`/${redirectedFrom}`);
        console.log(error, "error");
      }
    };
    fetchAdminProfile();
  }, []);

  console.log(memberData, "memberdata");
  return (
    <PageLayout>
      <Row>
        <Col xl={12}>
          <CardLayout>
            <Breadcrumb title="Member-profile">
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
            <div className="header  d-flex justify-content-between align-items-center mb-4">
              {/* <CardHeader title="basic information" /> */}
              <h5>Member Information</h5>
              <button
                className="btn btn-sm btn-circle absolute"
                style={CrossBtnStyle}
                onClick={() => navigate(`/${redirectedFrom}`)}
              >
                ✕
              </button>
            </div>
            <Box className="mc-user-group">
              <Box className="mc-user-profile">
                <RoundAvatar
                  src={data?.profile.src}
                  alt={data?.profile.alt}
                  size={data?.profile.size}
                />

                <div className="role">
                  <DuelText
                    title={memberData?.name}
                    // descrip={ data?.profile.role }
                    size={data?.profile.size}
                  />
                  <span className="d-flex  flex-row gap-2 mt-2  align-items-center">
                    <Icon
                      className="material-icons"
                      style={{ fontSize: "18px", color: "#be0ee1" }}
                    >
                      {memberData.role === "admin"
                        ? "settings"
                        : "account_circle"}
                      {/* {data.profile.icon} */}
                    </Icon>
                    <h6>{memberData?.role}</h6>
                  </span>
                </div>
              </Box>
              <Box className="mb-4">
                <DivideTitle title="communication" className="mb-4" />
                <List className="mc-user-metalist">
                  <Item>
                    <Icon>phone_in_talk</Icon>
                    <Text as="span">{memberData?.phone}</Text>
                  </Item>
                  <Item>
                    <Icon>feed</Icon>
                    <Text as="span">{memberData?.email}</Text>
                  </Item>
                </List>
              </Box>
              <Box className="mb-4">
                <DivideTitle title="status" className="mb-3" />
                {memberData.status === "Active" && (
                  <Text className=" profile_txt status_txt_active">
                    {memberData?.status}
                  </Text>
                )}
                {memberData.status === "Block" && (
                  <Text className="profile_txt status_txt_blocked">
                    {memberData?.status}
                  </Text>
                )}
              </Box>
              {memberData.permissions && (
                <Box>
                  <DivideTitle title="permissions" className="mb-4" />
                  <div className="permisson d-flex flex-column gap-2">
                    <span className=" profile_txt permission_txt">
                      <p
                        style={{
                          color: theme === "dark_mode" ? "white" : "#5e5d72",
                        }}
                      >
                        {memberData.permissions?.label}
                      </p>
                      {/* <span className="d-flex gap-2">
                      {memberData.parkingSlot &&
                      <p
                        style={{
                          color: theme === "dark_mode" ? "grey" : "#5e5d72a1",
                        }}
                        className="parkingTxt"
                      >
                        ({memberData.parkingSlot})
                      </p>}
                      {memberData.parkingSlot &&
                      <p
                        style={{
                          color: theme === "dark_mode" ? "grey" : "#5e5d72a1",
                        }}
                        className="parkingTxt"
                      >
                        ({memberData.parkingSlot})
                      </p>}
                      </span> */}

                      {memberData.parkingSlot && (
                        <span className="d-flex  align-items-center gap-1">
                          <h6 style={{ fontSize: "10px", marginTop: "5px" }}>
                            Parking Name :
                          </h6>
                          <p
                            style={{
                              fontSize: "10px",
                              marginTop: "5px",
                              color: "blue",
                            }}
                          >
                            <Link
                              to={`/team-profile`}
                              // onClick={() =>
                              //   handleViewAdmin(item.check_in_user._id)
                              // }
                            >
                              {memberData.parkingSlot}
                            </Link>
                          </p>
                        </span>
                      )}
                      {memberData.parkingSlot && (
                        <span className="d-flex align-items-center gap-1">
                          <h6 style={{ fontSize: "10px", marginTop: "5px" }}>
                            Parking Permission :
                          </h6>
                          <p
                            style={{
                              fontSize: "10px",
                              marginTop: "5px",
                            }}
                          >
                            {memberData.parkingPermission}
                          </p>
                        </span>
                      )}
                    </span>
                  </div>
                </Box>
              )}
            </Box>
          </CardLayout>
        </Col>
      </Row>
    </PageLayout>
  );
}
