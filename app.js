const express = require('express');
const MongoConnect = require("./utilities/db").Mongoconnect;
const fileupload = require("express-fileupload");
const route = require("./route");
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(fileupload());
app.use(cors())
app.use(route);

app.use((error,req,res,next) => {
    console.log(error,"sd")
    res.send(error)
})

MongoConnect(() => {
    app.listen(8001, () => console.log("server is running 8001"));
  });