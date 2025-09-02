import React, { useState, useRef } from "react";
import { createContext } from "react";

export const UserContext = createContext();

function Context(props) {
  let [userHistory, setUserHistory] = useState({});

  let [click, setClick] = useState({
    clickStatus: false,
    roomIndex: 1,
    roomType: "",
    roomName: "",
    roomPhoto: "",
    roomID: "",
    roomOwnerID: "",
    roomKey: "",
  });

  let [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("user")) || ""
  );

  const [roomLastSeenMap, setRoomLastSeenMap] = useState({});

  const [sidebarWidth, setSidebarWidth] = useState(320);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  return (
    <UserContext.Provider
      value={{
        userHistory,
        setUserHistory,
        click,
        setClick,
        roomLastSeenMap,
        setRoomLastSeenMap,
        sidebarWidth,
        setSidebarWidth,
        isDragging,
        startX,
        startWidth,
        userData,
        setUserData,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}

export default Context;
