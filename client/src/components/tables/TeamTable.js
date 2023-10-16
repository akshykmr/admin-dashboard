import React, { useState, useEffect } from "react";
import { Table, Thead, Tbody, Th, Tr, Td } from "../elements/Table";
import { Button, Image, Text, Box } from "../elements";
import { useNavigate } from "react-router-dom";
import { BiSolidUserCircle } from "react-icons/bi";
import CustomeLoader from "../../pages/master/Loader/CustomeLoader";
import ToggleBtn from "../../components/elements/togglebtn/ToggleBtn";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Link } from "react-router-dom";




export default function TeamTable({ thead, tbody, loader, type }) {
  const navigate = useNavigate();
  const serverUrl = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem('token')



  const [permission, setPermission] = useState([]);
  const [toggleStatus, setToggleStatus] = useState([]);

  useEffect(() => {
    if (tbody) {
      const initialToggleStatus = tbody.map((item) => item.status  === 'Active' ? false : true);
      setToggleStatus(initialToggleStatus);
    }
  }, [tbody]);
  console.log(toggleStatus, "toggleStatuse");



  const handleToggle = async (index, isChecked) => {

    const adminId = tbody[index]._id;

 try {
      const headers = {
        token: token,
      };

      const response = await axios.get(
        `${serverUrl}/profile/changeStatus/${adminId}`,
        { headers }
      );

      if (response.status === 200) {
        setToggleStatus((prevToggleStatus) =>
        prevToggleStatus.map((value, currentIndex) =>
          currentIndex === index ? isChecked : value
        )
      );
        if (isChecked === true) {
          toast.error("Admin Deactivated");
        }
        if (isChecked === false) {
          toast.success("Admin Activated");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred");
    }
  };

  useEffect(() => {
    if (tbody) {
      const permissions = tbody.map((item) => {
        const allowedPermission = item.permission?.find(
          (permission) => permission.is_allowed === true
        );
        if (allowedPermission) {
          if (allowedPermission.label === "Parking Management") {
            return "Parking Management";
          } else if (allowedPermission.label === "Event Management") {
            return "Event Management";
          } else {
            return "Ticket Management";
          }
        }
        return null; // Handle cases where no allowed permission is found
      });
      setPermission(permissions);
    }
  }, [tbody]);

  const handleActionOnEvent = async (index, isEdit, isView, isDelete) => {
    localStorage.setItem("memberId", tbody[index]._id);
    localStorage.setItem("redirectedFrom", type);

    if (isEdit) {
      if (tbody.length) {
        navigate("/update-team-profile");
      }
    }
    if (isView) {
      if (tbody.length > 0) {
        navigate("/team-profile");
      }
    }
    // if (isDelete) {

    //   const confirmDel = window.confirm(
    //     "Are you sure you want to delete this event"
    //   );

    //   if (confirmDel) {
    //     alert("Delete Function is on hold")
    //     // try {
    //     //   const headers = {
    //     //     token: token,
    //     //   };
    //     //   const response = await axios.delete(
    //     //     `${serverUrl}/event/remove/${tbody[index]._id}`,
    //     //     { headers }
    //     //   );
    //     //   if (response.status === 200) {
    //     //     toast.success(response.data.result);
    //     //     tbody((prevData) => prevData.filter((_, i) => i !== index));
    //     //   }
    //     // } catch (error) {
    //     //   console.error("Error:", error.response.status);
    //     //   toast.error(error.response.error);
    //     // }
    //   }
    // }
  };

  return (
    <Box className="mc-table-responsive">
      <ToastContainer/>
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
            {tbody?.length > 0 ? (
              <>
                {tbody?.map((item, index) => (
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
                    <Td title={permission[index]}>
                      {permission[index]}
                      {item.assign_for && (
                        <span className="d-flex  align-items-center gap-1">
                          <h6 style={{ fontSize: "10px", marginTop: "5px" }}>
                            Parking Name :
                          </h6>
                          <p
                            style={{
                              fontSize: "10px",
                              marginTop: "5px",
                              color: "blue",
                            }}
                          >
                            <Link
                              to={`/team-profile`}
                              // onClick={() =>
                              //   handleViewAdmin(item.check_in_user._id)
                              // }
                            >
                              {item.assign_for?.name}
                            </Link>
                          </p>
                        </span>
                      )}
                      {item.assign_for && (
                        <span className="d-flex align-items-center gap-1">
                          <h6 style={{ fontSize: "10px", marginTop: "5px" }}>
                            Parking Permission :
                          </h6>
                          <p
                            style={{
                              fontSize: "10px",
                              marginTop: "5px",
                            }}
                          >
                            {item.parking_assign_for}
                          </p>
                        </span>
                      )}
                    </Td> 
                    {/* Use permission[index] */}
                    <Td>
                      <Box className="mc-table-action">
                        <Button
                          title="Edit"
                          className="material-icons text-primary"
                          onClick={() =>
                            handleActionOnEvent(index, true, false, false)
                          }
                        >
                          {"edit"}
                        </Button>
                        <Button
                          title="edit"
                          className="material-icons edit "
                          onClick={() =>
                            handleActionOnEvent(index, false, true, false)
                          }
                        >
                          {"visibility"}
                        </Button>
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
                <Td>Not Found</Td>
              </Tr>
            )}
          </Tbody>
        )}
      </Table>
    </Box>
  );
}
