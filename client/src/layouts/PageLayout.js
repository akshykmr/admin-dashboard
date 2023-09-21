import React from "react";
import Main from "./Mian";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { DrawerProvider } from "../context/Drawer";

export default function PageLayout({ children }) {

    return (
        <DrawerProvider>
            <Header />
            <Sidebar />
            <Main>
                <>
                    { children }
                </>
            </Main>
        </DrawerProvider>
    )
}