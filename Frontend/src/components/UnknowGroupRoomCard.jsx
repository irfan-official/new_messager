import React, { useContext } from "react";
import { UserContext } from "../context/Context.jsx";
import { editMessage, formatTime } from "../../utils/RoomCard.utils.js";
import { VscDiffAdded } from "react-icons/vsc";

function UnknowGroupRoomCard({
  roomName,
  messageStatus,
  isNewer,
  displayCurrentMessageTime,
  latestMessageSenderID,
  latestMessage,
}) {
  let { click } = useContext(UserContext);
  return (
    <>
      <div className="__room_info__ h-full w-[75%]">
        <div className="__name_ w-full h-[54%] b flex items-center">
          <div className="__name__ h-full w-[75%] px-2 py-2">
            <h1 className="text-[18px]">{click.roomName}</h1>
          </div>
        </div>
      </div>
      <div className="__icon__">
        <VscDiffAdded />
      </div>
    </>
  );
}

export default UnknowGroupRoomCard;
