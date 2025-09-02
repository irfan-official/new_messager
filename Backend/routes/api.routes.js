import express from "express";

import {
  handleLogin,
  handleRegister,
  handleCreateGroup,
  handleJoinGroup,
} from "../controllers/api.controller.js";
const route = express.Router();
export default route;

route.post("/login", handleLogin);
route.post("/register", handleRegister);
route.post("/createroom", handleCreateGroup);
route.post("/joinroom", handleJoinGroup);
