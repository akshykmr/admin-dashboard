import React, { useState, useContext,useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { Anchor, Item } from "../../components/elements";
import { CardLayout, CardHeader, FloatCard } from "../../components/cards";
import { Breadcrumb, Pagination } from "../../components";
import LabelField from "../../components/fields/LabelField";
import UsersTable from "../../components/tables/UsersTable";
import PageLayout from "../../layouts/PageLayout";
import data from "../../data/master/userList.json";
import CreateMember from "./CreateMemberr";
import { useNavigate } from 'react-router-dom';

// import { MemberListContext } from "../../context/MemberList";
// import MemberProfile from "./MemberProfile";
import axios from "axios";

export default function MemberList() {

  const navigate = useNavigate();


  // const { MembesList } = useContext(MemberListContext);

//  console.log(MembesList,'memberlist')

 
    
    const [memberList, setMemberList] = useState()
    
  const serverUrl = process.env.REACT_APP_BASE_URL;

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
  if(token){
    const fetchMemberList = async () => {
        try {
        //   console.log(token,'token from local storage')

          const headers = { token: token};
        //   console.log("header", headers);

          const response = await axios.get(`${serverUrl}/profile/fetchMembers`, {headers});
          console.log("response", response.data);
          console.log("response", response.data[2].permission[0].label);
        setMemberList(response.data)
        } catch (error) {
          console.log(error, "error");
        }
      }
  // if(role === 'super_admin'){
    fetchMemberList(); // Call the async function immediately
  // }
   
  }
  }, [token]);

  return (

    <PageLayout> 
            <Row>
            <Col xl={11}>
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
            {data?.float.map((item, index) => (
              <Col xl={4} key={index}>
                <FloatCard
                  variant={item.variant}
                  digit={item.digit}
                  title={item.title}
                  icon={item.icon}
                />
              </Col>
            ))}
            <Col xl={12}>
              <CardLayout>
                <div className="d-flex justify-content-between">
                <CardHeader title={data?.cardTitle} />
                  <button className="btn px-6 normal-case btn-primary " style={{height:"30px", padding :"2px 10px", display:"flex", alignItems:"center"}} onClick={()=>navigate("/create-member")} >
                    Add New
                  </button>
                </div>
                <Row md={2} className="mb-4">
                  {data?.filter.map((item, index) => (
                    <Col key={index}>
                      <LabelField
                        type={item.type}
                        label={item.label}
                        option={item.option}
                        placeholder={item.placeholder}
                        labelDir="label-col"
                        fieldSize="w-100 h-sm"
                      />
                    </Col>
                  ))}
                </Row>
                <UsersTable thead={data?.table.thead} tbody={memberList} />
              </CardLayout>
            </Col>
          </Row>
      
    </PageLayout>
  );
}
