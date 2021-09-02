const router = require('express').Router();
const { validate } = require('../middleware/validator');
const { validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const checkAuth = require('../middleware/checkAuth');
const { v4 } = require('uuid');
const { log4js } = require('../middleware/logging');
const { handleUndefined, errorResponse } = require('../utils/utils');

const FIRST_INSERT_ID_SYNTAX = "SV_";
const ROUTER_NAME = "Sinh viên";
const { sinhvien, lop } = new PrismaClient();
const logger = log4js.getLogger(ROUTER_NAME);


router.get('/', async(req, res) => {
    logger.info('Có ' + req.method + ' request đến ' + req.protocol + '://' + req.get('host') + req.originalUrl);
    let { id, ten, gioi_tinh } = handleUndefined(req.query, ['id', 'ten', 'gioi_tinh']);
    const result = await sinhvien.findMany({
        where: { id: { contains: id }, ten: { contains: ten }, gioi_tinh: { contains: gioi_tinh } },
        include: {
            lop: true
        },
    });
    return res.json(result);
});

router.get("/:id", async(req, res) => {
    logger.info('Có ' + req.method + ' request đến ' + req.protocol + '://' + req.get('host') + req.originalUrl);
    const id = req.params.id;
    const result = await sinhvien.findUnique({
        where: { id: id },
        include: {
            lop: true
        },
    })
    if (result) return res.json(result);
    else return res.status(400).json(
        errorResponse([
            [id, `${ROUTER_NAME} không tồn tại trên hệ thống`, "id", "body"]
        ])
    )
});


router.post('/', validate.validateBodySinhVien(), async(req, res) => {
    logger.info('Có ' + req.method + ' request đến ' + req.protocol + '://' + req.get('host') + req.originalUrl);

    const errors = validationResult(req);
    if (errors.isEmpty()) {
        let { ten, gioi_tinh, email, fk_lop } = req.body;
        const id = FIRST_INSERT_ID_SYNTAX + v4();
        const object = await sinhvien.findMany({
            where: {
                OR: [{ id }, { email }],
            }
        });
        if (object.length > 0) {
            return res.status(400).json(errorResponse([
                [email, "Email đã tồn tại trên hệ thống", "email", "body"]
            ]))
        } else {
            const lopExist = await lop.findUnique({
                where: { id: fk_lop }
            });
            if (!lopExist)
                return res.status(400).json(errorResponse([
                    [fk_lop, "Lớp không tồn tại trên hệ thống", "fk_lop", "body"]
                ]))
            const newObject = await sinhvien.create({
                data: {
                    id,
                    ten,
                    gioi_tinh,
                    email,
                    fk_lop
                }
            });
            return res.json(newObject)
        }
    } else {
        return res.status(422).json({ error: errors.array() });
    }
});

router.put("/:id", validate.validateBodySinhVien(), async(req, res) => {
    logger.info('Có ' + req.method + ' request đến ' + req.protocol + '://' + req.get('host') + req.originalUrl);
    const errors = validationResult(req);
    const id = req.params.id;
    if (id === undefined)
        return res.status(400).json(errorResponse([
            [id, "Id params không được để trống", "id", "body"]
        ]));
    if (errors.isEmpty()) {
        const { ten, gioi_tinh, fk_lop, email } = req.body;
        let object = await sinhvien.findUnique({
            where: { id: id }
        });
        if (object) {
            object = await sinhvien.findMany({
                where: { email, NOT: { id: object.id } }
            });
            if (object.length > 0)
                return res.status(400).json(errorResponse([
                    [email, "Email đã tồn tại trên hệ thống", "email", "body"]
                ]))
            const lopExist = await lop.findUnique({
                where: { id: fk_lop }
            });
            if (!lopExist)
                return res.status(400).json(errorResponse([
                    [fk_lop, "Lớp không tồn tại trên hệ thống", "fk_lop", "body"]
                ]))
            const updateObject = await sinhvien.update({
                where: { id: id },
                data: { ten, gioi_tinh, fk_lop, email }
            })
            return res.json(updateObject);
        } else {
            return res.status(400).json(
                res.status(400).json(errorResponse([
                    [id, ROUTER_NAME + " không tồn tại trên hệ thống", "id", "body"]
                ])))
        }
    } else {
        return res.status(422).json({ error: errors.array() });
    }
})


router.delete("/:id", async(req, res) => {
    logger.info('Có ' + req.method + ' request đến ' + req.protocol + '://' + req.get('host') + req.originalUrl);
    const id = req.params.id;
    if (id === undefined)
        return res.status(400).json(errorResponse([
            [id, "Id params không được để trống", "id", "body"]
        ]));
    const object = await sinhvien.findUnique({
        where: { id: id }
    });
    if (object) {
        const deleteObject = await sinhvien.delete({
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