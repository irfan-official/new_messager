export function editMessage(message) {
  let str = "";
  if (message.length > 23) {
    let count = 0;
    for (let c of message) {
      str += c;
      if (count === 25) {
        str += "...";
        return str;
      }
      count++;
    }
  }
  return message;
}

export function findClickStatus(prevData, roomID) {
  return String(prevData.roomID) === String(roomID)
    ? !prevData.clickStatus
    : true;
}

export function findRoomName(prevData, roomName) {
  // unused function
  return prevData.roomName === roomName ? prevData.roomName : roomName;
}

export function formatTime(dateValue) {
  try {
    if (!Boolean(dateValue)) {
      return "";
    }
    const TimeOptions = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return new Date(dateValue).toLocaleString("en-US", TimeOptions);
  } catch {
    return "";
  }
}
export function isNewerMessage(
  click,
  roomKey,
  roomLastSeenMap,
  displayCurrentMessageTime,
  userID,
  latestMessageSenderID
) {
  try {
    if (String(userID) === String(latestMessageSenderID)) {
      return false;
    }
    if (click.roomKey != roomKey) {
      const lastSeenTime = roomLastSeenMap[roomKey] || 0;
      const messageTime = new Date(displayCurrentMessageTime).getTime();
      return Boolean(lastSeenTime < messageTime);
    }
    return false;
  } catch {
    return false;
  }
}
