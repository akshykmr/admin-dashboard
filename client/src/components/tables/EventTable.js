import React, { useState, useEffect } from "react";
import { Table, Thead, Tbody, Th, Tr, Td } from "../elements/Table";
import { Button, Image, Text, Box } from "../elements";
import { useNavigate } from "react-router-dom";
import { MdEventNote } from "react-icons/md";
import CustomeLoader from "../../pages/master/Loader/CustomeLoader";
import ToggleBtn from "../../components/elements/togglebtn/ToggleBtn";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TimeFormatter from "../elements/TimeFormatter";

export default function EventTable({ thead, tbody, type, loader }) {
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
    const EventId = data[index]._id;
    try {
      const headers = {
        token: token,
      };

      const response = await axios.get(
        `${serverUrl}/event/activeNotActiveEvent/${EventId}`,
        { headers }
      );

      if (response.status === 200) {
        setToggleStatus((prevToggleStatus) =>
          prevToggleStatus.map((value, currentIndex) =>
            currentIndex === index ? isChecked : value
          )
        );
        if (isChecked === true) {
          toast.error("Event Deactivated");
        }
        if (isChecked === false) {
          toast.success("Event Activated");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred");
    }
  };

  const handleActionOnEvent = async (index, isEdit, isView) => {
    // handling action on particular event
    localStorage.setItem("eventId", data[index]._id);
    localStorage.setItem("redirectedFrom", type); // to remember the source while coming back from destination
    if (isEdit) {
      if (data.length) {
        navigate("/update-event");
      }
    }
    if (isView) {
      if (data.length > 0) {
        navigate("/view-event");
      }
    }
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
                   {/*////////////////////// NAME */}
                    <Td title={item?.name}>
                      <Box className="mc-table-profile">
                        {item.image ? (
                          <Image
                            src={`${serverUrl}${item.image[0]}`}
                            alt={item?.alt}
                          />
                        ) : (
                          <span className="d-flex justify-content-center fs-3 ">
                            <MdEventNote
                              style={{
                                animation: "none",
                                fontSize: "18px",
                                color: "#1a9f53",
                              }}
                            />
                          </span>
                        )}

                        <Text>
                          {item.name?.split(" ").slice(0, 3).join(" ")}
                          {item.name?.split(" ").length > 3 ? " ..." : ""}
                        </Text>
                      </Box>
                    </Td>

                   {/*////////////////////// TYPE */}
                    <Td title={item?.type}>
                      <Box className="mc-table-icon role">
                        {/* <Icon className="material-icons blue">{"settings"}</Icon> */}
                        <Text as="span">{item.type}</Text>
                      </Box>
                    </Td>
                   {/*////////////////////// DATE */}

                    <Td title="duration">
                      <span
                        className="d-flex flex-column"
                        style={{ paddingRight: "30px" }}
                      >
                        {item.start_date && (
                          <span className="d-flex  align-items-center gap-1">
                            <h6 style={{ fontSize: "12px", marginTop: "5px" }}>
                              Start Date :
                            </h6>
                            {/* <Text as="span">  Start Date :</Text> */}
                            <p
                              style={{
                                fontSize: "12px",
                                marginTop: "5px",
                              }}
                            >
                              {item.start_date.split("-").reverse().join("-")}
                            </p>
                            {/* <Text as="span"> {item.start_date.split("-").reverse().join("-")}</Text> */}

                          </span>
                        )}
                        {item.end_date && (
                          <span className="d-flex align-items-center gap-1">
                            <h6 style={{ fontSize: "12px", marginTop: "5px" }}>
                              End Date :
                            </h6>
                            {/* <Text as="span"> End Date :</Text> */}
                            <p
                              style={{
                                fontSize: "12px",
                                marginTop: "5px",
                              }}
                            >
                              {item.end_date.split("-").reverse().join("-")}
                            </p>
                            {/* <Text as="span"> {item.end_date.split("-").reverse().join("-")}</Text> */}

                          </span>
                        )}
                      </span>
                    </Td>

                   {/*////////////////////// TIME */}

                    <Td title="timing">
                      <span
                        className="d-flex flex-column"
                        style={{ paddingRight: "30px" }}
                      >
                        {item.start_date && (
                          <span className="d-flex  align-items-center gap-1">
                            <h6 style={{ fontSize: "12px", marginTop: "5px" }}>
                              Start Time :
                            </h6>
                            <p
                              style={{
                                fontSize: "12px",
                                marginTop: "5px",
                              }}
                            >
                              <TimeFormatter time24={item.start_time} />
                            </p>
                          </span>
                        )}
                        {item.end_date && (
                          <span className="d-flex align-items-center gap-1">
                            <h6 style={{ fontSize: "12px", marginTop: "5px" }}>
                              End Time :
                            </h6>
                            <p
                              style={{
                                fontSize: "12px",
                                marginTop: "5px",
                              }}
                            >
                              <TimeFormatter time24={item.end_time} />
                            </p>
                          </span>
                        )}
                      </span>
                    </Td>

                   {/*////////////////////// STATUS */}

                    <Td title={item.status}>
                      {item.status && (
                        <Text
                          className={`mc-table-badge ${
                            item.status === "ongoing"
                              ? "green"
                              : item.status === "upcoming"
                              ? "yellow"
                              : "red"
                          }`}
                        >
                          {item.status}
                        </Text>
                      )}
                    </Td>
                    
                    <Td title="Tickets Details">
                      <span
                        className="d-flex flex-column"
                        style={{ paddingRight: "30px" }}
                      >
                        {item.start_date && (
                          <span className="d-flex  align-items-center gap-1">
                            <h6 style={{ fontSize: "12px", marginTop: "5px" }}>
                              Capacity :
                            </h6>
                            <p
                              style={{
                                fontSize: "12px",
                                marginTop: "5px",
                              }}
                            >
                              {item.capacity}
                            </p>
                          </span>
                        )}
                        {item.end_date && (
                          <span className="d-flex align-items-center gap-1">
                            <h6 style={{ fontSize: "12px", marginTop: "5px" }}>
                              Sold Tickets :
                            </h6>
                            <p
                              style={{
                                fontSize: "12px",
                                marginTop: "5px",
                              }}
                            >
                             {item.attendness_count}
                            </p>
                          </span>
                        )}
                         {item.end_date && (
                          <span className="d-flex align-items-center gap-1">
                            <h6 style={{ fontSize: "12px", marginTop: "5px" }}>
                              Registered By :
                            </h6>
                            <p
                              style={{
                                fontSize: "12px",
                                marginTop: "5px",
                              }}
                              
                            >
                              {item.attendness.length}
                            </p>
                          </span>
                        )}
                         {item.end_date && (
                          <span className="d-flex align-items-center gap-1">
                            <h6 style={{ fontSize: "12px", marginTop: "5px" }}>
                              Attended By :
                            </h6>
                            <p
                              style={{
                                fontSize: "12px",
                                marginTop: "5px",
                              }}
                            >
                              {"?"}
                            </p>
                          </span>
                        )}
                      </span>
                    </Td>
                    {/* <Td title={item?.capacity}>{item.capacity}</Td>
                    <Td title={item?.attendness_count}>{item.attendness_count}</Td>
                    <Td title={item?.capacity}>{item.capacity}</Td> */}
                    {(type === "upcoming-events" ||
                      type === "ongoing-events") && (
                      <Td title={item?.is_deleted}>
                        <Text
                          className={`mc-table-badge ${
                            toggleStatus[index] === false ? "green" : "red"
                          }`}
                        >
                          {toggleStatus[index] === false
                            ? "Active"
                            : "inactive"}
                        </Text>
                      </Td>
                    )}
                    <Td>
                      <Box className="mc-table-action ">
                        <Button
                          title="Edit"
                          className="material-icons text-primary"
                          onClick={() =>
                            handleActionOnEvent(index, true, false, false)
                          }
                        >
                          {"edit"}
                        </Button>
                        {/* )} */}
                        <Button
                          title="view"
                          className="material-icons edit "
                          onClick={() =>
                            handleActionOnEvent(index, false, true, false)
                          }
                        >
                          {"visibility"}
                        </Button>
                        {toggleStatus.length > 0 &&
                          (type === "upcoming-events" ||
                            type === "ongoing-events") && (
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
                <Td>No Event Found</Td>
              </Tr>
            )}
          </Tbody>
        )}
      </Table>
    </Box>
  );
}
