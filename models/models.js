const sequelize = require('../db');
const {DataTypes} = require('sequelize');

const User = sequelize.define('account', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true,},
    phone: {type: DataTypes.STRING, unique: true,},
    password: {type: DataTypes.STRING},
})

User.prototype.hasObject = function (id) {
    return this.id === id;
};

const Role = sequelize.define('role', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true,},
})

const Store = sequelize.define('store', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true,},
    address: {type: DataTypes.STRING, unique: true,},
})


const Article = sequelize.define('article', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING},
    author: {type: DataTypes.STRING},
    article_number: {type: DataTypes.STRING},
    count: {type: DataTypes.INTEGER},
})



const Category = sequelize.define('category', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true,},
})

const Order = sequelize.define('order', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    date_arrive: {type: DataTypes.DATE},
    status: {type: DataTypes.STRING},
    order_type: {type: DataTypes.STRING},
})

const OrderArticle = sequelize.define('order_article', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING,},
    author: {type: DataTypes.STRING},
    article_number: {type: DataTypes.STRING},
    count: {type: DataTypes.INTEGER},
})

const UserStore = sequelize.define('user_store', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})


Role.hasOne(User);
User.Role = User.belongsTo(Role);

User.stores = User.belongsToMany(Store, {through: UserStore});
Store.users = Store.belongsToMany(User, {through: UserStore});

Order.belongsTo(User, {as: 'destinationUser', foreignKey: 'destinationUserId'});
Order.belongsTo(User, {as: 'sourceUser', foreignKey: 'sourceUserId'});

Order.belongsTo(Store, {as: 'destinationWarehouse', foreignKey: 'destinationId'});
Order.belongsTo(Store, {as: 'sourceWarehouse', foreignKey: 'sourceId'});

Store.hasMany(Article);
Article.belongsTo(Store);

Category.hasMany(Article);
Article.belongsTo(Category);

Order.hasMany(OrderArticle);
OrderArticle.belongsTo(Order);

Category.hasMany(OrderArticle);
OrderArticle.belongsTo(Category);


module.exports = {
    User,
    Role,
    Store,
    Article,
    OrderArticle,
    Order,
    Category,
    UserStore,
}





