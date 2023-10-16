import React, { useContext, useState, useRef, useEffect } from 'react';
import { ProfileDropdown } from '../components/header';
import { Button, Section, Box, Input } from "../components/elements";
import { DrawerContext } from '../context/Drawer';
import { ThemeContext } from '../context/Themes';
import { Logo } from '../components';
import data from "../data/master/header.json";


export default function Header() {

    const serverUrl = process.env.REACT_APP_BASE_URL;

    const role = localStorage.getItem("role");
    const Admin_Name = localStorage.getItem("Admin_Name");

    const profile_url = localStorage.getItem("profile_url");
    const [profileImg, getUploadedImageFile] = useState()


    useEffect(()=>{
        if(profile_url !== "undefined" && profile_url !== null){
            getUploadedImageFile(`${serverUrl}${profile_url}`)
        }
    },[profile_url])

    // console.log(profile_url)
    // console.log(profileImg)


    const { drawer, toggleDrawer } = useContext(DrawerContext);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const searchRef = useRef();
    const [scroll, setScroll] = useState("fixed");
    const [search, setSearch] = useState("");

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 0) setScroll("sticky");
        else setScroll("fixed");
    });

    document.addEventListener('mousedown', (event) => {
        if (!searchRef.current?.contains(event.target)) {
            setSearch("");
        }
    })

    return (
        <Section as="header" className={`mc-header ${ scroll }`}>
            <Logo 
                src = { data?.logo.src }
                alt = { data?.logo.alt }
                name = { data?.logo.name }
                href = { data?.logo.path } 
            />
            <Box className="mc-header-group">
                <Box className="mc-header-left">
                    <Button 
                        icon={ data?.search.icon } 
                        className="mc-header-icon search" 
                        onClick={()=> setSearch("show")}
                    />
                    <Button 
                        icon={ drawer ? "menu_open" : "menu" } 
                        className="mc-header-icon toggle" 
                        onClick={ toggleDrawer } 
                    />
                    {/* <Box className={`mc-header-search-group ${ search }`}>
                        <form className="mc-header-search" ref={ searchRef }>
                            <Button className="material-icons">{ data?.search.icon }</Button>
                            <Input type="search" placeholder={ data?.search.placeholder } />
                        </form>
                    </Box> */}
                </Box>
                <Box className="mc-header-right">
                    <Button 
                        icon={ theme }
                        title={ data.theme.title }
                        onClick={ toggleTheme }
                        className={`mc-header-icon ${ data.theme.addClass }`}
                    />
                    
                    <ProfileDropdown 
                        name={Admin_Name}
                        image={ profileImg || data.profile.image }
                        username={role === "super_admin" ? "Super Admin" : "Admin"}
                        dropdown={ data.profile.dropdown }
                    />
                </Box>
            </Box>
        </Section>
    );
}

