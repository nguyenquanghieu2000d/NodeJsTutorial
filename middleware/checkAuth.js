const JWT = require('jsonwebtoken');
const secretKey = "skdfmklsdmnfklsmdfksnmdfkskdfmklsdmnfklsmdfksnmdfkskldhgfusdnikoghsjudngoierjtnienrgnikomdfignjidfgjdnsfgnokidsfngkjosndjkgfnsjdgnikjs";


const checkAuth = async(req, res, next) => {
    const token = req.headers['x-auth-token'];
    if (token === process.env.APP_TOKEN) {
        return next();
    }

    if (!token) {
        return res.status(400).json({
            "errors": [{
                "msg": "Access denied. No token found"
            }]
        })
    }
    try {
        let user = await JWT.verify(token, secretKey);
        return next();
    } catch (error) {
        return res.status(400).json({
            "errors": [{
                "msg": "Access denied. Token invalid"
            }]
        })
    }
}

module.exports = { checkAuth, secretKey }