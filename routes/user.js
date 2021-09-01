const router = require('express').Router();
const {validate} = require('../middleware/validator');
const {validationResult} = require('express-validator');
const {PrismaClient} = require('@prisma/client');
const {checkAuth} = require('../middleware/checkAuth');
const {v4} = require('uuid');
const {log4js} = require('../middleware/logging');
const handleUndefined = require('../utils/utils');

const FIRST_INSERT_ID_SYNTAX = "U_";
const ROUTER_NAME = "User";
const {user} = new PrismaClient();
const logger = log4js.getLogger(ROUTER_NAME);


router.get('/', checkAuth, async (req, res) => {
    logger.info('Có ' + req.method + ' request đến ' + req.protocol + '://' + req.get('host') + req.originalUrl);
    let {id, username} = handleUndefined(req.query, ["id", "username"]);
    const result = await user.findMany({
        where: {id: {contains: id}, username: {contains: username}},
        select: {id: true, username: true, fk_quyen: true, fk_profile: true, create_at: true, update_at: true}
    });

    return res.json(result);
});

router.get("/:id", checkAuth, async (req, res) => {
    logger.info('Có ' + req.method + ' request đến ' + req.protocol + '://' + req.get('host') + req.originalUrl);
    const id = req.params.id;
    const result = await user.findUnique({
        where: {id: id},
        select: {id: true, username: true, fk_quyen: true, fk_profile: true, create_at: true, update_at: true}
    })
    return res.json(result);
});


router.post('/', checkAuth, validate.validateBodyQuyen(), async (req, res) => {
    logger.info('Có ' + req.method + ' request đến ' + req.protocol + '://' + req.get('host') + req.originalUrl);
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        const {ten} = req.body;
        const id = FIRST_INSERT_ID_SYNTAX + v4();
        const object = await user.findMany({
            where: {
                OR: [{id: id}, {ten: ten}],
            }
        });
        if (object.length > 0) {
            return res.status(400).json({
                msg: ROUTER_NAME + " đã tồn tại trên hệ thống"
            })
        } else {
            const newObject = await user.create({
                data: {id, ten}
            });
            return res.json(newObject)
        }
    } else {
        return res.status(422).json({error: errors.array()});
    }
});

router.put("/:id", validate.validateBodyQuyen(), async (req, res) => {
    logger.info('Có ' + req.method + ' request đến ' + req.protocol + '://' + req.get('host') + req.originalUrl);
    const errors = validationResult(req);
    const id = req.params.id;
    if (id === undefined) return res.status(400).json({
        msg: "Id params không được để trống"
    })

    if (errors.isEmpty()) {

        const {ten} = req.body;
        const object = await user.findUnique({
            where: {id: id}
        });
        if (object) {
            const updateObject = await user.update({
                where: {id: id},
                data: {ten: ten}
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


router.delete("/:id", async (req, res) => {
    logger.info('Có ' + req.method + ' request đến ' + req.protocol + '://' + req.get('host') + req.originalUrl);
    const id = req.params.id;
    if (id === undefined) return res.status(400).json({
        msg: "Id params không được để trống"
    })

    const object = await quyen.findUnique({
        where: {id: id}
    });
    if (object) {
        const deleteObject = await user.delete({
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