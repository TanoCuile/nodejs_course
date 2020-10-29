const http = require("http");

exports.callServer = function ({ host, port }) {
  let response = "";
  http
    .request({
      host,
      port,
      path: "/some/path",
      method: "GET",
    })
    .on("response", (resp) => {
      resp
        .on("data", (data) => {
          response += data;
        })
        .on("end", () => {
          console.log("Response finished", response.toString());
        });
    })
    .end(() => {
      console.log("Sending request finished");
    });
};
