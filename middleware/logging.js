const log4js = require("log4js");
log4js.configure({
    appenders: {
        app: { type: "file", filename: "log/app.log" },
        out: { type: "stdout" }

    },
    categories: { default: { appenders: ["app", "out"], level: "info" } }
});


module.exports = { log4js };