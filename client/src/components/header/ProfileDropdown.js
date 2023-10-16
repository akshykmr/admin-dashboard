import React from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { DuelText, RoundAvatar } from "..";
import { Anchor, Button } from "../elements";

export default function ProfileDropdown({ name, username, image, dropdown }) {
  const hangleLogOut = () => {
    localStorage.clear();
  };

  const role = localStorage.getItem("role");

  return (
    <Dropdown className="mc-header-user">
      <Dropdown.Toggle className="mc-dropdown-toggle">
        <RoundAvatar src={image} alt="avatar" size="xs" />
        <DuelText title={name} descrip={username} size="xs" />
      </Dropdown.Toggle>
      <Dropdown.Menu align="end" className="mc-dropdown-paper">
      {dropdown.map((item, index) => {
  // Define conditions to determine if the link should be visible based on role
  const isAdminVisible = role === "admin" && (item.path === "/my-account" || item.path === "/login")
  const isSuperAdminVisible = role === "super_admin" && (item.path === "/reset-password" || item.path === "/login")

  // Check if either admin or super_admin visibility conditions are met
  if (isAdminVisible || isSuperAdminVisible) {
    return (
      <Link key={index} to={item.path}>
        <Button
          icon={item.icon}
          text={item.text}
          className="mc-dropdown-menu"
          onClick={item.onClick === "logout" ? () => hangleLogOut() : null}
        />
      </Link>
    );
  }

  // If none of the conditions are met, do not render the link
  return null;
})}

      </Dropdown.Menu>
    </Dropdown>
  );
}
