const router = require('express').Router();
const {validate} = require('../middleware/validator');
const {validationResult} = require('express-validator');
const {PrismaClient} = require('@prisma/client');
const {checkAuth} = require('../middleware/checkAuth');
const {v4} = require('uuid');
const {log4js} = require('../middleware/logging');
const {handleUndefined, errorResponse} = require('../utils/utils');

const FIRST_INSERT_ID_SYNTAX = "MH_";
const ROUTER_NAME = "Môn học";
const {mon_hoc} = new PrismaClient();
const logger = log4js.getLogger(ROUTER_NAME);


router.get('/', checkAuth, async (req, res) => {
    logger.info('Có ' + req.method + ' request đến ' + req.protocol + '://' + req.get('host') + req.originalUrl);
    let {id, ten, stc} = handleUndefined(req.query, ['id', 'ten', 'stc']);
    let condition = {id: {contains: id}, ten: {contains: ten}};
    if (stc !== '') {
        condition.stc = stc
    }
    const result = await mon_hoc.findMany({
        where: condition
    });
    return res.json(result);
});

router.get("/:id", checkAuth, async (req, res) => {
    logger.info('Có ' + req.method + ' request đến ' + req.protocol + '://' + req.get('host') + req.originalUrl);
    const id = req.params.id;
    const result = await mon_hoc.findUnique({
        where: {id: id}
    })
    return res.json(result);
});


router.post('/', checkAuth, validate.validateBodyMonHoc(), async (req, res) => {
    logger.info('Có ' + req.method + ' request đến ' + req.protocol + '://' + req.get('host') + req.originalUrl);
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        let {ten, stc} = req.body;
        const id = FIRST_INSERT_ID_SYNTAX + v4();
        const object = await mon_hoc.findMany({
            where: {
                OR: [{id}, {ten}],
            }
        });
        if (object.length > 0) {
            return res.status(400).json(errorResponse([[id, ROUTER_NAME + " đã tồn tại trên hệ thống", "id", "body"]]))
        } else {
            const newObject = await mon_hoc.create({
                data: {
                    id,
                    ten,
                    stc
                }
            });
            return res.json(newObject)
        }
    } else {
        return res.status(422).json({error: errors.array()});
    }
});

router.put("/:id", checkAuth, validate.validateBodyMonHoc(), async (req, res) => {
    logger.info('Có ' + req.method + ' request đến ' + req.protocol + '://' + req.get('host') + req.originalUrl);
    const errors = validationResult(req);
    const id = req.params.id;
    if (id === undefined)
        return res.status(400).json(errorResponse([[id, "Id params không được để trống", "id", "body"]]))
    if (errors.isEmpty()) {
        const {ten, stc} = req.body;
        const object = await mon_hoc.findUnique({
            where: {id}
        });
        if (object) {
            const updateObject = await mon_hoc.update({
                where: {id: id},
                data: {ten, stc}
            })
            return res.json(updateObject);
        } else {
            return res.status(400).json(errorResponse([[id, ROUTER_NAME + " không tồn tại trên hệ thống", "id", "body"]]))
        }
    } else {
        return res.status(422).json({error: errors.array()});
    }
});


router.delete("/:id", checkAuth, async (req, res) => {
    logger.info('Có ' + req.method + ' request đến ' + req.protocol + '://' + req.get('host') + req.originalUrl);
    const id = req.params.id;
    if (id === undefined) return res.status(400).json(errorResponse([[id, "Id params không được để trống", "id", "body"]]))
    const object = await mon_hoc.findUnique({
        where: {id: id}
    });
    if (object) {
        const deleteObject = await mon_hoc.delete({
            where: {id: id},
        })
        return res.json(deleteObject);
    } else {
        return res.status(400).json(errorResponse([[id, ROUTER_NAME + " không tồn tại trên hệ thống", "id", "body"]]));
    }
})


module.exports = router;