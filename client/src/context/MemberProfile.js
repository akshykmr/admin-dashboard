import { createContext, useState, useEffect } from "react";

import axios from "axios";


export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {

    const [memberProfileData, setMemberProfileData] = useState()
    
  const serverUrl = process.env.REACT_APP_BASE_URL;

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if(token)
    {
      const fetchMemberProfile = async () => {
        try {
        //   console.log(token,'token from local storage')
  
          const headers = { token: token};
        //   console.log("header", headers);
  
          const response = await axios.get(`${serverUrl}/profile/getProfile`, {headers});
        //   console.log("response", response.data);
          setMemberProfileData(response.data)
        } catch (error) {
          console.log(error, "error");
        }
      }
  
      if(role==="admin"){
        fetchMemberProfile(); // Call the async function immediately
      }
    }
  }, [token]);
  
  //  console.log(memberProfileData,'memberProfileData')

    return (
        <ProfileContext.Provider value={{ memberProfileData }}>
            { children }
        </ProfileContext.Provider>
    )
}