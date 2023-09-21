import express from 'express';
import { createApp ,finishApp ,useModules } from './app';
// import LTIModule from './router/lti';






// const server = http.createServer(app);
// const io = new Server(server);
// app.use(cors());
// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.urlencoded({ limit: '150mb', extended: true, parameterLimit: 500000 }));

// app.use(router);
// app.use('/user',user);


// const esClient = elasticsearch.Client({
//   host: 'http://127.0.0.1:9200',
// });
// app.post("/products", (req, res) => {
//   esClient.index({
//     index: 'products',
//     body: {
//       "id": req.body.id,
//       "name": req.body.name,
//       "price": req.body.price,
//       "description": req.body.description,
//     },
//   });
// });
(()=>{
  
    const app = createApp();

    useModules(app);

    finishApp(app);

    const port = process.env.PORT || 4000;
app.listen(port, (err) => {
  if (err) {
    console.log(`could not connect due to ${err}`);
  }
  console.log(`server is running at ${port}`);
});
})()

// const port = process.env.PORT || 4000;
// app.listen(port, (err) => {
//   if (err) {
//     console.log(`could not connect due to ${err}`);
//   }
//   console.log(`server is running at ${port}`);
// });

