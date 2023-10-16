import React, { useState, useEffect } from "react";
import { Table, Thead, Tbody, Th, Tr, Td } from "../elements/Table";
import { Button, Image, Text, Box } from "../elements";
import { useNavigate } from "react-router-dom";
import { BiSolidUserCircle } from "react-icons/bi";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ToggleBtn from "../../components/elements/togglebtn/ToggleBtn";
import CustomeLoader from "../../pages/master/Loader/CustomeLoader";

export default function UsersTable({
  thead,
  tbody,
  loader,
}) {
  const navigate = useNavigate();

  const serverUrl = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem("token");

  const [data, setData] = useState([]);
  useEffect(() => {
    setData(tbody);
  }, [tbody]);

  const handleActionOnEvent = async (index, isEdit, isView, isDelete) => {
    localStorage.setItem("userId", data[index]._id);

    if (isEdit) {
      if (data.length) {
        navigate("/update-team-profile");
      }
    }
    if (isView) {
      if (data.length > 0) {
        navigate("/user-profile");
      }
    }
    // if (isDelete) {
    //   const confirmDel = window.confirm(
    //     "Are you sure you want to delete this event"
    //   );

    //   if (confirmDel) {
    //     alert("Clicked");
    //     // try {
    //     //   const headers = {
    //     //     token: token,
    //     //   };
    //     //   const response = await axios.delete(
    //     //     `${serverUrl}/event/remove/${data[index]._id}`,
    //     //     { headers }
    //     //   );
    //     //   if (response.status === 200) {
    //     //     toast.success(response.data.result);
    //     //     data((prevData) => prevData.filter((_, i) => i !== index));
    //     //   }
    //     // } catch (error) {
    //     //   console.error("Error:", error.response.status);
    //     //   toast.error(error.response.error);
    //     // }
    //   }
    // }
  };
  const [toggleStatus, setToggleStatus] = useState([]);

  useEffect(() => {
    if (data) {
      const initialToggleStatus = data.map((item) =>
      item.status  === 'Active' ? false : true);
      setToggleStatus(initialToggleStatus);
    }
  }, [data]);

  console.log(toggleStatus, "togglestatus");
  console.log(data, "user data");





  const handleToggle = async (index, isChecked) => {

    const userId = tbody[index]._id;

 try {
      const headers = {
        token: token,
      };

      const response = await axios.get(
        `${serverUrl}/profile/changeStatus/${userId}`,
        { headers }
      );

      if (response.status === 200) {
        setToggleStatus((prevToggleStatus) =>
        prevToggleStatus.map((value, currentIndex) =>
          currentIndex === index ? isChecked : value
        )
      );
        if (isChecked === true) {
          toast.error("User Deactivated");
        }
        if (isChecked === false) {
          toast.success("User Activated");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred");
    }
  };

  return (
    <Box className="mc-table-responsive">
      <Table className="mc-table">
        <Thead className="mc-table-head primary">
          <Tr>
            {thead.map((item, index) => (
              <Th key={index}>{item}</Th>
            ))}
          </Tr>
        </Thead>
        {loader ? (
          <Tbody >
          <Tr>
            <Td colSpan={thead.length}>
              <CustomeLoader />
            </Td>
          </Tr>
        </Tbody>
        ) : (
          <Tbody className="mc-table-body even">
            {data?.length > 0 ? (
              <>
                {data?.map((item, index) => (
                  <Tr key={index}>
                    <Td title={item?.name}>
                      <Box className="mc-table-profile">
                        {item?.profile_url ? (
                          <Image src={`${serverUrl}${item?.profile_url}`} alt={item?.alt} />
                        ) : (
                          <span className="d-flex justify-content-center fs-3 ">
                            <BiSolidUserCircle style={{ animation: "none" }} />
                          </span>
                        )}

                        <Text>{item?.name}</Text>
                      </Box>
                    </Td>
                    {/* <Td title={ item?.role }>
                                <Box className="mc-table-icon role">
                                <Icon className="material-icons blue">{ "settings" }</Icon> 
                                    <Text as="span">{ item.role }</Text>
                                </Box>
                            </Td> */}
                    <Td title={item.email}>{item.email}</Td>
                    <Td title={item.phone}>{item.phone}</Td>
                    {toggleStatus[index] === true ? (
                      <Td title={item?.is_deleted}>
                        <Text className="mc-table-badge red">Deactivated</Text>
                      </Td>
                    ) : (
                      <Td title={item?.is_deleted}>
                        <Text className="mc-table-badge green">Active</Text>
                      </Td>
                    )}
                    <Td>
                      <Box className="mc-table-action">
                        {/* <Button
                    title="Edit"
                    className="material-icons text-primary"
                    onClick={() =>
                      handleActionOnEvent(index, true, false, false)
                    }
                  >
                    {"edit"}
                  </Button> */}
                        <Button
                          title="edit"
                          className="material-icons edit "
                          onClick={() =>
                            handleActionOnEvent(index, false, true, false)
                          }
                        >
                          {"visibility"}
                        </Button>
                        {/* <Button
                    title="delete"
                    className="material-icons text-danger"
                    onClick={() =>
                      handleActionOnEvent(index, false, false, true)
                    }
                  >
                    {"delete"}
                  </Button> */}
                      </Box>
                    </Td>
                    <Td>
                      <Box className="mc-table-icon role  d-flex justify-content-center">
                      {toggleStatus.length > 0 && (
                          <ToggleBtn
                            id={index} // Use a unique identifier (e.g., row index) as id
                            initialChecked={toggleStatus[index]} // Provide the initial toggle status
                            onToggle={handleToggle} // Pass a callback to handle the toggle action
                          />
                        )}
                      </Box>
                    </Td>
                  </Tr>
                ))}
              </>
            ) : (
              <Tr>
                <Td>No User Found</Td>
              </Tr>
            )}
          </Tbody>
        )}
        <ToastContainer />
      </Table>
    </Box>
  );
}
