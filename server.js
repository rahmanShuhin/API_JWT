const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
//import routes
const authRoute = require("./Routes/auth");
const postRoute = require("./Routes/post");

dotenv.config();
//connect to DB
mongoose.connect(
  process.env.DB_connection,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("connected to db")
);

//Middleware
app.use(bodyParser.json());

//route middleware
app.use("/api/user", authRoute);
app.use("/api/posts", postRoute);

app.listen(5000, () => console.log("Server running on port 5000"));
