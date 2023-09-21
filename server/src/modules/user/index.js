import { Router } from "express";
import UserRoute from "./router/user"


const router = Router()

router.use('/', UserRoute);



const UserModule = {
    init: (app) => {
        app.use(router);
        console.log("Activity module Loaded")
    },
};

export default UserModule
