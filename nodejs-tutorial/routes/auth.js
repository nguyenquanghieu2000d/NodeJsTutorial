const express = require("express")
const dbService = require("./dbService");
const router = express.Router()


// @route POST api/auth/register
// @desc Register user
// @access Public
router.post("/register", async (req, res) => {
    const {username, password, hoten} = req.body;
    const db = dbService.getDbServiceInstance();
    const result = db.insertNewData(username, password, hoten);
    result
        .then(data=> res.json({success:true}))
        .catch((err) => console.log(err))
})


router.get("/", (req, res) => res.send("USER ROUTE"))

module.exports = router