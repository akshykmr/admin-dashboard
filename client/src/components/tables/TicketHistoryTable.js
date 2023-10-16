import React, { useState, useEffect } from "react";
import { Table, Thead, Tbody, Th, Tr, Td } from "../elements/Table";
import { Button, Text, Box } from "../elements";
import { useNavigate } from "react-router-dom";
import { PiTicket } from "react-icons/pi";
import CustomeLoader from "../../pages/master/Loader/CustomeLoader";

export default function TicketHistoryTable({ thead, tbody, loader,type }) {


  const navigate = useNavigate();
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(tbody);
  }, [tbody]);

  
  const handleViewTicket = async (index) => {
    localStorage.setItem("ticketId", data[index]._id);
    if (data.length > 0) {
      navigate("/ticket-details");
      localStorage.setItem("redirectedFrom", type);
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
          <Tr>
            <Td colSpan={thead?.length}>
              <CustomeLoader />
            </Td>
          </Tr>
        ) : (
          <Tbody className="mc-table-body even">
            {data?.length > 0 ? (
              <>
                {data?.map((item, index) => (
                  <Tr key={index}>
                    <Td title={item.booked_by?.name}>
                      <Box className="mc-table-profile">
                        <span className="d-flex justify-content-center fs-3 ">
                          <PiTicket
                            style={{
                              animation: "none",
                              fontSize: "18px",
                              color: "#1a9f53",
                            }}
                          />
                        </span>
                        <Text>{item.booked_by?.name}</Text>
                      </Box>
                    </Td>
                    <Td title={item?.booking_id}>
                      <Box className="mc-table-icon role">
                        <Text as="span">{item.booking_id}</Text>
                      </Box>
                    </Td>

                    <Td title={item.event_id?.name}>
                        {item.event_id?.name.split(" ").slice(0, 3).join(" ")}
                      {item.event_id?.name.split(" ").length > 3 ? " ..." : ""}
                    </Td>

                    <Td title={item.totalUser}>{item.totalUser}</Td>

                    <Td title={item.event_id?.price}>
                      <Text className="mc-table-badge ">
                        {item.event_id?.price}
                      </Text>
                    </Td>

                    <Td title={item.ticket_amount}>
                      <Text className="mc-table-badge  ">
                        {item.ticket_amount}
                      </Text>
                    </Td>
                    <Td title={item.createdAt}>
                      {`${item.createdAt.slice(8, 10)}-${item.createdAt.slice(
                        5,
                        7
                      )}-${item.createdAt.slice(0, 4)}`}
                    </Td>
                    <Td title={item.event_id?.start_date}>
                      {item.event_id?.start_date.split("-").reverse().join("-")}
                    </Td>
                    <Td title={item.is_checked}>
                      {item.is_checked === false ? (
                        <Text className="mc-table-badge green">Active</Text>
                      ) : (
                        <Text className="mc-table-badge red">Scanned</Text>
                      )}
                    </Td>

                    <Td>
                      <Box className="mc-table-action">
                        <Button
                          title="view"
                          className="material-icons edit "
                          onClick={() =>
                            handleViewTicket(index)
                          }
                        >
                          {"visibility"}
                        </Button>
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
