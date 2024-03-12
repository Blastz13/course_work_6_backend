const jwt = require('jsonwebtoken')
const {User, Role, Permission, Store} = require("../models/models");

module.exports = async function (req, res, next) {
    if (req.method === "OPTIONS") {
        next()
    }
    try {
        const token = req.headers.authorization.split(' ')[1]
        // console.log(req.headers.authorization)
        if (!token) {
            return res.status(401).json({message: "Не авторизован"})
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        const user_id = decoded.id
        const user = await User.findOne(
            {
                where: {id: user_id},
                include: [
                    {model: Role},
                    {model: Store},
                ]
            },
        )
        req.user = user;
        next()
    } catch (e) {
        res.status(401).json({message: "Не авторизован"})
    }
};
