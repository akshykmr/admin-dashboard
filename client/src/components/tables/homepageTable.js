import React, { useState, useEffect } from "react";
import { Table, Thead, Tbody, Th, Tr, Td } from "../elements/Table";
import { Button, Image, Text, Box } from "../elements";
import { useNavigate } from "react-router-dom";
import { MdEventNote } from "react-icons/md";
import ToggleBtn from "../../components/elements/togglebtn/ToggleBtn";
import CustomeLoader from "../../pages/master/Loader/CustomeLoader";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function HomepageTable({ thead, tbody, loader}) {

  const serverUrl = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem('token')

  const navigate = useNavigate();

  const [data, setData] = useState([]);

  const [toggleStatus, setToggleStatus] = useState([]);

  useEffect(() => {
    if (tbody) {
      setData(tbody);
      const initialToggleStatus = tbody.map((item) => item.is_deleted);
      setToggleStatus(initialToggleStatus); // storing the status of banner to handle the toggle btn
    }
  }, [tbody]);

  console.log(toggleStatus, "toggleStatus");

  const handleActionOnEvent = async (index, isEdit, isView, isDelete) => {
    localStorage.setItem("bannerId", data[index]._id); // setting banner id to perform the update and preview operation on specific id

    if (isEdit) {
      if (data.length) {
        navigate("/update-banner"); // navigating to update page
      }
    }
    if (isView) {
      if (data.length > 0) {
        navigate("/view-banner"); // navigating to preview page
      }
    }

    // if (isDelete) {

    //   const confirmDel = window.confirm(
    //     "Are you sure you want to delete this event"
    //   );

    //   if (confirmDel) {
    //     try {
    //       const headers = {
    //         token: token,
    //       };
    //       const response = await axios.delete(
    //         `${serverUrl}/home/deleteContent/${data[index]._id}`,
    //         { headers }
    //       );
    //       if (response.status === 200) {
    //         toast.success(response.data.result);
    //         setData((prevData) => prevData.filter((_, i) => i !== index));
    //       }
    //     } catch (error) {
    //       console.error("Error:", error.response.status);
    //       toast.error(error.response.error);
    //     }
    //   }
    // }
  };


  const handleToggle = async (index, isChecked) => {

    const bannerId = data[index]._id;

 try {
      const headers = {
        token: token,
      };

      const response = await axios.delete(
        `${serverUrl}/home/deleteContent/${bannerId}`,
        { headers }
      );

      if (response.status === 200) {
        setToggleStatus((prevToggleStatus) =>
        prevToggleStatus.map((value, currentIndex) =>
          currentIndex === index ? isChecked : value
        )
      );
        if (isChecked === true) {
          toast.error("Banner Deactivated");
        }
        if (isChecked === false) {
          toast.success("Banner Activated");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred");
    }
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
        <Tbody className="mc-table-body even">
          {loader ? (
            <Tr>
              <Td colSpan={thead.length}>
                <CustomeLoader />
              </Td>
            </Tr>
          ) : (
            data?.map((item, index) => (
              <Tr key={index}>
                <Td title={item?.para}>
                  <Box className="mc-table-profile">
                    {item?.banner ? (
                      <Image
                        src={`${serverUrl}${item?.banner}`}
                        alt="banner Image"
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
                      {item?.para?.split(" ").slice(0, 8).join(" ")}
                      {item?.para?.split(" ").length > 8 && " ..."}
                    </Text>
                     
                  </Box>
                </Td>
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
                  </Box>
                </Td>
                <Td>
                  <Box className="mc-table-icon role  d-flex justify-content-center">
                    <ToggleBtn
                      id={index} // Use a unique identifier (e.g., row index) as id
                      initialChecked={toggleStatus[index]} // Provide the initial toggle status
                      onToggle={handleToggle} // Pass a callback to handle the toggle action
                    />
                  </Box>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </Box>
  );
}
