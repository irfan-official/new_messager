import code from "./statuscode.js";

class Response {
  // (statusCode, ?message, ?responseData)
  constructor(...params) {
    const statusCode = params[0];
    let message = params[1] || "";
    let responseData;

    if (typeof params[1] !== "string" || message === "") {
      responseData = params[1];
      message = code[statusCode];
    } else {
      responseData = params[2];
    }

    this.statusCode = statusCode;
    this.success = statusCode >= 200 && statusCode <= 299;
    this.message = message;

    if (responseData !== undefined) {
      this.responseData = responseData;
    }
  }
}

export default Response;
