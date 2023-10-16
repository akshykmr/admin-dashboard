import React, { useState, useContext, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { CardLayout } from "../../../components/cards";
import {  Breadcrumb } from "../../../components";
import Anchor from "../../../components/elements/Anchor";
import PageLayout from "../../../layouts/PageLayout";
import data from "../../../data/master/viewBanner.json";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../../context/Themes";
import {
} from "../../../components/elements";

import './ViewBanner.css'

export default function ViewBanner() {

  const { theme } = useContext(ThemeContext);

  const navigate = useNavigate();

  const bannerId = localStorage.getItem("bannerId");


  const serverUrl = process.env.REACT_APP_BASE_URL;

  const [homepageData, setHomepageData] = useState({
    para: "",
    img: "",
    url: "",
  });

  useEffect(() => {

    const fetcheBannerDatails = async () => {
      try {
        const response = await axios.get(
          `${serverUrl}/home/getSingle/${bannerId}`
        );

        if (response.status === 200) {
          console.log("Fetched Banner Data", response.data);

          const bannerDeatails = {
            para: response.data.para,
            img: `${serverUrl}${response.data.banner}`,
          };
          setHomepageData(bannerDeatails);

          if(response.data.url){
            setHomepageData((preData)=>({
              ...preData,
              url: response.data.url,
            }))
          }
        }
      } catch (error) {
        navigate("/homepage");
        console.log(error, "error");
      }
    };
    fetcheBannerDatails();
  }, []);


  const crossBtn_style = {
    color: theme === "dark_mode" ? "white" : "black",
    fontWeight: "900",
    fontSize: "15px",
    padding: "2px 6px",
  };

  console.log(homepageData,'stored homepage data')

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

        <Col xl={7} style={{ margin: "20px auto" }}>
          <CardLayout>
            <Row>
              <div className="header d-flex justify-content-between align-items-center ">
                <h5 className="opacity-0">View Banner</h5>
                <button
                  className="btn btn-sm btn-circle absolute"
                  style={crossBtn_style}
                  onClick={() => navigate("/homepage")}
                >
                  ✕
                </button>
              </div>

              <Col xl={12}>
                <div className="banner_body">
                  <div className="banner">
                    <img src={homepageData.img} alt="" />
                    <h2>{homepageData?.para}</h2>
                  </div>
                  <div className="url">
                    {homepageData.url?.length>5 &&
                     <h5 >URL: <a href={homepageData.url} target="_blank" rel="noopener noreferrer">{homepageData.url}</a></h5>
                    }
                  </div>

                </div>
              </Col>

            </Row>
          </CardLayout>
        </Col>
      </Row>
    </PageLayout>
  );
}
