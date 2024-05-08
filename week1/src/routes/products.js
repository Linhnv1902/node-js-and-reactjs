const Router = require('koa-router');
const productHandlers = require('../handlers/product/productHandlers');
const { validateProductInput } = require("../middleware/productInputMiddleware");

const router = new Router({
  prefix: '/api'
});

router.get('/products', productHandlers.getProducts);
router.post('/products',validateProductInput, productHandlers.addProduct);
router.put('/product/:id', validateProductInput, productHandlers.updateProduct);
router.delete('/product/:id', productHandlers.deleteProduct);
router.get('/product/:id', productHandlers.getProductById);

module.exports = router;
