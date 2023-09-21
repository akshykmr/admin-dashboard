import React, { useContext } from "react";
import { ThemeContext } from "../../context/Themes";
import './MemberProfile.css'
import { Row, Col } from "react-bootstrap";
import { List, Item, Icon, Text, Box, Anchor } from "../../components/elements";
import {
  Breadcrumb,
  RoundAvatar,
  DivideTitle,
  DuelText,
} from "../../components";
import { CardLayout, CardHeader } from "../../components/cards";
import PageLayout from "../../layouts/PageLayout";
import data from "../../data/master/MemberProfile.json";
import { useNavigate } from "react-router-dom";

export default function EventDetails() {
  const navigate = useNavigate();

  const { theme } = useContext(ThemeContext);

  const style = {
    color: theme === "dark_mode" ? "white" : "black",
    fontWeight: "900",
    fontSize: "15px",
    padding: "2px 6px",
  };
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
                style={style}
                onClick={() => navigate(`/member-list`)}
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
                    title={data?.profile.fullname}
                    // descrip={ data?.profile.role }
                    size={data?.profile.size}
                  />
                  <span className="d-flex  flex-row gap-2 mt-2  align-items-center">
                    {data.profile.role === "Admin" && (
                      <Icon
                        className="material-icons"
                        style={{ fontSize: "18px", color: "#be0ee1" }}
                      >
                        {data.profile.icon}
                      </Icon>
                    )}
                    <h6>{data?.profile.role}</h6>
                  </span>
                </div>
              </Box>
              <Box className="mb-4">
                <DivideTitle title="communication" className="mb-4" />
                <List className="mc-user-metalist">
                  {data?.contact.map((item, index) => (
                    <Item key={index}>
                      <Icon>{item.icon}</Icon>
                      <Text as="span">{item.text}</Text>
                    </Item>
                  ))}
                </List>
              </Box>
              <Box className="mb-4">
                <DivideTitle title="Status" className="mb-3" />
                {data?.status.Status === "Active" && (
                  <Text className=" profile_txt status_txt_active">
                    {data?.status.Status}
                  </Text>
                )}
                {data?.status.Status === "Blocked" && (
                  <Text className="profile_txt status_txt_blocked">
                    {data?.status.Status}
                  </Text>
                )}
              </Box>
              <Box>
                <DivideTitle title="Permissions" className="mb-4" />
                <div className="permisson d-flex flex-row gap-2">
                {data.permissions.permissions.map((permission, index) => (
                  // <Text key={index} className="mc-table-badge red">
                  //   {permission}
                  // </Text>
                <span  className=" profile_txt permission_txt"  key={index} > {permission}</span>
                ))}
                </div>
              </Box>
            </Box>
          </CardLayout>
        </Col>
      </Row>
    </PageLayout>
  );
}
