import React, { useState, useEffect, useContext, useRef } from "react";
import UnknowFriendRoomCard from "./UnknowFriendRoomCard.jsx";
import UnknowGroupRoomCard from "./UnknowGroupRoomCard.jsx";
import SubRoomCard from "./SubRoomCard.jsx";

import {
  editMessage,
  findClickStatus,
  formatTime,
  isNewerMessage,
} from "../../utils/RoomCard.utils.js";

import { UserContext } from "../context/Context.jsx";

function RoomCard({
  socket,
  index,
  userID,
  roomName,
  roomPhoto,
  timeStamps,
  unseenMessage,
  unseenMessageSenderID,
  roomInfo, ///////
  linked, //////
  active,
  roomType,
  roomID,
  roomOwnerID,
  roomKey,
}) {
  let { click, setClick, roomLastSeenMap, setRoomLastSeenMap, userData } =
    useContext(UserContext);

  const [latestMessage, setLatestMessage] = useState(unseenMessage);
  const [latestMessageSenderID, setLatestMessageSenderID] = useState(
    unseenMessageSenderID
  );
  const [displayCurrentMessageTime, setDisplayCurrentMessageTime] =
    useState(timeStamps);
  const [messageStatus, setMessageStatus] = useState("OLD");
  const [isNewer, setIsNewer] = useState(true);

  useEffect(() => {
    setIsNewer(
      isNewerMessage(
        click,
        roomKey,
        roomLastSeenMap,
        displayCurrentMessageTime,
        userID,
        latestMessageSenderID
      )
    );
  }, [click]);

  useEffect(() => {
    socket.on("latestMessage", (data) => {


      if (String(roomID) === String(data.roomID)) {

        setLatestMessageSenderID(data.senderID);
        setLatestMessage(data.message);

        setDisplayCurrentMessageTime(data.time);
        setMessageStatus((prev) => (prev != "NEW" ? "NEW" : prev));
      }
    });
  }, [latestMessage, latestMessageSenderID]);

  function isClickedR() {
    return click.roomID === roomID ? true : false;
  }

  return (
    <div
      onClick={() => {
        const previousRoomID = click.roomID;
        setMessageStatus("NEW");

        setClick((prevData) => ({
          clickStatus: findClickStatus(prevData, roomID),
          roomIndex: index,
          roomType: roomType,
          roomName: roomName,
          roomPhoto: roomPhoto,
          roomID: roomID,
          roomOwnerID: String(roomOwnerID) || "",
          roomKey: roomKey,
        }));

        // console.log("click ==> ", click);

        setRoomLastSeenMap((prev) => ({
          ...prev,
          [roomID]: Date.now(),
          [previousRoomID]: Date.now(),
        }));
      }}
      className="select-none w-full h-20 bg-slate-900 border-b-2 border-b-slate-500 flex rounded-lg overflow-hidden container"
    >
      <div className="__space_div__ w-[8px] h-full flex items-center ml-1.5">
        <div
          className={`w-full h-[35%]  rounded-full transform transition-transform duration-500 ease-in-out 
              ${
                isClickedR()
                  ? click.clickStatus
                    ? "bg-lime-500"
                    : ""
                  : click.roomIndex > index
                  ? "translate-y-24"
                  : "-translate-y-24 "
              }`}
        ></div>
      </div>
      <div className="__room_photo__ pl-1.5 w-[97px] h-full flex items-center justify-center relative">
        <div className="__room_metadata__ w-[57px] h-[57px] bg-black rounded-full overflow-clip">
          <img className="object-contain" src={roomPhoto} alt="image" />
        </div>
      </div>

      <div className="__room_info__ h-full w-[75%]">
        <div className="__name_&_last_message_time__ w-full h-[54%] b flex items-center">
          <div className="__name__ h-full w-[75%] px-2 py-2">
            <h1 className="text-[18px]">{roomName}</h1>
          </div>
          <div
            className={`__last_message_time__ time flex items-center w-[25%] h-[90%] justify-center ${
              messageStatus != "OLD"
                ? isNewer
                  ? "text-orange-500 font-semibold"
                  : ""
                : ""
            }`}
          >
            <h6 className="text-[0.7rem]">
              {formatTime(displayCurrentMessageTime)}
            </h6>
          </div>
        </div>
        <div className="__last_message__ w-full h-[40%] flex items-center justify-start pl-2.5">
          <h5
            className={`text-[0.7rem] truncate text${
              messageStatus != "OLD"
                ? isNewer
                  ? "text-orange-500 font-semibold"
                  : "text-white font-normal"
                : ""
            }`}
          >
            {String(userID) === String(latestMessageSenderID) ? "You: " : ""}
            {latestMessage}
          </h5>
        </div>
      </div>
      <div className="__active_status__ w-[px] h-full  flex items-start m-[6px]">
        <div
          className={`w-[7px] h-[7px] rounded-full ${
            active ? "bg-lime-500" : "bg-orange-500"
          }`}
        ></div>
      </div>
    </div>
  );
}

export default RoomCard;
