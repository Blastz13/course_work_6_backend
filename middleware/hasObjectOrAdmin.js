const jwt = require('jsonwebtoken')
const {User, Role, Permission, Store} = require("../models/models");

module.exports = function (obj) {
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

            const objOne = await obj.findOne(
                {
                    where: {id: req.params.id},
                },
            )

            if (!( (user.role && (user.role.name === 'ADMIN' || user.role.name === 'SUPERUSER' )) || objOne.hasObject(req.user.id))) {
                // console.log('123123')
                return res.status(403).json({message: "Нет доступа"})
            }
            next()
        } catch (e) {
            console.log(e)
            res.status(401).json({message: "Не авторизован"})
        }
    };
}



