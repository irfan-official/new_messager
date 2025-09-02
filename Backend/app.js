import cors from "cors";
dotenv.config();
import express from "express";
import http from "http";
import apiRoute from "./routes/api.routes.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import wsConnection from "./config/connection/ws.connection.js";
import dbConnection from "./config/connection/db.connection.js";
const app = express();
const httpServer = http.createServer(app);

export { httpServer };

app.use(
  cors({
    origin: "http://localhost:5173", // Replace with the frontend origin
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("view engine", "ejs");

app.use("/api/v1", apiRoute);
app.get("/", (req, res) => {
  return res.status(201).send("hello");
});

httpServer.listen(process.env.PORT, () => {
  dbConnection();
  wsConnection(httpServer);
  console.log(`server started at http://localhost:${process.env.PORT}`);
});
