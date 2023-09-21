// import axios from "axios"

const checkAuth = () => {
    /*  Getting token value stored in localstorage, if token is not present we will open login page 
        for all internal dashboard routes  */
        const TOKEN = localStorage.getItem("token")
        const PUBLIC_ROUTES = ["login", "forgot-password", "register", "documentation"]
    
        const isPublicPage = PUBLIC_ROUTES.some( r => window.location.href.includes(r))
    
        if(!TOKEN && !isPublicPage){
            window.location.href = '/login'
            return;
        }
    }
    
    export default checkAuth