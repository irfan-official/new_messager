import React from "react";
import { useState, useEffect, useContext, useRef, useMemo } from "react";
import {
  formateMessage,
  normalizeDate,
} from "../../utils/RoomMessage.utils.js";
import { UserContext } from "../context/Context.jsx";

function RoomMessage({
  userID,
  socket,
  roomType,
  roomName,
  roomPhoto,
  roomID,
  roomKey,
  roomOwnerID,
}) {
  let { click, setRoomLastSeenMap } = useContext(UserContext);

  let [scrollBehave, setScrollBehave] = useState("auto");
  let [clientMessage, setClientMessage] = useState("");
  let [allMessages, setAllMessages] = useState([]);

  //let behave = "smooth"
  const scrollRef = useRef(null);

  useEffect(() => {
    const data = {
      userID,
      roomID,
      roomType,
      roomKey: roomKey || "",
      roomOwnerID,
    };
    socket.emit("roomEnter", data);

    setRoomLastSeenMap((prev) => ({
      ...prev,
      [roomID]: Date.now(),
    }));
  }, [click]);

  useEffect(() => {
    socket.on("initialReply", async (data) => {
      setAllMessages(data.roomAllMessages || []);
    });
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: scrollBehave,
    });
  }, [allMessages]);

  useEffect(() => {
    socket.on("reply", (data) => {
      console.log("reply from server ==> ", data);
      setAllMessages((messages) => [...messages, data]);
    });
    return () => socket.off("reply");
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (!clientMessage) return;
    if (clientMessage.length <= 200) {
      setScrollBehave("smooth");
      const data = {
        senderID: userID,
        roomID,
        roomKey,
        roomType,
        message: clientMessage,
      };
      socket.emit("message", data);
      setClientMessage("");
    }
  }

  return (
    <>
      <div className="h-full w-full  rounded-lg p-4 flex flex-col gap-1">
        <div className="header w-full h-24 rounded-lg bg-gray-900 flex items-center pl-10">
          <div className="rounded-full w-[62px] h-[62px] bg-amber-100 overflow-clip object-center">
            <img className="object-center" src={roomPhoto} alt="image" />
          </div>
          <h1 className="text-3xl ml-3">{roomName}</h1>
        </div>
        <div className=" message_show bg-gray-900 w-full h-[91%] rounded-lg flex items-center justify-center">
          <div className="w-full h-full border rounded-lg overflow-hidden flex flex-col items-center justify-end gap-1">
            <div
              ref={scrollRef}
              className="w-full h-[calc(100%-3.7rem)] overflow-y-auto px-1 py-1 flex flex-col gap-1 border"
            >
              <div className="mt-auto flex flex-col gap-5">
                {allMessages.map((msg, idx) => {
                  return (
                    <div
                      key={idx}
                      className={`w-full min-h-[3rem] px-5 py-1 flex relative  ${
                        /* msg.c */ String(userID) === String(msg.sender._id)
                          ? "justify-end"
                          : "justify-start"
                      } flex-wrap overflow-hidden`}
                    >
                      <div className="flex gap-1 items-end ">
                        <div className="flex flex-col gap-[2pxc]">
                          <div className="top_div flex items-end gap-2 ">
                            {
                              /* msg.c */ String(userID) !=
                              String(msg.sender._id) ? (
                                <img
                                  className="w-[30px] h-[30px] rounded-full object-cover"
                                  src={msg.sender.image}
                                  alt=""
                                />
                              ) : (
                                ""
                              )
                            }
                            <p
                              className={`${
                                /* msg.c */ String(userID) ===
                                String(msg.sender._id)
                                  ? "bg-blue-600"
                                  : "bg-violet-600"
                              } px-3  pt-3 pb-2 text-[1.2rem] rounded-tl-sm rounded-tr-xl rounded-bl-xl rounded-br-sm inline-flex flex-wrap text-pretty items-center `}
                            >
                              {msg.message}
                            </p>
                          </div>

                          {String(userID) != String(msg.sender._id) ? (
                            <div className=" flex gap-7  items-center">
                              <h6 className="text-[1rem] font-semibold">
                                {msg.sender.name}
                              </h6>
                              <h6 className="text-[0.6rem]">
                                {normalizeDate(msg.createdAt) || "1/1/1"}
                              </h6>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <form
              onSubmit={handleSubmit}
              className="w-full h-[68px] px-2 py-2 bottom-0 bg-slate-600 flex gap-1 items-center justify-center text-black"
            >
              <div className="w-[10%] bg-slate-950 h-full">d</div>
              <input
                onChange={(e) => {
                  //socket.emit("typeing");
                  setClientMessage(e.target.value);
                }}
                value={clientMessage}
                className="w-[80%] h-full px-2 py-2 rounded-lg bg-slate-950 border-2 border-slate-500 text-white"
                type="text"
                placeholder="message"
              />

              <button
                onClick={() => {
                  setClientMessage((previousMessage) =>
                    formateMessage(previousMessage)
                  );
                }}
                type="submit"
                className="w-[10%] h-full text-center px-2 py-2 rounded-lg bg-black text-white border-2 border-slate-500"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default RoomMessage;
