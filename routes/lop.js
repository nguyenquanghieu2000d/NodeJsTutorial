const router = require('express').Router();
const {validate} = require('../middleware/validator');
const {validationResult} = require('express-validator');
const {PrismaClient} = require('@prisma/client');
const {checkAuth} = require('../middleware/checkAuth');
const {v4} = require('uuid');
const {log4js} = require('../middleware/logging');
const handleUndefined = require('../utils/utils');

const FIRST_INSERT_ID_SYNTAX = "L_";
const ROUTER_NAME = "Lop";
const {lop} = new PrismaClient();
const logger = log4js.getLogger(ROUTER_NAME);


router.get('/', checkAuth, async (req, res) => {
    logger.info('Có ' + req.method + ' request đến ' + req.protocol + '://' + req.get('host') + req.originalUrl);
    let {id, ten, nam_hoc, ki} = handleUndefined(req.query, ['id', 'ten', 'nam_hoc', 'ki']);
    let condition = {id: {contains: id}, ten: {contains: ten}};

    if (nam_hoc !== '') {
        condition.nam_hoc = {contains: nam_hoc}
    }
    if (ki !== '') {
        condition.ki = {contains: ki}
    }

    const result = await lop.findMany({
        where: condition
    });
    return res.json(result);
});

router.get("/:id", checkAuth, async (req, res) => {
    logger.info('Có ' + req.method + ' request đến ' + req.protocol + '://' + req.get('host') + req.originalUrl);
    const id = req.params.id;
    const result = await lop.findUnique({
        where: {id: id}
    })
    return res.json(result);
});


router.post('/', checkAuth, validate.validateBodyLop(), async (req, res) => {
    logger.info('Có ' + req.method + ' request đến ' + req.protocol + '://' + req.get('host') + req.originalUrl);
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        let {ten, nam_hoc, ki} = req.body;
        const id = FIRST_INSERT_ID_SYNTAX + v4();
        const object = await lop.findMany({
            where: {
                OR: [{id}, {ten}],
            }
        });
        if (object.length > 0) {
            return res.status(400).json({
                msg: ROUTER_NAME + " đã tồn tại trên hệ thống"
            })
        } else {
            const newObject = await lop.create({
                data: {
                    id,
                    ten,
                    nam_hoc,
                    ki
                }
            });
            return res.json(newObject)
        }
    } else {
        return res.status(422).json({error: errors.array()});
    }
});

router.put("/:id", checkAuth, validate.validateBodyLop(), async (req, res) => {
    logger.info('Có ' + req.method + ' request đến ' + req.protocol + '://' + req.get('host') + req.originalUrl);
    const errors = validationResult(req);
    const id = req.params.id;
    if (id === undefined) return res.status(400).json({
        msg: "Id params không được để trống"
    })
    if (errors.isEmpty()) {
        const {ten, nam_hoc, ki} = req.body;
        const object = await lop.findUnique({
            where: {id}
        });
        if (object) {
            const updateObject = await lop.update({
                where: {id: id},
                data: {ten, nam_hoc, ki}
            })
            return res.json(updateObject);
        } else {
            return res.status(400).json({
                msg: ROUTER_NAME + "không tồn tại trên hệ thống"
            })
        }
    } else {
        return res.status(422).json({error: errors.array()});
    }
})


router.delete("/:id", checkAuth, async (req, res) => {
    logger.info('Có ' + req.method + ' request đến ' + req.protocol + '://' + req.get('host') + req.originalUrl);
    const id = req.params.id;
    if (id === undefined) return res.status(400).json({
        msg: "Id params không được để trống"
    })
    const object = await lop.findUnique({
        where: {id: id}
    });
    if (object) {
        const deleteObject = await lop.delete({
            where: {id: id},
        })
        return res.json(deleteObject);
    } else {
        return res.status(400).json({
            msg: ROUTER_NAME + " không tồn tại trên hệ thống"
        })
    }
})


module.exports = router;