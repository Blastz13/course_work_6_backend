const {Role} = require('../models/models')
const ApiError = require('../error/ApiError');

class RoleController {
    async create(req, res) {
        const {name} = req.body
        const role = await Role.create({name})
        return res.json(role)
    }

    async getAll(req, res) {
        const roles = await Role.findAll()
        return res.json(roles)
    }

    async getOne(req, res) {
        const {id} = req.params
        const role = await Role.findOne(
            {
                where: {
                    id: id,
                }
            },
        )
        return res.json(role)
    }

    async update(req, res) {
        const {id} = req.params
        const {name} = req.body;

        try {
            const role = Role.update(
                {name: name},
                {
                    where: {
                        id: id
                    }
                }
            )
            res.json(role);
        } catch (e) {
            res.status(400).json({message: "Ошибка валидации"})
        }

    }

    async delete(req, res) {
        const {id} = req.params

        try {
            await Role.destroy({
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

module.exports = new RoleController()
