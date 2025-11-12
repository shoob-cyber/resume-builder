import e from "express";
import cors from "cors";
import { connect } from "mongoose";
import { connectDB } from "./config/db.js";

const app = e();
const PORT = 5000;

app.use(cors());

//connect to database
connectDB();


//Middleware to parse JSON requests
app.use(e.json());

//Routes
app.get("/", (req, res) => {
  res.send("API WORKING");
});

import resumeRoutes from "./routes/resumeRoutes.js";
app.use("/api/resumes", resumeRoutes);
import atsRoutes from "./routes/atsRoutes.js";
// Proxy route that forwards analyze requests to the Python ATS microservice
app.use("/api/analyze", atsRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
