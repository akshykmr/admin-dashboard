import React, { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../../../context/Themes";
import './UserProfile.css'
import { Row, Col } from "react-bootstrap";
import { List, Item, Icon, Text, Box, Anchor } from "../../../components/elements";
import {
  Breadcrumb,
  RoundAvatar,
  DivideTitle,
  DuelText,
} from "../../../components";
import { CardLayout  } from "../../../components/cards";
import PageLayout from "../../../layouts/PageLayout";
import data from "../../../data/master/userProfile.json";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function UserProfile() {


  const navigate = useNavigate();

  const { theme } = useContext(ThemeContext);

  
  const serverUrl = process.env.REACT_APP_BASE_URL;
  const userId = localStorage.getItem("userId");

  const style = {
    color: theme === "dark_mode" ? "white" : "black",
    fontWeight: "900",
    fontSize: "15px",
    padding: "2px 6px",
  };

  const [memberData, setMemberData] = useState({
    name: "",
    email: "",
    permissions:{},
    status: "",
    role:"",
    phone: "",
  });


  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(
          `${serverUrl}/profile/viewProfile/${userId}`
        );

        if (response.status === 200) {
          console.log("fetched data as member details", response.data);

          const commonEventData = {
            name: response.data.name,
            email: response.data.email,
            phone: response.data.phone,
            status: response.data.status,
            role:response.data.role,
          };
          setMemberData(commonEventData);
      
          if(response.data.permission.length>0){
            const allowedPermission = response.data.permission.find(
              (permission) => permission.is_allowed === true
            );
            
            setMemberData((prevData) => ({
              ...prevData,
              permissions: allowedPermission,
            }));
          }
          
        }
      } catch (error) {
        navigate("/team");
        console.log(error, "error");
      }
    };
    fetchEventDetails();
  }, []);

console.log(memberData,'memberdata')
  return (
    <PageLayout>
      <Row>
        <Col xl={12}>
          <CardLayout>
            <Breadcrumb title="User-profile">
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
              <h5>User Information</h5>
              <button
                className="btn btn-sm btn-circle absolute"
                style={style}
                onClick={() => navigate(`/user`)}
              >
                ✕
              </button>
            </div>
            <Box className="mc-user-group">
              <Box className="mc-user-profile">
                <RoundAvatar
                  src={data?.profile?.src}
                  alt={data?.profile?.alt}
                  size={data?.profile?.size}
                />

                <div className="role">
                  <DuelText
                    title={memberData?.name}
                    // descrip={ data?.profile?.role }
                    size={data?.profile?.size}
                  />
                  <span className="d-flex  flex-row gap-2 mt-2  align-items-center">
                    
                      <Icon
                        className="material-icons"
                        style={{ fontSize: "18px", color: "#be0ee1" }}
                      >{ memberData.role === "admin" ? "settings" : "account_circle"}
                        {/* {data.profile?.icon} */}
                      </Icon>
                    <h6>{memberData?.role}</h6>
                  </span>
                </div>
              </Box>
              <Box className="mb-4">
                <DivideTitle title="communication" className="mb-4" />
                <List className="mc-user-metalist">
            
                    <Item >
                      <Icon>phone_in_talk</Icon>
                      <Text as="span">{memberData?.phone}</Text>
                    </Item>
                    <Item >
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
              {memberData.permissions &&
              <Box>
              <DivideTitle title="permissions" className="mb-4" />
              <div className="permisson d-flex flex-column gap-2">
              <span  className=" profile_txt permission_txt" > {memberData?.permissions.label}</span>
         
              </div>
            </Box>
            }
              
            </Box>
          </CardLayout>
        </Col>
      </Row>
    </PageLayout>
  );
}
