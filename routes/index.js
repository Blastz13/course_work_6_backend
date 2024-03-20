const Router = require('express');
const orderRouter = require('./orderRouter');
const userRouter = require('./userRouter');
const storeRouter = require('./storeRouter');
const categoryRouter = require('./categoryRouter');
const articleRouter = require('./articleRouter');
const orderArticleRoute = require('./orderArticleRoute');
const roleRouter = require('./roleRouter');
const statisticRouter = require('./statisticRouter');

const router = new Router();

router.use('/category', categoryRouter);
router.use('/role', roleRouter);
router.use('/user', userRouter);
router.use('/store_article', articleRouter);
router.use('/order_article', orderArticleRoute);
router.use('/store', storeRouter);
router.use('/order', orderRouter);
router.use('/statistic', statisticRouter);

// router.use('/store', storeRouter);

module.exports = router;
