import { Server } from "socket.io";
import handleSocket from "../../controllers/ws.controller.js";

const wsConnection = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173", // Replace with the frontend origin
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => handleSocket(socket, io)); // ✅ pass both
};

export default wsConnection;
