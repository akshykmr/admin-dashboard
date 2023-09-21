import express from 'express'
import cors from "cors"
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import './src/helper/init'
import { errorHandler, notFoundHandler } from './src/helper/express-middleware';
import UserModule from './src/modules/user';
// import activityModule from "./src/modules/activity";
// import taskModule from './src/modules/task';
// import elementModule from './src/modules/element';
// import sensorModule from './src/modules/sensor';
// import elasticModule from './src/modules/elastic';
// import dashboardModule from './src/modules/feedback';




const modules =[
    UserModule
    // activityModule,
    // taskModule,
    // elementModule,
    // sensorModule,
    // elasticModule,
    // dashboardModule

]


export const createApp = () => {
    const app = express();

    app.use(cors());
    app.use(bodyParser.json({ limit: "100mb" }));
    app.use(bodyParser.urlencoded({ limit: '150mb', extended: true, parameterLimit: 500000 }));
    // app.use(cookieParser());

    // initializePassport(passport)

    // app.use(session({
    //     secret: 'secret',
    //     resave: false,
    //     saveUninitialized: false,
    //     cookie: {
    //         // domain: 'goal2.dev.client.kloudlite.io',
    //         // httpOnly: true,
    //         secure: false,
    //         // sameSite: "strict",
    //         path: "/",
    //         // Session expires after 60 min of inactivity.
    //         maxAge: 30 * 24 * 60 * 60 * 1000
    //     }

    // }))





    app.use('/healthy',(req,res)=>{
        res.send('healthy ')
    })
  

    return app;
};



export const finishApp = (app) => {
    app.use(notFoundHandler);
    app.use(errorHandler);
};


export const useModules = (app) => {
    // console.log('******during*****');

    // console.log(modules);
    modules.map((module) => module.init(app));
};
