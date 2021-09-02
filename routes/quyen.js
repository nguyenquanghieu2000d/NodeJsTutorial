const router = require('express').Router();
const { validate } = require('../middleware/validator');
const { validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { checkAuth } = require('../middleware/checkAuth');
const { v4 } = require('uuid');
const { log4js } = require('../middleware/logging');
const { handleUndefined, errorResponse } = require('../utils/utils');
const FIRST_INSERT_ID_SYNTAX = "Q_";
const ROUTER_NAME = "Quyền";
const { quyen } = new PrismaClient();
const logger = log4js.getLogger(ROUTER_NAME);


router.get('/', checkAuth, async(req, res) => {
    logger.info('Có ' + req.method + ' request đến ' + req.protocol + '://' + req.get('host') + req.originalUrl);
    let { id, ten } = handleUndefined(req.query, ["id", "ten"]);
    const result = await quyen.findMany({
        where: { id: { contains: id }, ten: { contains: ten } }
    });
    return res.json(result);
});

router.get("/:id", checkAuth, async(req, res) => {
    logger.info('Có ' + req.method + ' request đến ' + req.protocol + '://' + req.get('host') + req.originalUrl);
    const id = req.params.id;
    const result = await quyen.findUnique({
        where: { id: id }
    })
    if (result) return res.json(result);
    else return res.status(400).json(
        errorResponse([
            [id, `${ROUTER_NAME} không tồn tại trên hệ thống`, "id", "body"]
        ])
    )
});


router.post('/', validate.validateBodyQuyen(), async(req, res) => {
    logger.info('Có ' + req.method + ' request đến ' + req.protocol + '://' + req.get('host') + req.originalUrl);
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        const { ten } = req.body;
        const id = FIRST_INSERT_ID_SYNTAX + v4();
        const object = await quyen.findMany({
            where: {
                OR: [{ id: id }, { ten: ten }],
            },
        });
        if (object.length > 0) {
            return res.status(400).json(
                errorResponse([
                    [ten, `${ROUTER_NAME} đã tồn tại trên hệ thống`, "ten", "body"]
                ])
            )
        } else {
            const newObject = await quyen.create({
                data: { id, ten }
            });
            return res.json(newObject)
        }
    } else {
        return res.status(422).json({ errors: errors.array() });
    }
});

router.put("/:id", checkAuth, validate.validateBodyQuyen(), async(req, res) => {
    logger.info('Có ' + req.method + ' request đến ' + req.protocol + '://' + req.get('host') + req.originalUrl);
    const errors = validationResult(req);
    const id = req.params.id;
    if (id === undefined)
        return res.status(400).json(errorResponse([
            [id, `Id param không được để trống`, "id", "param"]
        ]))
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
            return res.status(400).json(errorResponse([
                [id, ROUTER_NAME + "không tồn tại trên hệ thống", "id", "param"]
            ]))
        }
    } else {
        return res.status(422).json({ error: errors.array() });
    }
})

/**
 * Toggle status
 *
 */
router.delete("/:id", checkAuth, async(req, res) => {
    logger.info('Có ' + req.method + ' request đến ' + req.protocol + '://' + req.get('host') + req.originalUrl);
    const id = req.params.id;
    if (id === undefined)
        return res.status(400).json(errorResponse([
            [id, "Id params không được để trống", "id", "body"]
        ]));
    const object = await quyen.findUnique({
        where: { id: id }
    });
    if (object) {
        const updateObject = await quyen.update({
            where: { id: id },
            data: { status: status ? 0 : 1 } // here
        })
        return res.json(updateObject);
    } else
        return res.status(400).json(errorResponse([
            [id, ROUTER_NAME + " không tồn tại trên hệ thống", "id", "body"]
        ]));
})



router.delete("/absolute/:id", checkAuth, async(req, res) => {
    logger.info('Có ' + req.method + ' request đến ' + req.protocol + '://' + req.get('host') + req.originalUrl);
    const id = req.params.id;
    if (id === undefined)
        return res.status(400).json(errorResponse([
            [id, "Id params không được để trống", "id", "body"]
        ]));
    const object = await quyen.findUnique({
        where: { id: id }
    });
    if (object) {
        const deleteObject = await quyen.delete({
            where: { id: id },
        })
        return res.json(deleteObject);
    } else
        return res.status(400).json(errorResponse([
            [id, ROUTER_NAME + " không tồn tại trên hệ thống", "id", "body"]
        ]));
})


module.exports = router;