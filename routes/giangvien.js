const router = require('express').Router();
const { validate } = require('../middleware/validator');
const { validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const checkAuth = require('../middleware/checkAuth');
const { v4 } = require('uuid');
const { log4js } = require('../middleware/logging');
const { handleUndefined, errorResponse } = require('../utils/utils');

const FIRST_INSERT_ID_SYNTAX = "GV_";
const ROUTER_NAME = "Giang_vien";
const { giang_vien } = new PrismaClient();
const logger = log4js.getLogger(ROUTER_NAME);


router.get('/', async(req, res) => {
    logger.info('Có ' + req.method + ' request đến ' + req.protocol + '://' + req.get('host') + req.originalUrl);
    let { id, ten, gioi_tinh } = handleUndefined(req.query, ['id', 'ten', 'gioi_tinh']);
    const result = await giang_vien.findMany({
        where: { id: { contains: id }, ten: { contains: ten }, gioi_tinh: { contains: gioi_tinh } }
    });
    return res.json(result);
});

router.get("/:id", async(req, res) => {
    logger.info('Có ' + req.method + ' request đến ' + req.protocol + '://' + req.get('host') + req.originalUrl);
    const id = req.params.id;
    const result = await giang_vien.findUnique({
        where: { id: id }
    })
    if (result) return res.json(result);
    else return res.status(400).json(
        errorResponse([
            [id, `${ROUTER_NAME} không tồn tại trên hệ thống`, "id", "body"]
        ])
    )
});


router.post('/', validate.validateBodyGiangVien(), async(req, res) => {
    logger.info('Có ' + req.method + ' request đến ' + req.protocol + '://' + req.get('host') + req.originalUrl);
    let { ten, gioi_tinh } = req.body;
    logger.info(ten, gioi_tinh);
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        const { ten, gioi_tinh } = req.body;
        const id = FIRST_INSERT_ID_SYNTAX + v4();
        const object = await giang_vien.findMany({
            where: {
                OR: [{ id: id }],
            }
        });
        if (object.length > 0) {
            return res.status(400).json(errorResponse([
                [id, ROUTER_NAME + " đã tồn tại trên hệ thống", "id", "body"]
            ]));
        } else {
            const newObject = await giang_vien.create({
                data: {
                    id,
                    ten,
                    gioi_tinh
                }
            });
            logger.info("Tạo thành công")
            return res.json(newObject)
        }
    } else {
        logger.info(ROUTER_NAME + " Lỗi")
        return res.status(422).json({ error: errors.array() });
    }
});

router.put("/:id", validate.validateBodyGiangVien(), async(req, res) => {
    logger.info('Có ' + req.method + ' request đến ' + req.protocol + '://' + req.get('host') + req.originalUrl);
    const errors = validationResult(req);
    const id = req.params.id;
    if (id === undefined)
        return res.status(400).json(errorResponse([
            [id, "Id params không được để trống", "id", "body"]
        ]));
    if (errors.isEmpty()) {
        const { ten, gioi_tinh } = req.body;
        const object = await giang_vien.findUnique({
            where: { id: id }
        });
        if (object) {
            const updateObject = await giang_vien.update({
                where: { id: id },
                data: { ten, gioi_tinh }
            })
            logger.info("Sửa thành công")
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


router.delete("/:id", async(req, res) => {
    logger.info('Có ' + req.method + ' request đến ' + req.protocol + '://' + req.get('host') + req.originalUrl);
    const id = req.params.id;
    if (id === undefined)
        return res.status(400).json(errorResponse([
            [id, "Id params không được để trống", "id", "body"]
        ]));
    const object = await giang_vien.findUnique({
        where: { id: id }
    });
    if (object) {
        const deleteObject = await giang_vien.delete({
            where: { id: id },
        })
        logger.info("Xoá thành công")
        return res.json(deleteObject);
    } else {
        logger.info(ROUTER_NAME + " Lỗi");
        return res.status(422).json(errorResponse([
            [id, ROUTER_NAME + " không tồn tại trên hệ thống", "id", "body"]
        ]));
    }
})


module.exports = router;