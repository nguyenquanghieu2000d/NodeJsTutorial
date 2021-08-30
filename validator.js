const {check} = require('express-validator');

let validateRegisterUser = () => {
  return [ 
    // check('user.username', 'username does not Empty').not().isEmpty(),
    // check('user.username', 'username must be Alphanumeric').isAlphanumeric(),
    // check('user.username', 'username more than 6 degits').isLength({ min: 6 }),
    check('email', 'Invalid does not Empty').not().isEmpty(),
    check('email', 'Invalid email').isEmail(),
    // check('user.birthday', 'Invalid birthday').isISO8601('yyyy-mm-dd'),
    check('password', 'password more than 6 degits').isLength({ min: 6 })
  ]; 
}

let validateLogin = () => {
  return [ 
    check('email', 'Invalid does not Empty').not().isEmpty(),
    check('email', 'Invalid email').isEmail(),
    check('password', 'password more than 6 degits').isLength({ min: 6 })
  ]; 
}

let validate = {
  validateRegisterUser: validateRegisterUser,
  validateLogin: validateLogin
};

module.exports = {validate};