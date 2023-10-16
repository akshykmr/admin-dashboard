import React, { useState, useEffect } from "react";
import { Table, Thead, Tbody, Th, Tr, Td } from "../elements/Table";
import { Button, Image, Text, Box } from "../elements";
import { useNavigate } from "react-router-dom";
import { MdLocalParking } from "react-icons/md";
import CustomeLoader from "../../pages/master/Loader/CustomeLoader";
import ToggleBtn from "../../components/elements/togglebtn/ToggleBtn";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export default function ParkingTable({ thead, tbody, type, loader }) {
  const serverUrl = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [toggleStatus, setToggleStatus] = useState([]);

  useEffect(() => {
    setData(tbody);
  }, [tbody]);

  useEffect(() => {
    if (data) {
      const initialToggleStatus = data.map((item) => item.is_deleted);
      setToggleStatus(initialToggleStatus);
    }
  }, [data]);
  console.log(toggleStatus, "toggleStatuse");

  const handleToggle = async (index, isChecked) => {
    const parkingId = data[index]._id;
    try {
      const headers = {
        token: token,
      };

      const response = await axios.get(
        `${serverUrl}/park/activeInActive/${parkingId}`,
        { headers }
      );

      if (response.status === 200) {
        setToggleStatus((prevToggleStatus) =>
          prevToggleStatus.map((value, currentIndex) =>
            currentIndex === index ? isChecked : value
          )
        );
        if (isChecked === true) {
          toast.error("Parking Deactivated");
        }
        if (isChecked === false) {
          toast.success("Parking Activated");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred");
    }
  };

  const handleActionOnEvent = async (index, isEdit, isView) => {
    localStorage.setItem("parkingId", data[index]._id);
    localStorage.setItem("redirectedFrom", type); // to remember the source while coming back from destination
    if (isEdit) {
      if (data.length) {
        navigate("/update-parking");
      }
    }
    if (isView) {
      if (data.length > 0) {
        navigate("/parkingSlot-details");
      }
    }
  };

  const handleViewAdmin = async (adminId) => {
    // this will be redirected to admin profile
    localStorage.setItem("memberId", adminId);
    localStorage.setItem("redirectedFrom", type);
  };

  return (
    <Box className="mc-table-responsive">
      <ToastContainer />
      <Table className="mc-table">
        <Thead className="mc-table-head primary">
          <Tr>
            {thead.map((item, index) => (
              <Th key={index}>{item}</Th>
            ))}
          </Tr>
        </Thead>
        {loader ? (
          <Tr>
            <Td colSpan={thead.length}>
              <CustomeLoader />
            </Td>
          </Tr>
        ) : (
          <Tbody className="mc-table-body even">
            {data?.length > 0 ? (
              <>
                {data?.map((item, index) => (
                  <Tr key={index}>
                    <Td title={item?.name}>
                      <Box className="mc-table-profile">
                        {item.src ? (
                          <Image src={item?.src} alt={item?.alt} />
                        ) : (
                          <span className="d-flex justify-content-center fs-3 ">
                            <MdLocalParking
                              style={{
                                animation: "none",
                                fontSize: "18px",
                                color: "#1a9f53",
                              }}
                            />
                          </span>
                        )}

                        <Text>{item?.name}</Text>
                      </Box>
                    </Td>
                    <Td title={item?.is_assigned}>
                      <Text
                        className={`mc-table-badge ${
                          item.is_assigned === true
                            ? "green"
                            : item.is_assigned === false
                            ? "red"
                            : ""
                        }`}
                      >
                        {item.is_assigned === false ? "Unassigned" : "Assigned"}
                      </Text>

                      <span className="d-flex  align-items-center gap-1">
                        <h6 style={{ fontSize: "10px", marginTop: "5px" }}>
                          Check In By :
                        </h6>
                        <p
                        style={{
                          fontSize: "10px",
                          marginTop: "5px",
                          color: item.check_in_user?.name ? "blue" : "inherit"
                        }}
                        >
                          {item.check_in_user?.name ? (
                            <Link
                              to={`/team-profile`}
                              onClick={() =>
                                handleViewAdmin(item?.check_in_user?._id)
                              }
                            >
                              {item.check_in_user?.name }
                            </Link>
                          ) : (
                             "?"
                          )}
                        </p>
                      </span>

                      <span className="d-flex align-items-center gap-1">
                        <h6 style={{ fontSize: "10px", marginTop: "5px" }}>
                          Check Out By :
                        </h6>
                        <p
                           style={{
                            fontSize: "10px",
                            marginTop: "5px",
                            color: item.check_out_user?.name ? "blue" : "inherit"
                          }}
                        >
                          {item.check_out_user?.name ? (
                            <Link
                              to={`/team-profile`}
                              onClick={() =>
                                handleViewAdmin(item?.check_out_user?._id)
                              }
                            >
                              {item.check_out_user?.name }
                            </Link>
                          ) : (
                             "?"
                          )}
                        </p>
                      </span>
                    </Td>
                    <Td title={item?.address}>
                      {item.address.split(" ").slice(0, 4).join(" ")}
                      {item.address.split(" ").length > 4 ? (
                        <>
                          <br /> {/* Add a line break */}
                          {item.address.split(" ").slice(4, 8).join(" ")}
                          {item.address.split(" ").length > 8 ? "..." : null}
                        </>
                      ) : null}
                    </Td>

                    <Td title={item?.capacity}>{item?.capacity}</Td>
                    <Td title={item?.capacity}>{item?.vehicleCount}</Td>
                    <Td title={item?.status}>
                      {item.status === "Available" && (
                        <Text className="mc-table-badge green">
                          {item?.status}
                        </Text>
                      )}
                      {item.status === "Unavailable" && (
                        <Text className="mc-table-badge red">
                          {item?.status}
                        </Text>
                      )}
                    </Td>
                    <Td title={item?.is_deleted}>
                      <Text
                        className={`mc-table-badge ${
                          toggleStatus[index] === false ? "green" : "red"
                        }`}
                      >
                        {toggleStatus[index] === false ? "Active" : "inactive"}
                      </Text>
                    </Td>
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
                          title="view"
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
                <Td>No parking Found</Td>
              </Tr>
            )}
          </Tbody>
        )}
      </Table>
    </Box>
  );
}
