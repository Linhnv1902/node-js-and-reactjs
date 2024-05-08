const Koa = require('koa');
const koaBody = require('koa-body');
const productRoutes = require('./routes/products.js');


const app = new Koa();

app.use(koaBody());
app.use(productRoutes.routes());
app.use(productRoutes.allowedMethods());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
