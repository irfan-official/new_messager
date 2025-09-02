import React, { useContext, useEffect } from "react";
import { UserContext } from "../context/Context.jsx";
import { editMessage, formatTime } from "../../utils/RoomCard.utils.js";

function SubRoomCard({
  userID,
  roomName,
  messageStatus,
  isNewer,
  displayCurrentMessageTime,
  latestMessageSenderID,
  latestMessage,
  active,
}) {
  let { click } = useContext(UserContext);

  useEffect(() => {
    console.log(`roomKey = ${click.roomKey} && isNewer = ${isNewer}`);
  }, []);
  return (
    <>
    
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
            className={`text-[0.7rem] ${
              messageStatus != "OLD"
                ? isNewer
                  ? "text-orange-500 font-semibold"
                  : "text-white font-normal"
                : ""
            }`}
          >
            {String(userID) === String(latestMessageSenderID) ? "You: " : ""}
            {editMessage(latestMessage)}
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

    </>
  );
}

export default SubRoomCard;
