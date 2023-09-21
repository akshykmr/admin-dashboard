import React from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { DuelText, RoundAvatar } from "..";
import { Anchor, Button } from "../elements";

export default function ProfileDropdown({ name, username, image, dropdown }) {

  const hangleLogOut = () =>{
    localStorage.removeItem("token");
  }

    const issuper_admin = username === '';
  
    return (
      <Dropdown className="mc-header-user">
        <Dropdown.Toggle className="mc-dropdown-toggle">
          <RoundAvatar src={image} alt="avatar" size="xs" />
          <DuelText title={name} descrip={username} size="xs" />
        </Dropdown.Toggle>
        <Dropdown.Menu align="end" className="mc-dropdown-paper">
            
          {dropdown.map((item, index) => (
            issuper_admin && item.path === '/my-account' ? null : (
              <Link key={index} to={item.path}>
                <Button
                  icon={item.icon}
                  text={item.text}
                  className="mc-dropdown-menu"
                  onClick={item.onClick === "logout" ? ()=>hangleLogOut() : ""}
                />
              </Link>
            )
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
