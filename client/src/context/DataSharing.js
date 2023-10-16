import React from "react";

export const DataSharingContext = React.createContext();

export const DataProvider = ({children}) =>{

    const [data, setGetData] = React.useState("null");
    
const dataAsProp =(result)=>{
    setGetData(result);
}

return (
    <DataSharingContext.Provider value={{ dataAsProp, data }}>
        { children }
    </DataSharingContext.Provider>
)

}


