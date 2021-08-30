const express = require("express")
const router = express.Router()
const {validate} = require('../validator')
const {validationResult} = require('express-validator')
const bcrypt = require('bcrypt')


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


router.post("/", validate.validateRegisterUser(), async (req, res) => {
    const {password, email} = req.body;   
    console.log(req.body)
    const errors = validationResult(req);

    if(errors.isEmpty()) {
        
    
        // Check exist
        let hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);
        res.json("USER ROUTE");
    }
    else{
        res.status(422).json({error:errors.array()});
    }
})

module.exports = router