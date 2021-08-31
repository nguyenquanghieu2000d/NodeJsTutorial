const { check, query } = require('express-validator');

const isLengthMessage = (type, min, max) => 'Invalid. ' + type + ' trong khoảng từ ' + min + ' cho đến ' + max + ' ký tự!';
const isEmptyMessage = (type) => 'Invalid. ' + type + ' không được để trống';
const isNotUnicodeMessage = (type) => 'Invalid. ' + type + ' không chứa unicode';

let validateRegisterUser = () => {
    return [
        check('username', isEmptyMessage('Username')).not().isEmpty(),
        check('username', isLengthMessage('Username', 6, 18)).isLength({ min: 6, max: 18 }),
        check("username", isNotUnicodeMessage("Username")).isAlphanumeric("en-US"),
        check('password', isEmptyMessage('Password')).not().isEmpty(),
        check('password', isLengthMessage('Password', 6, 18)).isLength({ min: 6, max: 18 }),
    ];
}

let validateLogin = () => {
    return [
        check('username', isEmptyMessage('Username')).not().isEmpty(),
        check('username', isLengthMessage('Username', 6, 18)).isLength({ min: 6, max: 18 }),
        check("username", isNotUnicodeMessage("Username")).isAlphanumeric("en-US"),
        check('password', isEmptyMessage('Password')).not().isEmpty(),
        check('password', isLengthMessage('Password', 6, 18)).isLength({ min: 6, max: 18 }),
    ];
}

let validateBodyQuyen = () => {
    const tenQuyen = "Tên quyền";
    return [
        check('ten', isEmptyMessage(tenQuyen)).not().isEmpty(),
        check('ten', isLengthMessage(tenQuyen, 0, 50)).isLength({ min: 0, max: 50 })
    ]
}

let validateBodyPhong = () => {
    const tenPhong = "Tên quyền";
    return [
        check('ten', isEmptyMessage(tenPhong)).not().isEmpty(),
        check('ten', isLengthMessage(tenPhong, 0, 50)).isLength({ min: 0, max: 50 })
    ]
}

let validateBodyAdmin = () => {
    const tenAdmin = "Tên admin";
    const gioiTinh = "Giới tính";
    return [
        check('ten', isEmptyMessage(tenAdmin)).not().isEmpty(),
        check('ten', isLengthMessage(tenAdmin, 0, 50)).isLength({ min: 0, max: 50 }),
        check('gioi_tinh', isEmptyMessage(gioiTinh)).not().isEmpty(),
        check('gioi_tinh', isLengthMessage(gioiTinh, 0, 50)).isLength({ min: 0, max: 10 }),
        check("gioi_tinh", 'Hãy chọn giới tính là "Nam", "Nu" hoặc "Khac"').isIn(['Nam', 'Nu', 'Khac'])
    ]
}


let validate = {
    validateRegisterUser: validateRegisterUser,
    validateLogin: validateLogin,
    validateBodyQuyen: validateBodyQuyen,
    validateBodyPhong: validateBodyPhong,
    validateBodyAdmin: validateBodyAdmin,
};

module.exports = { validate };