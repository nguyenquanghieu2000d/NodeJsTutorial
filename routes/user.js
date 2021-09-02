const router = require('express').Router();
const { validate } = require('../middleware/validator');
const { validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { checkAuth, secretKey } = require('../middleware/checkAuth');
const { v4 } = require('uuid');
const { log4js } = require('../middleware/logging');
const { handleUndefined, errorResponse } = require('../utils/utils');
const AdminApi = require("../api/AdminApi")
const SinhVienApi = require("../api/SinhVienApi")
const GiangVienApi = require("../api/GiangVienApi")
const QuyenApi = require("../api/QuyenApi")
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");


const FIRST_INSERT_ID_SYNTAX = "U_";
const ROUTER_NAME = "User";
const { user, quyen } = new PrismaClient();
const logger = log4js.getLogger(ROUTER_NAME);


router.get('/', checkAuth, async(req, res) => {
    logger.info('Có ' + req.method + ' request đến ' + req.protocol + '://' + req.get('host') + req.originalUrl);
    let { id, username } = handleUndefined(req.query, ["id", "username"]);
    const result = await user.findMany({
        where: { id: { contains: id }, username: { contains: username } },
        select: { id: true, username: true, fk_quyen: true, fk_profile: true, create_at: true, update_at: true, status: true },
    });

    return res.json(result);
});

router.get("/:id", checkAuth, async(req, res) => {
    logger.info('Có ' + req.method + ' request đến ' + req.protocol + '://' + req.get('host') + req.originalUrl);
    const id = req.params.id;
    const result = await user.findUnique({
        where: { id: id },
        select: { id: true, username: true, fk_quyen: true, fk_profile: true, create_at: true, update_at: true, status: true }
    })
    if (result) return res.json(result);
    else return res.status(400).json(
        errorResponse([
            [id, `${ROUTER_NAME} không tồn tại trên hệ thống`, "id", "body"]
        ])
    )
});


router.post('/', checkAuth, validate.validateLoaiTkForUser(), async(req, res) => {
    logger.info('Có ' + req.method + ' request đến ' + req.protocol + '://' + req.get('host') + req.originalUrl);
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        let { username, password, fk_quyen, loai } = req.body;
        try {
            const existObject = await user.findUnique({
                where: { username: username }
            });
            if (existObject) {
                return res.status(400).json(errorResponse([
                    [username, ROUTER_NAME + " đã tồn tại trên hệ thống", "username", "body"]
                ]));
            }
            logger.info("Username hợp lệ");
            let EntityApi;
            if (loai === "GV") EntityApi = GiangVienApi;
            else if (loai === "SV") EntityApi = SinhVienApi;
            else if (loai === "AD") EntityApi = AdminApi;
            else res.status(400).json(errorResponse([
                [loai, "Loại không tồn tại trên hệ thống", "loai", "body"]
            ]));
            logger.info("Loại hợp lệ");
            const response = await QuyenApi.get(fk_quyen);
            if (!response)
                return res.status(400).json(errorResponse([
                    [fk_quyen, "Quyền không tồn tại trong hệ thống", "fk_quyen", "body"]
                ]));
            logger.info("Quyền hợp lệ");
            const response1 = await EntityApi.post(req.body)
            logger.info("Insert profile thành công")

            const fk_profile = response1.id;
            const id = FIRST_INSERT_ID_SYNTAX + v4();
            password = await bcrypt.hash(password, 10);
            const newUser = await user.create({
                data: {
                    id,
                    username,
                    password,
                    fk_quyen,
                    fk_profile,
                }
            })
            newUser.profile = response;
            return res.json(newUser);
        } catch (err) {
            logger.error(ROUTER_NAME + " " + err)
            return res.status(400).json(err.response.data);
        }
    } else {
        return res.status(422).json({ error: errors.array() });
    }
});

router.put("/:id", validate.validateLoaiTkForUserPut(), async(req, res) => {
    logger.info('Có ' + req.method + ' request đến ' + req.protocol + '://' + req.get('host') + req.originalUrl);
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        let { username, password, fk_quyen, loai } = req.body;
        const id = req.params.id;
        if (id === undefined)
            return res.status(400).json(errorResponse([
                [id, "Id params không được để trống", "id", "body"]
            ]));
        let entityApi;
        const existObject = await user.findUnique({
            where: { id }
        });
        if (!existObject) {
            return res.status(400).json(errorResponse([
                [id, ROUTER_NAME + "không đã tồn tại trên hệ thống", "id", "body"]
            ]));
        }
        if (loai === "GV") entityApi = GiangVienApi;
        else if (loai === "SV") entityApi = SinhVienApi;
        else if (loai === "AD") entityApi = AdminApi;
        else res.status(400).json(errorResponse([
            [loai, "Loại không tồn tại trên hệ thống hãy chọn loại GV , SV hoặc AD", "loai", "body"]
        ]));
        try {
            req.body.id = existObject.fk_profile;
            logger.info(req.body)
            const response = await entityApi.put(req.body)
            password = await bcrypt.hash(password, 10);
            let data = {};
            if (fk_quyen) data.fk_quyen = fk_quyen;
            if (password) data.password = password;
            const newUser = await user.update({
                where: { id },
                data
            })
            newUser.profile = response;
            return res.json(newUser);
        } catch (err) {
            return res.status(400).json(err.response.data);
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
    const object = await user.findUnique({
        where: { id: id }
    });
    if (object) {
        const deleteUser = await user.update({
            where: { id },
            data: { status: object.status ? 0 : 1 }
        })
        return res.json(deleteUser);
    } else {

        return res.status(400).json(errorResponse([
            [id, ROUTER_NAME + " Không tồn tại trên hệ thống", "id", "body"]
        ]));
    }
})


router.delete("/absolute/:id", async(req, res) => {
    logger.info('Có ' + req.method + ' request đến ' + req.protocol + '://' + req.get('host') + req.originalUrl);
    const id = req.params.id;
    if (id === undefined)
        return res.status(400).json(errorResponse([
            [id, "Id params không được để trống", "id", "body"]
        ]));
    const object = await user.findUnique({
        where: { id: id }
    });
    if (object) {
        logger.info(object)
        const fk_profile = object.fk_profile;
        const tag = fk_profile.split("_")[0];
        let EntityApi;
        if (tag === "AD") EntityApi = AdminApi
        else if (tag === "GV") EntityApi = GiangVienApi
        else if (tag === "SV") EntityApi = SinhVienApi
        else {
            logger.info("Lỗi mã")
            return res.status(500).json(errorResponse([
                [id, "Lỗi mã ", "id", "body"]
            ]));
        }
        try {
            logger.info(id);
            const deleteObject = await user.delete({
                where: { id },
            })
            const response = await EntityApi.delete(fk_profile);
            logger.info(response)
            deleteObject.profile = response;
            return res.json(deleteObject);
        } catch (err) {
            logger.error(err)
            logger.error(err.response.data);
            return res.status(400).json(err.response.data);
        }
    } else {

        return res.status(400).json(errorResponse([
            [id, ROUTER_NAME + " Không tồn tại trên hệ thống", "id", "body"]
        ]));
    }
})


module.exports = router;