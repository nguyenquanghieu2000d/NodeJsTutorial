const JWT = require('jsonwebtoken');
const secretKey = "skdfmklsdmnfklsmdfksnmdfk";

module.exports = async(req, res, next) => {
    const token = req.headers['x-auth-token'];
    console.log(token);
    if (!token) {
        return res.json({
            "errors": [{
                "msg": "Access denied. No token found"
            }]
        })
    }

    try {
        let user = await JWT.verify(token, secretKey);
        next();
    } catch (error) {
        return res.json({
            "errors": [{
                "msg": "Access denied. Token invalid"
            }]
        })
    }
}