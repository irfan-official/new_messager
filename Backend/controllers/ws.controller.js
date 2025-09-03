import User from "../models/user.model.js";
import Group from "../models/group.model.js";

import Room from "../models/room.model.js";
import Blocked from "../models/blocked.model.js";

import Media from "../models/media.model.js";
import Message from "../models/message.model.js";

import { roomTypes, modelTypes } from "../utils/types.js";
import { ReplyMessage, LatestMessage } from "../utils/message.js";

const handleSocket = (socket, io) => {
  console.log(`connected ${socket.id}`);

  socket.on("register", async (data) => {
    const { userID } = data;
    try {
      const userData = await User.findOne({ _id: userID })
        .populate([
          {
            path: "views.room",
            model: modelTypes.room,
            select: "type key createdByUser createdByGroup lastMessage",
            populate: [
              {
                path: "createdByUser",
                model: modelTypes.user,
                select: "name image",
                populate: {
                  path: "image",
                  model: modelTypes.image,
                  select: "url",
                },
              },
              {
                path: "createdByGroup",
                model: modelTypes.group,
                select: "name image",
                populate: {
                  path: "image",
                  model: modelTypes.image,
                  select: "url",
                },
              },
              {
                path: "lastMessage",
                model: modelTypes.message,
                select: "sender message media createdAt",
                populate: {
                  path: "sender",
                  model: modelTypes.user,
                  select: "-password",
                },
              },
            ],
          },
        ])
        .select("-password");

      socket.emit("allData", userData);

      userData.views.forEach(({ index, room }, idx) => {
        // console.log("----- roomkey ----", room.key);
        socket.join(String(room.key));
      });
    } catch (err) {
      console.error("Error during register:", err);
      socket.emit("error", { message: "Failed to register room." });
    }
  });

  socket.on("message", async (data) => {
    const { roomID, roomKey, roomType, senderID, message } = data;

    const senderUser = await User.findOne({ _id: senderID })
      .populate({
        path: "image",
        model: modelTypes.image,
        select: "url",
      })
      .select("-password");

    let room = await Room.findOne({ _id: roomID });

    const createdMessage = await Message.create({
      type: roomType,
      room: room._id,
      sender: senderUser._id,
      message: message,
    });

    room.lastMessage = createdMessage._id;
    await room.save();

    const replyData = new ReplyMessage(
      roomKey, //roomKey  //roomInfo.roomKey = group._id
      senderUser._id, //senderID
      senderUser.name, //senderName
      senderUser.image.url, //senderImage
      message, //message
      createdMessage.createdAt
    );

    const latestMessage = new LatestMessage(
      room._id, //roomKey  //roomInfo.roomKey = userRoom._id
      senderUser._id, //senderID
      createdMessage.createdAt, //messageCreationTime
      message //message
    );

    io.to(String(room.key)).emit("reply", replyData);

    io.to(String(room.key)).emit("latestMessage", latestMessage); // checkGroup._id = cardID for cardType = Group

    io.to(String(room.key)).emit("unseenMessage", {
      status: true,
    });
  });

  socket.on("disconnect", () => {
    console.log(`Disconnected ${socket.id}`);
  });

  socket.on("searchUser", async (data) => {
    const { userID, searchValue } = data;

    if (!userID) {
      socket.emit("Error", "user not found");
    }

    const allCard = await Name.find({ name: searchValue }).populate({
      path: "linked",
      select: "name image",
    });

    const responseData = allCard.map(async (data) => {
      const responseStructure = null;

      if (data.onModel === "User") {
        let user_1 = userID;
        let user_2 = data.linked._id;

        let name_1 = String(user_1) + String(user_2);
        let name_2 = String(user_2) + String(user_1);

        const foundRoom = await UserRoom.findOne({
          name: { $in: [name_1, name_2] },
        }).populate({
          path: "lastMessageID",
          select: "senderID message mediaFile createdAt",
        });

        responseStructure = {
          cardType: data.onModel,
          cardID: data.linked._id,
          name: data.linked.name,
          img: data.linked.image,
          lastMessage: foundRoom?.lastMessageID?.message || "",
          lastMessageTime: foundRoom?.lastMessageID?.createdAt || "",
          active: data.linked.active,
        };
      }
      if (data.onModel === "Group") {
        const group = await Group.findOne({ _id: data.linked._id }).populate({
          path: "lastMessageID",
          select: "senderID message mediaFile createdAt",
        });

        responseStructure = {
          cardType: data.onModel,
          cardID: data.linked._id,
          name: data.linked.name,
          img: data.linked.image,
          lastMessage: group?.lastMessageID?.message || "",
          lastMessageTime: group?.lastMessageID?.createdAt || "",
          active: data.linked.active,
        };
      }
      return responseStructure;
    });

    socket.emit("searchUserData", responseData);
  });

  socket.on("roomEnter", async (data) => {
    try {
      const { userID, roomID, roomType, roomOwnerID } = data;

      const user = await User.findOne({ _id: userID });

      if (!user) {
        const responseError = { message: "user not found" };
        return socket.emit("error", responseError);
      }

      if (roomType === "User") {
        const secondUser = await User.findById(roomOwnerID);

        const checkBlocked = await Blocked.findOne({
          blockerUser: secondUser._id,
          blockedUser: userID,
        });

        if (Boolean(checkBlocked)) {
          const responseError = { message: "Access Denied" };
          return socket.emit("error", responseError);
        }

        const User_1 = userID;
        const User_2 = secondUser._id;

        const key_1 = String(User_1) + String(User_2);
        const key_2 = String(User_2) + String(User_1);

        const checkRoom = await Room.findOne({
          key: { $in: [key_1, key_2] },
        });

        if (!checkRoom) {
          // so user never interact with second user so lets crerate a userRoom

          let createdRoom = null;

          createdRoom = await UserRoom.create({
            type: "Private",
            key: key_1,
            admins: [User_1, User_2],
            lastMessage: "",
          });

          socket.join(String(createdRoom.key));

          let replyData = {
            roomAllMessages: [],
          };

          socket.emit("initialReply", replyData);
        } else {
          socket.join(String(checkRoom.key));

          const allMessages = await UserMessage.find({
            room: checkRoom._id,
          });

          const replyData = {
            roomAllMessages: allMessages,
          };

          socket.emit("initialReply", replyData);
        }
      }

      if (roomType === "Group") {
        const group = await Group.findById(roomOwnerID).populate({
          path: "members",
          model: modelTypes.user,
        });

        console.log("\n\npath roomEnter to group ===>>>> ", data);
        console.log("\n\npath roomEnter to group ===>>>>--------- ", group);

        const checkingBanned = group?.blocked.includes(userID) || false;

        if (checkingBanned) {
          const responseError = {
            type: "banned",
            message: "You are banned from this group",
          };
          return socket.emit("error", responseError);
        }

        let checkUserConnectedGroup = false;

        for (let i = 0, lim = group?.members.length || 0; i < lim; i++) {
          if (String(group.members[i]._id) == String(userID)) {
            checkUserConnectedGroup = true;
            break;
          }
        }

        if (!checkUserConnectedGroup) {
          return;
        } else {
          const room = await Room.findOne({ createdByGroup: group._id });

          const allMessages = await Message.find({
            room: room._id,
          })
            .populate([
              {
                path: "sender",
                model: modelTypes.user,
                select: "image name",
                populate: {
                  path: "image",
                  model: modelTypes.image,
                  select: "url",
                },
              },
            ])
            .select("sender message createdAt, updatedAt");

          let formateAllMessage = allMessages.map((msg) => {
            return new ReplyMessage(
              room.key, //roomID  //roomID = group._id
              msg.sender._id, //senderID
              msg.sender.name, //senderName
              msg.sender.image.url, //senderImage
              msg.message, //message
              msg.createdAt
            );
          });

          const replyData = {
            roomAllMessages: formateAllMessage,
          };

          socket.emit("initialReply", replyData);

          socket.join(String(room.key));
        }
      }
    } catch (error) {
      const responseError = { message: error.message };
      socket.emit("error", responseError);
    }
  });
};

export default handleSocket;
