const express = require("express")
const app = express()
const cors = require("cors")
const dotenv = require("dotenv")
dotenv.config();
const { response } = require("express");

// const authRouter = require("./routes/auth")

// Sử dụng websocket
// const http = require("http").createServer(app)
// const io = require("socket.io")(http,{
//     cors: {
//         origin: '*',
//     }
// })

app.use(cors());
app.use(express.json());
app.use("/api/user", require("./routes/user"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/quyen", require("./routes/quyen"));
app.use("/api/phong", require("./routes/phong"));
app.use("/api/admin", require("./routes/admin"));
app.use(express.urlencoded({ extended: false }));



// app.use('/api/auth', authRouter)







// io.on('connection', socket => {
//     socket.on("message", ({name, message}) => {
//         console.log(name)
//         console.log(message)
//         io.emit("message", {name, message})
//     })
// })

// http.listen(4000,  () => {
//     console.log("listening on port 4000")
// })

app.listen(process.env.PORT, () => console.log(`App running on ${process.env.PORT}`))