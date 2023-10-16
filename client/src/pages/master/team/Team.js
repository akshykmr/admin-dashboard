import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { Anchor, Item } from "../../../components/elements";
import { CardLayout, CardHeader, FloatCard } from "../../../components/cards";
import { Breadcrumb } from "../../../components";
import LabelField from "../../../components/fields/LabelField";
import TeamTable from "../../../components/tables/TeamTable";
import PageLayout from "../../../layouts/PageLayout";
import data from "../../../data/master/team.json";
import { useNavigate } from "react-router-dom";

import axios from "axios";

export default function Team() {
  const navigate = useNavigate();

  const [fetchedTeamData, setFetchedTeamData] = useState();

  const serverUrl = process.env.REACT_APP_BASE_URL;

  const token = localStorage.getItem("token");

  const [selectedParam, setSelectedParam] = useState();

  const [searchTerm, setSearchTerm] = useState();
  const [loader, setLoader] = useState(false);

  const fetchTeamList = async () => {
    try {
      setLoader(true);
      const headers = { token: token };
      if (selectedParam === "Active" || selectedParam === "Block") {
        const params = { status: selectedParam };
        const response = await axios.get(`${serverUrl}/profile/fetchMembers`, {
          headers,
          params, // Including the 'params' object here
        });
        if (response.status === 200) {
          setLoader(false);
          console.log("Team List with fileter param", response.data);
          setFetchedTeamData(response.data);
        }
      } else if (searchTerm) {
        if (searchTerm.length > 2) {
          const response = await axios.get(
            `${serverUrl}/profile/searchAdminTeam/${searchTerm}`,
            {
              headers,
            }
          );
          if (response.status === 200) {
            setLoader(false);
            console.log("Team List with search term", response.data);
            setFetchedTeamData(response.data);
          }
        }
      } else {
        const response = await axios.get(`${serverUrl}/profile/fetchMembers`, {
          headers,
        });
        if (response.status === 200) {
          setLoader(false);
          console.log("Fetching all member list", response.data);
          setFetchedTeamData(response.data);
        }
      }
    } catch (error) {
      setLoader(true);
      console.log(error, "error");
    }
  };

  useEffect(() => {
    //fetching the member list
    if (token) {
      fetchTeamList();
    }
  }, []);

  useEffect(() => {
    // fetching member list based on selected param and search terms
    fetchTeamList();
  }, [selectedParam, searchTerm]);

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
            count = fetchedTeamData?.length;
          } else if (index === 1) {
            count = fetchedTeamData?.filter(
              (member) => member.status === "Active"
            ).length;
          } else if (index === 2) {
            count = fetchedTeamData?.filter(
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
            <div className="d-flex justify-content-between">
              <h5>All Members</h5>
              <CardHeader title={data?.cardTitle} />
              <button
                className="btn px-6 normal-case btn-primary mb-4 "
                style={{
                  height: "30px",
                  padding: "2px 10px",
                  display: "flex",
                  alignItems: "center",
                }}
                onClick={() => navigate("/add-team")}
              >
                Add Member
              </button>
            </div>
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

            <TeamTable
            type={"team"}
              thead={data?.table.thead}
              tbody={fetchedTeamData}
              loader={loader}
            />
          </CardLayout>
        </Col>
      </Row>
    </PageLayout>
  );
}
