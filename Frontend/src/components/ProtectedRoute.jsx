import React, { useState } from "react";
import { Navigate } from "react-router-dom";
// import { addUserData, getAllUserData, deleteUserData } from "../../utils/db.js";

const ProtectedRoute = ({ children }) => {
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (err) {
    user = null;
  }

  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

/*
```
{
  success: Boolean
  fromUserImmage: ""
  rooms: [
    {
      roomType: "group" or "private"
      roomName: ""
      roomTitle: ["userName_1", "userName_2"] or ["roomName(for group only)"]
      roomPhoto [{userID, image},{userID, image}] or [{image}]
      messages: [{_id, message, sender: {_id, userName, image}, receiver: {_id, userName, image} }, {...}],
      lastMessage: "",
      unseenMessage" "", 
      timeStamps: "Date"
    }
  ]  
}
```

*/
