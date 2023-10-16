import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { CardLayout } from "../../../components/cards";
import HomePageBannerTable from "../../../components/tables/homepageTable";
import { Breadcrumb } from "../../../components";
import Anchor from "../../../components/elements/Anchor";
import PageLayout from "../../../layouts/PageLayout";
import data from "../../../data/master/homepageBanner.json";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function HomePage() {


  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const serverUrl = process.env.REACT_APP_BASE_URL;

  const [homePageBannerList, setHomePageBannerList] = useState(); // state storing fetched homepage bannerszz
  const [loader, setLoader] = useState(false);


  const fetchBanners = async () => {
    try {
      setLoader(true);
      const headers = { token: token };
      const response = await axios.get(`${serverUrl}/home/getAll`, {
        headers,
      });
      if (response.status === 200) {
        setLoader(false);
        console.log("Home page Data / Banners", response.data);
        setHomePageBannerList(response.data);
      }
    } catch (error) {
      setLoader(true);
      console.log(error, "error");
    }
  };


  useEffect(() => {  // will fetch the data if token is there whenever this page will be open
    if (token) {
      fetchBanners();
    }
  }, []);


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

        <Col xl={12}>
          <CardLayout>
            <Row>
              <div className="header d-flex justify-content-between align-items-center mb-4">
                <h5>Active Banners</h5>
                <button
                  className="btn px-6 normal-case btn-primary "
                  style={{
                    height: "30px",
                    padding: "2px 10px",
                    display: "flex",
                    alignItems: "center",
                  }}
                  onClick={() => navigate("/add-banner")}
                >
                  Add Banner
                </button>
              </div>
              <Col xl={12}>
              
                  <HomePageBannerTable
                    thead={data?.product.thead}
                    tbody={homePageBannerList}
                    loader={loader}
                  />
               
              </Col>
            </Row>
          </CardLayout>
        </Col>
      </Row>
    </PageLayout>
  );
}
