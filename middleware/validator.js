const {check, query} = require('express-validator');

const isLengthMessage = (type, min, max) => `Invalid.  ${type} trong khoảng từ ${min} cho đến ${max} ký tự!`;
const isLengthIntMessage = (type, min, max) => `Invalid.  ${type} là số trong khoảng từ ${min} cho đến ${max}!`;
const isEmptyMessage = (type) => `Invalid. ${type} không được để trống`;
const isNotUnicodeMessage = (type) => `Invalid. ${type} không chứa unicode`;

let validateRegisterUser = () => {
    return [
        check('username', isEmptyMessage('Username')).not().isEmpty(),
        check('username', isLengthMessage('Username', 6, 18)).isLength({min: 6, max: 18}),
        check("username", isNotUnicodeMessage("Username")).isAlphanumeric("en-US"),
        check('password', isEmptyMessage('Password')).not().isEmpty(),
        check('password', isLengthMessage('Password', 6, 18)).isLength({min: 6, max: 18}),
    ];
}

let validateLogin = () => {
    return [
        check('username', isEmptyMessage('Username')).not().isEmpty(),
        check('username', isLengthMessage('Username', 6, 18)).isLength({min: 6, max: 18}),
        check("username", isNotUnicodeMessage("Username")).isAlphanumeric("en-US"),
        check('password', isEmptyMessage('Password')).not().isEmpty(),
        check('password', isLengthMessage('Password', 6, 18)).isLength({min: 6, max: 18}),
    ];
}

let validateUser = () => {
    return [
        check('username', isEmptyMessage('Username')).not().isEmpty(),
        check('username', isLengthMessage('Username', 6, 18)).isLength({min: 6, max: 18}),
        check("username", isNotUnicodeMessage("Username")).isAlphanumeric("en-US"),
        check('password', isEmptyMessage('Password')).not().isEmpty(),
        check('password', isLengthMessage('Password', 6, 18)).isLength({min: 6, max: 18}),
    ];
}


let validateBodyQuyen = () => {
    const tenQuyen = "Tên quyền";
    return [
        check('ten', isEmptyMessage(tenQuyen)).not().isEmpty(),
        check('ten', isLengthMessage(tenQuyen, 0, 50)).isLength({min: 0, max: 50})
    ]
}

let validateBodyPhong = () => {
    const tenPhong = "Tên quyền";
    return [
        check('ten', isEmptyMessage(tenPhong)).not().isEmpty(),
        check('ten', isLengthMessage(tenPhong, 0, 50)).isLength({min: 0, max: 50})
    ]
}

let validateBodyAdmin = () => {
    const tenAdmin = "Tên admin";
    const gioiTinh = "Giới tính";
    return [
        check('ten', isEmptyMessage(tenAdmin)).not().isEmpty(),
        check('ten', isLengthMessage(tenAdmin, 0, 50)).isLength({min: 0, max: 50}),
        check('gioi_tinh', isEmptyMessage(gioiTinh)).not().isEmpty(),
        check('gioi_tinh', isLengthMessage(gioiTinh, 0, 50)).isLength({min: 0, max: 10}),
        check("gioi_tinh", 'Hãy chọn giới tính là "Nam", "Nu" hoặc "Khac"').isIn(['Nam', 'Nu', 'Khac'])
    ]
}

let validateBodyGiangVien = () => {
    const tenAdmin = "Tên giảng viên";
    const gioiTinh = "Giới tính";
    return [
        check('ten', isEmptyMessage(tenAdmin)).not().isEmpty(),
        check('ten', isLengthMessage(tenAdmin, 0, 50)).isLength({min: 0, max: 50}),
        check('gioi_tinh', isEmptyMessage(gioiTinh)).not().isEmpty(),
        check('gioi_tinh', isLengthMessage(gioiTinh, 0, 50)).isLength({min: 0, max: 10}),
        check("gioi_tinh", 'Hãy chọn giới tính là "Nam", "Nu" hoặc "Khac"').isIn(['Nam', 'Nu', 'Khac'])
    ]
}

let validateBodyLop = () => {
    const tenLop = "Tên lớp";
    const namHoc = "Năm học";
    const ki = "Kỳ học"

    return [
        check('ten', isEmptyMessage(tenLop)).not().isEmpty(),
        check('ten', isLengthMessage(tenLop, 0, 50)).isLength({min: 0, max: 50}),
        check('ten', isNotUnicodeMessage(tenLop, 0, 50)).isAlphanumeric(),
        check('nam_hoc', isLengthIntMessage(namHoc, 1900, 2030)).not().isString(),
        check('nam_hoc', isLengthIntMessage(namHoc, 1900, 2030)).isInt({min: 1900, max: 2030}),
        check('nam_hoc', isEmptyMessage(namHoc)).not().isEmpty(),
        check('ki', isLengthIntMessage(namHoc, 1900, 2030)).not().isString(),
        check('ki', isLengthIntMessage(ki, 1, 8)).isInt({min: 1, max: 8}),
        check('ki', isEmptyMessage(ki)).not().isEmpty(),
    ]
}

let validate = {
    validateRegisterUser: validateRegisterUser,
    validateLogin: validateLogin,
    validateUser: validateUser,
    validateBodyQuyen: validateBodyQuyen,
    validateBodyPhong: validateBodyPhong,
    validateBodyAdmin: validateBodyAdmin,
    validateBodyGiangVien: validateBodyGiangVien,
    validateBodyLop: validateBodyLop
};

module.exports = {validate};