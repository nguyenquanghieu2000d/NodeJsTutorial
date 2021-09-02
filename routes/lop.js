const router = require('express').Router();
const { validate } = require('../middleware/validator');
const { validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { checkAuth } = require('../middleware/checkAuth');
const { v4 } = require('uuid');
const { log4js } = require('../middleware/logging');
const { handleUndefined, errorResponse } = require('../utils/utils');

const FIRST_INSERT_ID_SYNTAX = "L_";
const ROUTER_NAME = "Lớp";
const { lop, giang_vien } = new PrismaClient();
const logger = log4js.getLogger(ROUTER_NAME);


router.get('/', checkAuth, async(req, res) => {
    logger.info('Có ' + req.method + ' request đến ' + req.protocol + '://' + req.get('host') + req.originalUrl);
    let { id, ten, nam_hoc, ki } = handleUndefined(req.query, ['id', 'ten', 'nam_hoc', 'ki']);
    let condition = { id: { contains: id }, ten: { contains: ten } };

    if (nam_hoc !== '') {
        condition.nam_hoc = nam_hoc
    }
    if (ki !== '') {
        condition.ki = ki
    }

    const result = await lop.findMany({
        where: condition
    });
    return res.json(result);
});

router.get("/:id", checkAuth, async(req, res) => {
    logger.info('Có ' + req.method + ' request đến ' + req.protocol + '://' + req.get('host') + req.originalUrl);
    const id = req.params.id;
    const result = await lop.findUnique({
        where: { id: id }
    })
    if (result) return res.json(result);
    else return res.status(400).json(
        errorResponse([
            [id, `${ROUTER_NAME} không tồn tại trên hệ thống`, "id", "body"]
        ])
    )
});


router.post('/', checkAuth, validate.validateBodyLop(), async(req, res) => {
    logger.info('Có ' + req.method + ' request đến ' + req.protocol + '://' + req.get('host') + req.originalUrl);
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        let { ten, nam_hoc, ki, fk_giang_vien } = req.body;
        const id = FIRST_INSERT_ID_SYNTAX + v4();
        const object = await lop.findMany({
            where: {
                OR: [{ ten }],
            }
        });

        const giangVien = await giang_vien.findUnique({
            where: { id: fk_giang_vien }
        })
        if (!giangVien)
            return res.status(400).json(errorResponse([
                [fk_giang_vien, "Giảng viên không tồn tại!", "fk_giang_vien", "body"]
            ]));
        if (object.length > 0) {
            return res.status(400).json(errorResponse([
                [id, ROUTER_NAME + " đã tồn tại trên hệ thống", "id", "body"]
            ]));
        } else {
            const newObject = await lop.create({
                data: {
                    id,
                    ten,
                    nam_hoc,
                    ki,
                    fk_giang_vien
                }
            });
            return res.json(newObject)
        }
    } else {
        return res.status(422).json({ error: errors.array() });
    }
});

router.put("/:id", checkAuth, validate.validateBodyLop(), async(req, res) => {
    logger.info('Có ' + req.method + ' request đến ' + req.protocol + '://' + req.get('host') + req.originalUrl);
    const errors = validationResult(req);
    const id = req.params.id;
    if (id === undefined)
        return res.status(400).json(errorResponse([
            [id, "Id params không được để trống", "id", "body"]
        ]))
    if (errors.isEmpty()) {
        const { ten, nam_hoc, ki } = req.body;
        const object = await lop.findUnique({
            where: { id }
        });
        if (object) {
            const updateObject = await lop.update({
                where: { id: id },
                data: { ten, nam_hoc, ki }
            })
            return res.json(updateObject);
        } else {
            return res.status(400).json(errorResponse([
                [id, ROUTER_NAME + " không tồn tại trên hệ thống", "id", "body"]
            ]));
        }
    } else {
        return res.status(422).json({ error: errors.array() });
    }
})


router.delete("/:id", checkAuth, async(req, res) => {
    logger.info('Có ' + req.method + ' request đến ' + req.protocol + '://' + req.get('host') + req.originalUrl);
    const id = req.params.id;
    if (id === undefined)
        return res.status(400).json(errorResponse([
            [id, "Id params không được để trống", "id", "body"]
        ]));
    const object = await lop.findUnique({
        where: { id: id }
    });
    if (object) {
        const deleteObject = await lop.delete({
            where: { id: id },
        })
        return res.json(deleteObject);
    } else {
        return res.status(400).json(errorResponse([
            [id, ROUTER_NAME + " không tồn tại trên hệ thống", "id", "body"]
        ]));
    }
})


module.exports = router;