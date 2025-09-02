import React, { useRef, useState, useContext, useEffect, useMemo } from "react";
import RoomCard from "./components/RoomCard";
import RoomMessage from "./components/RoomMessage";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { UserContext } from "./context/Context.jsx";
import { MdGroupAdd } from "react-icons/md";

import {
  TimeFinder,
  RoomInfoFinder,
  UnseenMessageFinder,
  unseenMessageSenderIDFinder,
  startDragging,
} from "../utils/App.utils.js";

function App() {
  const Navigate = useNavigate();

  let {
    userHistory,
    setUserHistory,
    click,
    sidebarWidth,
    setSidebarWidth,
    isDragging,
    startX,
    startWidth,
    userData,
    setUserData,
  } = useContext(UserContext);

  useEffect(() => {
    setUserData(JSON.parse(localStorage.getItem("user")) || "");
    const check = JSON.parse(localStorage.getItem("user") || "");
    if (!check) {
      return Navigate("/login");
    }
    if (!userData) {
      setUserData(check);
    }
  }, []);

  const socket = useMemo(
    () =>
      io("http://localhost:3000", {
        withCredentials: true,
      }),
    []
  );

  useEffect(() => {
    socket.on("error", async (data) => {
      alert(data.message);
      return Navigate("/login");
    });
  }, []);

  useEffect(() => {
    socket.emit("register", {
      userID: userData.userID,
    });
  }, []);

  useEffect(() => {
    socket.on("allData", async (data) => {
      setUserHistory(data);
      console.log("register response data ==> ", data);
    });
  }, []);

  return (
    <div className="w-full h-screen bg-gray-600 text-white flex flex-col">
      <header className="w-full h-14 bg-slate-950 flex items-center px-4">
        <h1 className="text-xl font-bold">Chat App</h1>
      </header>

      <main className="flex flex-1 overflow-hidden">
        <aside className="w-20 min-w-[60px] bg-slate-950"></aside>

        <aside
          id="resizableSidebar"
          className={`h-full bg-slate-700 rounded-lg flex flex-col border-r-2 border-t-2 border-slate-600 ${
            isDragging.current ? "" : "transition-all duration-200 ease-in-out"
          }`}
          style={{ width: sidebarWidth }}
        >
          <div className="w-full h-20 bg-slate-700 px-4 flex items-center">
            <div className="bg-slate-900 w-full flex itms-center justify-between">
              <h2 className="text-lg font-semibold">Rooms</h2>
              <span className=" flex items-center justify-center pr-3 cursor-pointer">
                <span
                  onClick={() => {
                    Navigate("/create");
                  }}
                  className="scale-150 "
                >
                  <MdGroupAdd />
                </span>
              </span>
            </div>
          </div>
          <div className="w-full h-16 bg-slate-800 p-4 flex items-center">
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-gray-950 text-white p-2 rounded"
            />
          </div>
          <div className="flex-1 flex flex-col gap-2 p-2 overflow-auto pt-4">
            {Array.isArray(userHistory.views) &&
            userHistory.views.length > 0 ? (
              userHistory.views.map((obj, userHistoryArrayIndex) => {
                const { index, room } = obj;
                return (
                  <RoomCard
                    key={userHistoryArrayIndex}
                    socket={socket}
                    index={index || userHistoryArrayIndex}
                    userID={userData.userID}
                    roomName={
                      room?.type === "User"
                        ? room.createdByUser?.name
                        : room.createdByGroup?.name
                    }
                    roomPhoto={
                      room?.type === "User"
                        ? room.createdByUser?.image?.url
                        : room.createdByGroup?.image?.url
                    }
                    timeStamps={room.lastMessage?.createdAt || ""}
                    unseenMessage={room?.lastMessage?.message || ""}
                    unseenMessageSenderID={room.lastMessage?.sender._id}
                    acvtive={
                      room?.type === "User" ? room.createdByUser?.active : false
                    }
                    roomType={room?.type}
                    roomID={room._id}
                    roomKey={room.roomKey}
                    roomOwnerID={
                      room.type === "User"
                        ? room.createdByUser?._id
                        : room.createdByGroup?._id
                    }
                  />
                );
              })
            ) : (
              <p className="text-center text-gray-300 mt-4">
                You have no rooms yet.
              </p>
            )}
          </div>
        </aside>

        <div
          onMouseDown={(e) =>
            startDragging(e, isDragging, startX, startWidth, setSidebarWidth)
          }
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#94a3b8")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#64748b")}
          style={{
            width: "4px",
            backgroundColor: "#64748b",
            cursor: "ew-resize",
            zIndex: 10,
            height: "100%",
            flexShrink: 0,
          }}
        />

        <section className="flex-1 h-full bg-gray-600 p-4">
          {click.clickStatus ? (
            <RoomMessage
              userID={userData.userID}
              socket={socket}
              roomType={click.roomType}
              roomName={click.roomName}
              roomPhoto={click.roomPhoto}
              roomID={click.roomID}
              roomOwnerID={click.roomOwnerID}
              roomKey={click.roomKey}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <h1 className="text-6xl font-semibold">welcome user</h1>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
