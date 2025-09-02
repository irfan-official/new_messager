export function Roomfinder(userHistory, click) {
  return (
    userHistory.rooms?.find((objData) => click.roomName === objData.roomName) ||
    {}
  );
}

export function TimeFinder(data) {
  if (data.type === "User") {
    return data.userRoomID.lastMessageID?.createdAt || "";
  } else if (data.viewType === "Group") {
    return data.linked.lastMessageID?.createdAt || "";
  }
}

export function RoomInfoFinder(data) {
  if (data.viewType === "User") {
    let returnData = {
      viewID: data._id,
      roomType: data.viewType,
      roomID: data.userRoomID._id,
      roomKey: data.userRoomID.name,
      roomOwnerID: data.linked._id,
    };
    console.log("data ==> ", returnData);
    return returnData;
  } else if (data.viewType === "Group") {
    let returnData = {
      viewID: data._id,
      roomType: data.viewType,
      roomID: data.linked._id,
      roomKey: data.linked._id,
      roomOwnerID: data.linked.adminID,
    };

    return returnData;
  }
}

export function UnseenMessageFinder(data) {
  if (data.viewType === "User") {
    return data.userRoomID.lastMessageID?.messsage || "";
  } else if (data.viewType === "Group") {
    return data.linked.lastMessageID?.message || "";
  }
}

export function unseenMessageSenderIDFinder(data) {
  if (data.viewType === "User") {
    return data.userRoomID.lastMessageID?.senderID || "";
  } else if (data.viewType === "Group") {
    return data.linked.lastMessageID?.senderID || "";
  }
}

export const startDragging = (
  e,
  isDragging,
  startX,
  startWidth,
  setSidebarWidth
) => {
  isDragging.current = true;
  startX.current = e.clientX;
  startWidth.current = parseInt(
    getComputedStyle(document.querySelector("#resizableSidebar")).width
  );

  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - startX.current;
    const newWidth = Math.min(Math.max(startWidth.current + deltaX, 300), 500);
    setSidebarWidth(newWidth);
  };

  const onMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
};
