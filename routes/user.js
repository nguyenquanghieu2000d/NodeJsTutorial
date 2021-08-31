const router = require('express').Router();
const { PrismaClient } = require('@prisma/client')
const { validate } = require('../middleware/validator')
const { validationResult } = require('express-validator')
const { quyen, phong } = new PrismaClient();


router.get('/okok', async(req, res) => {
    const users = await quyen.findMany({
        select: {
            id: true // Chọn trường lấy ra 
        },
        where: {
            ten: 'admin' // điều kiện where
        }
    });
    re.json(users);
});

router.post('/ok', async(req, res) => {
    const { id } = req.body;
    console.log(id)


    const userExists = await phong.findUnique({
        where: {
            id: id
        },
        select: {
            id: true
        }
    });

    if (userExists) {
        return res.status(400).json({
            msg: "user already exists"
        })
    }
    const newPhong = await phong.create({
        data: {
            id
        }
    });
    res.json(newPhong)
})




module.exports = router;