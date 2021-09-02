const express = require("express")
const router = express.Router()
const { validate } = require('../middleware/validator')
const { validationResult } = require('express-validator')
const { v4 } = require('uuid');
const { log4js } = require('../middleware/logging');
const handleUndefined = require('../utils/utils');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')
const { secretKey } = require('../middleware/checkAuth');
const AdminApi = require("../api/AdminApi");

const FIRST_INSERT_ID_SYNTAX = "U_";
const ROUTER_NAME = "auth";
const { user } = new PrismaClient();
const logger = log4js.getLogger("auth");
const fk_quyen = "Q_b21968f2-4b1f-4b2c-af39-3633bbeea03b";


router.post("/login", validate.validateLogin(), async(req, res) => {
    const { username, password } = req.body;
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        const existObject = await user.findUnique({
            where: { username: username }
        });
        if (!existObject) {
            return res.status(400).json({
                "errors": [{
                    "value": username,
                    "msg": "user không tồn tại trên hệ thống",
                    "param": "username",
                    "location": "body",
                }]
            })
        }
        let isMatch = await bcrypt.compare(password, existObject.password)
        if (!isMatch) {
            return res.status(400).json({
                "errors": [{
                    "msg": "Invalid. Sai password"
                }]
            });
        } else {
            const token = await JWT.sign({
                username
            }, secretKey, {
                expiresIn: 36000
            });
            return res.json({ token });
        }
    } else {
        res.status(422).json({ error: errors.array() });
    }
})


router.post("/register", validate.validateRegisterUser(), async(req, res) => {
    logger.info('Có ' + req.method + ' request đến ' + req.protocol + '://' + req.get('host') + req.originalUrl);
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        let { username, password } = req.body;
        // Check exist
        const existObject = await user.findUnique({
            where: { username: username }
        });
        if (existObject) {
            return res.status(400).json(errorResponse([
                [username, ROUTER_NAME + " đã tồn tại trên hệ thống", "username", "body"]
            ]));
        } else {
            try {
                const data = { ten: 'Unknown', gioi_tinh: 'Khac' }
                let response = await AdminApi.post(data)
                const id = FIRST_INSERT_ID_SYNTAX + v4();
                password = await bcrypt.hash(password, 10);
                const fk_profile = response.id;
                const newUser = await user.create({
                    data: {
                        id,
                        username,
                        password,
                        fk_quyen,
                        fk_profile
                    }
                })
                const token = await JWT.sign({
                    username,
                }, secretKey, {
                    expiresIn: 36000
                });
                res.json({ token });
            } catch (err) {
                console.log(err)
                res.status(500).json({
                    msg: "Có lỗi xảy ra với server"
                })
            }
        }
    } else {
        res.status(422).json({ error: errors.array() });
    }
})

module.exports = router