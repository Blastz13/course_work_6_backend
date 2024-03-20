const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {
    User,
    Basket,
    Type,
    Device,
    DeviceInfo,
    Permission,
    Role,
    Store,
    Category,
    UserStore
} = require('../models/models')
const {Op} = require("sequelize");
const generateJwt = (id, email, role) => {
    return jwt.sign(
        {id, email, role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class UserController {
    async registration(req, res, next) {
        const {email, password, phone, roleId} = req.body
        if (!email || !password) {
            return next(ApiError.badRequest('Некорректный email или password'))
        }
        const candidate = await User.findOne({where: {email}})
        if (candidate) {
            return next(ApiError.badRequest('Пользователь с таким email уже существует'))
        }
        const candidate2 = await User.findOne({where: {phone}})
        if (candidate2) {
            return next(ApiError.badRequest('Пользователь с таким телефоном уже существует'))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({email, password: hashPassword, phone, roleId})
        const token = generateJwt(user.id, user.email, user.roleId)
        return res.json({token})
    }

    async login(req, res, next) {
        const {email, password} = req.body
        const user = await User.findOne({where: {email}})
        if (!user) {
            return next(ApiError.internal('Пользователь не найден'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.internal('Указан неверный пароль'))
        }
        const token = generateJwt(user.id, user.email, user.roleId)
        return res.json({token})
    }

    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role)
        return res.json({token})
    }

    async getAll(req, res) {
        const users = await User.findAll({
            include: [
                {model: Role},
                {model: Store},
            ]
        })
        return res.json(users)
    }

    async getOne(req, res) {
        const {id} = req.params
        const user = await User.findOne(
            {
                where: {id},
                include: [
                    {model: Role},
                    {model: Store},
                ]
            },
        )
        return res.json(user)
    }

    async update(req, res) {
        const {id} = req.params
        const {email, phone, password} = req.body;

        try {
            const user = User.update(
                {email, phone, password},
                {
                    where: {
                        id: id
                    }
                }
            )
            res.json(user);
        } catch (e) {
            res.status(400).json({message: "Ошибка валидации"})
        }

    }

    async updateAdmin(req, res) {
        const {id} = req.params
        const {email, phone, roleId, stores} = req.body;

        try {
            const user = User.update(
                {email, phone, roleId},
                {
                    where: {
                        id: id
                    },
                    include: [
                        {model: Role},
                        {model: Store},
                    ]
                }
            )

            const st = await Store.findAll({
                where: {
                    id: {
                        [Op.in]: stores
                    }
                }
            });



            // const userForM2M = await User.findOne(
            //     {
            //         where: {id},
            //         include: [
            //             {model: Role},
            //             {model: Store},
            //         ]
            //     },
            // )

            // userForM2M.store = roles
            // await userForM2M.save()
            console.log(st)
            // if (st){
            //     await userForM2M.setStores(st);
            // }

            await UserStore.destroy({
                where: {
                    accountId: id
                }
            })

            for (const stKey in stores) {
                const userStore = await UserStore.create({storeId: stores[stKey], accountId: id})
            }
            return res.status(200).json(user);

        } catch (e) {
            console.log(e)
            res.status(400).json({message: "Ошибка валидации"})
        }

    }


    async delete(req, res) {
        const {id} = req.params

        try {
            await User.destroy({
                where: {
                    id: id
                }
            })
            res.status(204).json();
        } catch (e) {
            res.status(400).json({message: "Ошибка валидации"})
        }
    }
}

module.exports = new UserController()
