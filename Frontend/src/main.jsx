import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import "./index.css";
import App from "./App.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import CreateRoom from "./components/CreateRoom.jsx";
import JoinRoom from "./components/JoinRoom.jsx";
import Context from "./context/Context.jsx";

createRoot(document.getElementById("root")).render(
  <Context>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          }
        />
        <Route path="/create" element={<CreateRoom />} />
        <Route
          path="/join"
          element={
            <ProtectedRoute>
              <JoinRoom />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  </Context>
);
