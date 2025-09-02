export function normalizeDate(date) {
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  };
  return new Date(date).toLocaleString("en-US", options);
}

export function formateMessage(message){
  let msg = message.trim();
  if (msg.length > 200) {
    alert("you can not write message more than 200 words");
  }
  if (msg.length > 25) {
    let str = "";
    let lengthCount = 0;
    for (let c of msg) {
      ++lengthCount;
      str += c;
      if (lengthCount === 25) {
        str += "\n";
        lengthCount = 0;
      }
    }
    msg = str;
  }
  return msg;
}