const router = require('express').Router();
const { validate } = require('../middleware/validator');
const { validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const {checkAuth} = require('../middleware/checkAuth');
const { v4 } = require('uuid');
const { log4js } = require('../middleware/logging');
const handleUndefined = require('../utils/utils');

const FIRST_INSERT_ID_SYNTAX = "Q_";
const ROUTER_NAME = "Quyền";
const { quyen } = new PrismaClient();
const logger = log4js.getLogger("quyen");


router.get('/', checkAuth, async(req, res) => {
    logger.info('Có ' + req.method + ' request đến ' + req.protocol + '://' + req.get('host') + req.originalUrl);
    let { id, ten } = handleUndefined(req.query, ["id", "ten"]);
    result = await quyen.findMany({
        where: { id: { contains: id }, ten: { contains: ten } }
    })
    return res.json(result);
});

router.get("/:id", checkAuth, async(req, res) => {
    logger.info('Có ' + req.method + ' request đến ' + req.protocol + '://' + req.get('host') + req.originalUrl);
    const id = req.params.id;
    const result = await quyen.findUnique({
        where: { id: id }
    })
    return res.json(result);
});


router.post('/', checkAuth, validate.validateBodyQuyen(), async(req, res) => {
    logger.info('Có ' + req.method + ' request đến ' + req.protocol + '://' + req.get('host') + req.originalUrl);
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        const { ten } = req.body;
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
                msg: ROUTER_NAME + " đã tồn tại trên hệ thống"
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
});

router.put("/:id", checkAuth, validate.validateBodyQuyen(), async(req, res) => {
    logger.info('Có ' + req.method + ' request đến ' + req.protocol + '://' + req.get('host') + req.originalUrl);
    const errors = validationResult(req);
    const id = req.params.id;
    if (id === undefined) return res.status(400).json({
        msg: "Id params không được để trống"
    })

    if (errors.isEmpty()) {

        const { ten } = req.body;
        const object = await quyen.findUnique({
            where: { id: id }
        });
        if (object) {
            const updateObject = await quyen.update({
                where: { id: id },
                data: { ten: ten }
            })
            return res.json(updateObject);
        } else {
            return res.status(400).json({
                msg: ROUTER_NAME + "không tồn tại trên hệ thống"
            })
        }
    } else {
        return res.status(422).json({ error: errors.array() });
    }
})


router.delete("/:id", checkAuth, async(req, res) => {
    logger.info('Có ' + req.method + ' request đến ' + req.protocol + '://' + req.get('host') + req.originalUrl);
    const id = req.params.id;
    if (id === undefined) return res.status(400).json({
        msg: "Id params không được để trống"
    })

    const object = await quyen.findUnique({
        where: { id: id }
    });
    if (object) {
        const deleteObject = await quyen.delete({
            where: { id: id },
        })
        return res.json(deleteObject);
    } else {
        return res.status(400).json({
            msg: ROUTER_NAME + " không tồn tại trên hệ thống"
        })
    }

})



module.exports = router;