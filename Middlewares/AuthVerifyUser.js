const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
dotenv.config();

const secretJWTToken = process.env.jwtSeceret;

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization
    if(!authHeader)return res.status(404).send("Access Denied");
    const token = authHeader.split(" ")[1];
    if(!token) return res.status(404).send("Access Denied")
    try {
        const verifiedUser = jwt.verify(token, secretJWTToken);
        req.user = verifiedUser;
        next();
    } catch (error) {
        console.log(error)
        res.status(400).send("Access Denied");
    }
}
