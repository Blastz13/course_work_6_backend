const jwt = require('jsonwebtoken')
const {User, Role, Permission, Store} = require("../models/models");

module.exports = function (roles) {
    return async function (req, res, next) {
        if (req.method === "OPTIONS") {
            next()
        }
        try {
            const token = req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(401).json({message: "Не авторизован"})
            }

            const decoded = jwt.verify(token, process.env.SECRET_KEY)
            const userId = decoded.id
            const user = await User.findOne(
                {
                    where: {id: userId},
                    include: [
                        {model: Role},
                        {model: Store},
                    ]
                },
            )
            req.user = user;
            // console.log(roles)
            // console.log(user.role.name.toUpperCase())
            // console.log(!(roles.includes(user.role.name.toUpperCase())))
            if (!(roles.includes(user.role.name.toUpperCase()))) {
                return res.status(403).json({message: "Нет доступа"})
            }
            next()
        } catch (e) {
            console.log(e)
            res.status(401).json({message: "Не авторизован"})
        }
    };
}



