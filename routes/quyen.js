const router = require('express').Router();
const { validate } = require('../middleware/validator');
const { validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const checkAuth = require('../middleware/checkAuth');

const { v4 } = require('uuid');


const FIRST_INSERT_ID_SYNTAX = "Q_";
const { quyen } = new PrismaClient();

router.post('/', validate.validateQuyen(), async(req, res) => {
    // logger.info("Cheese is Comté.");
    const { ten } = req.body;
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        const id = FIRST_INSERT_ID_SYNTAX + v4();
        const object = await quyen.findMany({
            where: {
                OR: [{ id: id }, { ten: ten }],
            },
            select: {
                id: true,
                ten: true,
            }
        });
        if (object.length > 0) {
            return res.status(400).json({
                msg: "Quyền đã tồn tại trên hệ thống"
            })
        } else {
            const newObject = await quyen.create({
                data: {
                    id,
                    ten
                }
            });
            return res.json(newObject)
        }
    } else {
        return res.status(422).json({ error: errors.array() });
    }
})

module.exports = router;