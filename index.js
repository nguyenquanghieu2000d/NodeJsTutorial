const express = require("express")
const app = express()
const cors = require("cors")
const dotenv = require("dotenv")
dotenv.config();
const dbService = require("./dbService");
const {response} = require("express");

// const authRouter = require("./routes/auth")

// Sử dụng websocket
const http = require("http").createServer(app)
const io = require("socket.io")(http,{
    cors: {
        origin: '*',
    }
})


app.use(cors());
app.use(express.json());
app.use("/api/user", require("./routes/user"));
app.use("/api/auth", require("./routes/auth"))
app.use(express.urlencoded({extended: false}));



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

// // created
// app.post("/insert", (req, res) => {
//     const {username, password, hoten} = req.body;

//     const db = dbService.getDbServiceInstance();
//     const result = db.insertNewData(username, password, hoten);
//     result
//         .then(data => res.json({success: true}))
//         .catch((err) => console.log(err))
// })


// // read
// app.get("/getAll", (req, res) => {
//     const db = dbService.getDbServiceInstance();
//     const result = db.getAllData();

//     result
//         .then(data => res.json({data: data}))
//         .catch((err) => console.log(err))
// })

// app.get("/okok", (req, res) => {
//     res.json({success: true})

// })  

// // update

// // delete
app.listen(process.env.PORT, () => console.log(`App running on ${process.env.PORT}`))