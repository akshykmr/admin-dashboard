import React from "react";
import MenuItem from "./MenuItem";
import { List, Menu, Heading } from "../elements";

export default function MultipleMenu({ data }) {
  const userType = localStorage.getItem("permission");

  const visibleIndexes = getVisibleIndexes(userType);
  //   console.log(userType,'userType',visibleIndexes)

  return (
    <>
      {data?.map((item, index) => (
        <Menu key={index} className="mc-sidebar-menu">
          <Heading as="h5" className="mc-sidebar-menu-title">
            {item.title}
          </Heading>
          <List className="mc-sidebar-menu-list">
            {item.menu.map(
              (menuItem, menuItemIndex) =>
                visibleIndexes.includes(menuItemIndex) && (
                  <MenuItem key={menuItemIndex} item={menuItem} />
                )
            )}
          </List>
        </Menu>
      ))}
    </>
  );
}

function getVisibleIndexes(userType) {
  switch (userType) {
    case "super_admin":
      return [0, 1, 2, 3, 4, 5, 6, 7, 8]; // All indexes are visible
    case "parking_management":
      return [0, 1, 5, 8];
    case "event_management":
      return [0, 1, 4, 8];
    case "ticket_management":
      return [0, 1, 6, 7, 8];
    default:
      return []; // Default to an empty array if userType doesn't match any case
  }
}
