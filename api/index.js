import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import kamarsRoute from "./routes/kamars.js";
import customersRoute from "./routes/customers.js";
import kamarSalesRoute from "./routes/kamarSales.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
dotenv.config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to mongoDB.");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});

//middlewares
app.use(cors())
app.use(cookieParser())
app.use(express.json());

const port = process.env.port || 8800;

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/kamars", kamarsRoute);
app.use("/api/customers", customersRoute);
app.use("/api/sales", kamarSalesRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

// app.use(express.static(path.join(__dirname, "/admin")));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '/admin/build', 'index.html'));
// });

app.listen(port, () => {
  connect();
  console.log("Connected to backend.");
});