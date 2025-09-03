import code from "./statuscode.js";

class Response {
  constructor(statusCode, message = code[statusCode]) {
    this.statusCode = statusCode;
    this.success = statusCode >= 200 && statusCode <= 299;
    this.message = message;
  }
}

export default Response;
