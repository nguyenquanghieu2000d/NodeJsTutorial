const express = require("express")
const router = express.Router()
const { validate } = require('../middleware/validator')
const { validationResult } = require('express-validator')
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')


const hashedPassword = "$2b$10$z8BnP7o1Nn9PQIvIzDHoBeUKXnPOLfRHECsl4s8bpvMgIp4Vanoi."


router.post("/login", async(req, res) => {
    const { email, password } = req.body;

    // Check user

    if (true) {
        let isMatch = await bcrypt.compare(password, hashedPassword)
        if (!isMatch) {
            return res.status(400).json({
                "errors": [{
                    "msg": "Invalid password"
                }]
            });
        } else {
            const token = await JWT.sign({
                email
            }, "skdfmklsdmnfklsmdfksnmdfk", {
                expiresIn: 3600000
            });
            return res.json({ token });
        }
    } else {
        return res.status(400).json({
            "errors": [{
                "msg": "Invalid user"
            }]
        });
    }

})



router.post("/register", validate.validateRegisterUser(), async(req, res) => {
    const { password, email } = req.body;
    console.log(req.body)
    const errors = validationResult(req);

    if (errors.isEmpty()) {


        // Check exist

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);
        const token = await JWT.sign({
            email
        }, "skdfmklsdmnfklsmdfksnmdfk", {
            expiresIn: 3600000
        });
        res.json({ token });
    } else {
        res.status(422).json({ error: errors.array() });
    }
})

module.exports = router