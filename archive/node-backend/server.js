// archived copy of server.js
/*
  Original Express server. Archived after migrating to FastAPI.
*/
import e from "express";
import cors from "cors";
import { connect } from "mongoose";
import { connectDB } from "../..//backend/config/db.js";

const app = e();
const PORT = 5000;

app.use(cors());

//connect to database
// connectDB();

//Middleware to parse JSON requests
app.use(e.json());

//Routes
app.get("/", (req, res) => {
  res.send("API WORKING - archived copy");
});
