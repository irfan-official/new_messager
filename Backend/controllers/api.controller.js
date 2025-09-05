import { assignJWT } from "../services/auth.services.js";
import bcrypt from "bcrypt";
import { image as Image } from "../models/media.model.js";
import User from "../models/user.model.js";
import Group from "../models/group.model.js";
import Room from "../models/room.model.js"; // check it
import Card from "../models/card.model.js";
import Channel from "../models/channel.model.js";
import Views from "../models/views.model.js";
import Activity from "../models/activity.model.js";
import Blocked from "../models/blocked.model.js";
import { nanoid } from "nanoid";
import { modelTypes, roomTypes, groupTypes } from "../utils/types.js";
import Response from "../utils/response.js";

export const handleLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found 1",
      });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Invalid password 2",
      });
    }

    assignJWT(res, user._id);

    return res.status(200).json({
      success: true,
      data: {
        userID: user._id,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error 3",
    });
  }
};

export const handleRegister = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, image: imageURL } = req.body;

    console.log("request arrive ==> ", req.body);

    if (!firstName || !lastName || !email || !password || !imageURL) {
      return res.status(400).json({
        success: false,
        error: "All fields are reequired",
      });
    }

    let salt = await bcrypt.genSalt();
    let hashPassword = await bcrypt.hash(password, salt);

    const image = await Image.create({
      extentionType: "jpg",
      type: "User",
      url: imageURL,
    });

    const user = await User.create({
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      email,
      password: hashPassword,
      image: image._id,
    });

    image.user = user._id;
    await image.save();

    const card = await Card.create({
      type: cardTypes.user,
      createdByUser: user._id,
    });

    const channel = await Channel.create({
      key: String(user._id),
      type: cardTypes.user,
      users: [user._id],
    });

    user.channels = [channel._id];
    user.defaultCard = card._id;
    await user.save();

    assignJWT(res, user._id);

    return res.status(200).json({
      success: true,
      data: {
        userID: user._id,
      },
    });
  } catch (err) {
    console.error("register error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const handleCreateGroup = async (req, res, next) => {
  try {
    const {
      userID,
      name,
      groupTypes,
      password = "",
      image: imageURL,
    } = req.body;

    // Validate fields
    if (!userID || !name || !groupTypes || !imageURL) {
      return res
        .status(400)
        .json({ success: false, error: "Please fill all required fields" });
    }

    // if (
    //   groupTypes !== "Public" &&
    //   groupTypes !== "Private" &&
    //   groupTypes !== "ProtectedPrivate" &&
    //   groupTypes !== "ProtectedPublic"
    // ) {
    //   return res.status(400).json({
    //     success: false,
    //     error: "Room type must be 'group' or 'private'",
    //   });
    // }

    const user = await User.findById(userID);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const image = await Image.create({
      extentionType: "jpg",
      type: "Group",
      url:
        imageURL ||
        "https://images.unsplash.com/photo-1470753323753-3f8091bb0232?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGdyb3VwfGVufDB8fDB8fHww",
    });

    const group = await Group.create({
      name,
      image: image._id,
      creator: user._id,
      active: true,
      type: groupTypes.public,
      members: [user._id],
      admins: [user._id],
    });

    image.group = group._id;
    await image.save();

    const card = await Card.create({
      type: cardTypes.group,
      createdByGroup: group._id,
    });

    const channel = await Card.create({
      key: String(group._id),
      type: cardTypes.group,
      group: group._id,
    });

    const checkView = await Views.find({ user: user._id });

    //create a view
    const createdView = await Views.create({
      user: user._id,
      index: (checkView?.length || 0) + 1,
      card: card._id,
      channel: channel._id,
    });

    user.views = [...user.views, createdView._id];
    user.channels = [...user.channels, channel._id];
    await user.save();

    res.status(200).json({
      success: true,
      message: "Group create successfully",
    });
  } catch (error) {
    console.error("Join room error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const handleJoinGroup = async (req, res, next) => {
  try {
    const { userID, groupID, groupTypes, password = "" } = req.body;

    // Validate fields
    if (!userID || !groupID || !groupTypes) {
      return res
        .status(400)
        .json({ success: false, error: "Please fill all required fields" });
    }

    // if (
    //   groupTypes !== "Public" &&
    //   groupTypes !== "Private" &&
    //   groupTypes !== "ProtectedPrivate" &&
    //   groupTypes !== "ProtectedPublic"
    // ) {
    //   return res.status(400).json({
    //     success: false,
    //     error: "Room type must be 'group' or 'private'",
    //   });
    // }

    const user = await User.findById(userID).populate({
      path: "views.room",
      model: modelTypes.room,
    });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const group = await Group.findOne({
      _id: groupID,
    }).populate({
      path: "members",
      model: modelTypes.user,
      select: "-password",
    });

    let room = "";

    if (group) {
      room = await Room.findOne({
        createdByGroup: group._id,
      });
    }

    let userAlreadyExist = false;
    let groupAlreadyExistInViews = false;

    for (let i = 0, lim = group.members.length; i < lim; i++) {
      if (String(group.members[i]._id) == String(userID)) {
        userAlreadyExist = true;
        break;
      }
    }

    for (let i = 0, lim = user.views.length; i < lim; i++) {
      if (String(user.views[i].room._id) == String(group._id)) {
        groupAlreadyExistInViews = true;
        break;
      }
    }

    console.log(`${userAlreadyExist}   ${groupAlreadyExistInViews}`);

    if (!userAlreadyExist) {
      console.log("\n check block 1 okey");
      group.members.push(user._id);
      await group.save();
    }

    if (!groupAlreadyExistInViews) {
      console.log("check block 2 okey");
      user.views.push({ room: room._id }); //here error occur
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: "Room joined successfully",
    });
  } catch (error) {
    console.error("Join room error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const searchRoomCards = async (req, res, next) => {
  const { userID, searchValue = "" } = req.body;

  if (typeof searchValue !== "string") {
    return res
      .status(405)
      .json(new Response(405, "searchValue can only be string type"));
  }

  searchValue = searchValue.trim();

  const cards = await Room.find({
    name: searchValue,
  });

  return res.status(200).json(new Response(200, cards));
};

export const clickedRoomCard = async (req, res, next) => {
  try {
    const { userID, clickedRoomID, previousRoomID = "" } = req.body;

    const clickedRoom = await Views.findOne({
      user: userID,
      room: clickedRoomID,
    });

    clickedRoom.lastCheckInTime = Date.now();
    clickedRoom.focus = true;
    await clickedRoom.save();

    if (previousRoomID !== "") {
      const previousRoom = await Views.findOne({
        user: userID,
        room: previousRoomID,
      });

      previousRoom.lastCheckOutTime = Date.now();
      previousRoom.focus = false;
      await previousRoom.save();
    }

    return res.status(200).json(new Response(200));
  } catch (error) {
    next(error);
  }
};
