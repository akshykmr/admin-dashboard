import React, { useState, useEffect } from "react";
import { Modal, Form } from "react-bootstrap";
import { Table, Thead, Tbody, Th, Tr, Td } from "../elements/Table";
import {
  Button,
  Image,
  Input,
  Text,
  Box,
  Icon,
  Option,
  Heading,
} from "../elements";
import userInfo from "../../data/master/userList.json";
import { useNavigate } from "react-router-dom";
import { MdEventNote } from "react-icons/md";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EventTable({ thead, tbody }) {
  const serverUrl = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem("token");


  // console.log("hhhhh",tbody?.permission[0])

  const navigate = useNavigate();


  const [data, setData] = useState([]);
  const [userData, setUserData] = React.useState("");
  const [editModal, setEditModal] = React.useState(false);
  const [blockModal, setBlockModal] = React.useState(false);

  useEffect(() => {
    setData(tbody);
  }, [tbody]);

  const handleActionOnEvent = async (index, isEdit, isView, isDelete) => {

    localStorage.setItem("eventId", data[index]._id);

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
    if (isDelete) {

      const confirmDel = window.confirm(
        "Are you sure you want to delete this event"
      );

      if (confirmDel) {
        try {
          const headers = {
            token: token,
          };
          const response = await axios.delete(
            `${serverUrl}/permission/remove/${data[index]._id}`,
            { headers }
          );
          if (response.status === 200) {
            toast.success(response.data.result);
            setData((prevData) => prevData.filter((_, i) => i !== index));
          }
        } catch (error) {
          console.error("Error:", error.response.status);
          toast.error(error.response.error);
        }
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
        <Tbody className="mc-table-body even">
          {data?.map((item, index) => (
            <Tr key={index}>
              <Td title={item?.label}>
                <Box className="mc-table-profile">
                  {item.src ? (
                    <Image src={item?.src} alt={item?.alt} />
                  ) : (
                    <span className="d-flex justify-content-center fs-3 ">
                      <MdEventNote style={{ animation: "none", fontSize:"18px", color:"#1a9f53" }} />
                    </span>
                  )}

                  <Text>{item?.label}</Text>
                </Box>
              </Td>
              {/* <Td title={item?._id}>
                <Box className="mc-table-icon role">
                  <Icon className="material-icons blue">{"settings"}</Icon>
                  <Text as="span">{item._id}</Text>
                </Box>
              </Td> */}
              {/* <Td title={item.description}>
                  {item.description.split(" ").slice(0, 5).join(" ")}
                {item.description.split(" ").length > 5 ? " ..." : ""}
              </Td> 
              <Td title={item.address}>
                {item.address.split(" ").slice(0, 5).join(" ")}
                {item.address.split(" ").length > 5 ? " ..." : ""}
              </Td>
              <Td title={item.status}>
                {item.status === "ongoing" && (
                  <Text className="mc-table-badge green">{item.status}</Text>
                )}
                {item.status === "upcomming" && (
                  <Text className="mc-table-badge red">{item.status}</Text>
                )}
              </Td>
              <Td title={item?.capacity}>{item.capacity}</Td> */}
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
                  </Button>
                  <Button
                    title="edit"
                    className="material-icons edit "
                    onClick={() =>
                      handleActionOnEvent(index, false, true, false)
                    }
                  >
                    {"visibility"}
                  </Button> */}
                  <Button
                    title="delete"
                    className="material-icons text-danger"
                    onClick={() =>
                      handleActionOnEvent(index, false, false, true)
                    }
                  >
                    {"delete"}
                  </Button>
                </Box>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
