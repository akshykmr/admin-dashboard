import { createContext, useState, useEffect } from "react";

import axios from "axios";


export const MemberListContext = createContext();

export const MemberListProvider = ({ children }) => {

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
        //   console.log("response", response.data);
        setMemberList(response.data)
        } catch (error) {
          console.log(error, "error");
        }
      }
  if(role === 'super_admin'){
    fetchMemberList(); // Call the async function immediately
  }
   
  }
  }, [token]);
  
//    console.log(memberList,'memberList')

    return (
        <MemberListContext.Provider value={{ memberList }}>
            { children }
        </MemberListContext.Provider>
    )
}