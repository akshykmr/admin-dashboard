import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { Anchor, Item } from "../../../components/elements";
import { CardLayout, FloatCard } from "../../../components/cards";
import { Breadcrumb } from "../../../components";
import LabelField from "../../../components/fields/LabelField";
import UsersTable from "../../../components/tables/UsersTable";
import PageLayout from "../../../layouts/PageLayout";
import data from "../../../data/master/userList.json";
import axios from "axios";

export default function Users() {
  const serverUrl = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem("token");

  const [selectedParam, setSelectedParam] = useState();
  const [searchTerm, setSearchTerm] = useState();
  const [fetchedUserData, setFetchedUserData] = useState();
  const [loader, setLoader] = useState(false);

  // Function to update actionWatcher





  const fetchUserList = async () => {
    try {
      setLoader(true);
      const headers = { token: token };

      if (selectedParam === "Active" || selectedParam === "Block") {
        const params = { status: selectedParam };
        console.log(params, "Selected Param");
        const response = await axios.get(`${serverUrl}/profile/fetchUser`, {
          headers,
          params, // Include the 'params' object here
        });
        if (response.status === 200) {
          setLoader(false);
          console.log("User List with fileter param", response.data);
          setFetchedUserData(response.data);
        }
      } else if (searchTerm) {
        if (searchTerm.length > 2) {
          const response = await axios.get(
            `${serverUrl}/profile/searchUser/${searchTerm}`,
            {
              headers,
            }
          );
          if (response.status === 200) {
            setLoader(false);
            console.log("User List with search term", response.data);
            setFetchedUserData(response.data);
          }
        }
      } else {
        const response = await axios.get(`${serverUrl}/profile/fetchUser`, {
          headers,
        });
        if (response.status === 200) {
          setLoader(false);
          console.log("fetched All user list", response.data);
          setFetchedUserData(response.data);
        }
      }
    } catch (error) {
      setLoader(false);
      console.log(error, "error");
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserList(); // Fetching User Whenever Component will render
    }
  }, []);

  

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
        {data?.float.map((item, index) => {
          let count = 0;

          if (index === 0) {
            count = fetchedUserData?.length;
          } else if (index === 1) {
            count = fetchedUserData?.filter(
              (member) => member.status === "Active"
            ).length;
          } else if (index === 2) {
            count = fetchedUserData?.filter(
              (member) => member.status === "Block"
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
          <Row md={ (selectedParam !== "Active" && selectedParam !== "Block") ? 2 : 1} className="mb-4">
              {data?.filter.map((item, index) => {
                const isParamSelected =
                  (selectedParam !== "Active" && selectedParam !== "Block") ||
                  index === 0;

                if (isParamSelected) {
                  return (
                <Col key={index}>
                  <LabelField
                    value={index === 0 ? selectedParam : searchTerm}
                    type={item.type}
                    label={item.label}
                    option={["All", "Active", "Block"]}
                    placeholder={item.placeholder}
                    onChange={index === 0 ? handleFilter : handleSearch}
                    labelDir="label-col"
                    fieldSize="w-100 h-sm"
                  />
                 </Col>
                  );
                }
                return null;
              })}
            </Row>
            <UsersTable
              thead={data?.table.thead}
              tbody={fetchedUserData}
              loader={loader}
            />
          </CardLayout>
        </Col>
      </Row>
    </PageLayout>
  );
}
