const { PrismaClient } = require('@prisma/client');
const { quyen, phong } = new PrismaClient();

const func = async() => {
    const users = await quyen.findMany({
        select: {
            id: true // Chọn trường lấy ra 
        },
        where: {
            ten: 'admin' // điều kiện where
        }
    });
    console.log(users);
    return users;
}

const addQuyen = async() => {
    const newQuyen = await quyen.create({
        data: {
            id: "65"
        }
    });
    console.log(newQuyen);
}

addQuyen();