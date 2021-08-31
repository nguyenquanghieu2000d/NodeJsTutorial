const log4js = require("log4js");
log4js.configure({
    appenders: { quyen: { type: "file", filename: "log/quyen.log" } },
    categories: { default: { appenders: ["quyen"], level: "info" } }
  });
var logger = log4js.getLogger();

module.exports = logger