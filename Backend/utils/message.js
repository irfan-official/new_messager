export class ReplyMessage {
  constructor(roomKey, senderID, senderName, senderImage, message, createdAt) {
    this.roomKey = roomKey;
    this.sender = {
      _id: senderID,
      name: senderName,
      image: senderImage,
    };
    this.message = message;
    this.createdAt = createdAt;
  }
}

export class LatestMessage {
  constructor(roomID, senderID, messageCreationTime, message) {
    this.roomID = roomID;
    this.message = message;
    this.time = messageCreationTime;
    this.senderID = senderID;
  }
}
