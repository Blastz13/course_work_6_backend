const jwt = require('jsonwebtoken')
const {User, Role, Permission, Store} = require("../models/models");

module.exports = async function (req, res, next) {
    if (req.method === "OPTIONS") {
        next()
    }
    try {
        const token = req.headers.authorization.split(' ')[1]
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

        const {store_id} = req.params;
        if (!(store_id in user.stores || (user.role && ["ADMIN", "SUPERUSER"].includes(user.role.name)))) {
            return res.status(403).json({message: "Вы не имеете доступа к данному ресурсу"})
        }

        next()
    } catch (e) {
        console.log(e)
        res.status(401).json({message: "Не авторизован"})
    }
};
