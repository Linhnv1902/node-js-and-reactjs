const {
    getAll: getAll,
    getProduct: getProduct,
    addProduct: addDataProduct,
    updateProduct: updateDataProduct,
    deleteProduct: deleteDataProduct,
} = require("../../database/productRepository");

/**
 * Get all products
 * @param {object} ctx - Koa context
 */
async function getProducts(ctx) {
    try {
        const { limit, sort } = ctx.query;
        const products = getAll(parseInt(limit ? limit : 0), sort);

        console.log(products)
        ctx.body = {
            data: products
        };
    } catch (e) {
        ctx.status = 404;
        ctx.body = {
            success: false,
            data: [],
            error: e.message
        };
    }
}

/**
 * Get a product by ID
 * @param {object} ctx - Koa context
 */
async function getProductById(ctx) {
    try {
        const { id } = ctx.params;
        const product = getProduct(id);

        if (product) {
            let fields = ctx.query.fields;
            if (fields) {
                fields = fields.split(',');
                const pickedProduct = {};
                fields.forEach(field => {
                    if (product[field]) {
                        pickedProduct[field] = product[field];
                    }
                });
                ctx.body = {
                    data: pickedProduct
                };
            } else {
                ctx.body = {
                    data: product
                };
            }
        } else {
            ctx.status = 404;
            ctx.body = {
                success: false,
                error: 'Product Not Found with that id!'
            };
        }
    } catch (e) {
        ctx.status = 500;
        ctx.body = {
            success: false,
            error: e.message
        };
    }
}

/**
 * Add a new product
 * @param {object} ctx - Koa context
 */
async function addProduct(ctx) {
    try {
        const product = ctx.request.body;
        addDataProduct(product);
        ctx.body = product;
        ctx.status = 201;
    } catch (e) {
        ctx.status = 500;
        ctx.body = {
            success: false,
            error: e.message
        };
    }
}

/**
 * Update a product by ID
 * @param {object} ctx - Koa context
 */
async function updateProduct(ctx) {
    try {
        const {id} = ctx.params;
        const productData = ctx.request.body;

        updateDataProduct(id, productData);

        ctx.body = {
            success: true,
            message: 'Product updated successfully'
        };
    } catch (e) {
        ctx.status = 500;
        ctx.body = {
            success: false,
            error: e.message
        };
    }
}

/**
 * Delete a product by ID
 * @param {object} ctx - Koa context
 */
async function deleteProduct(ctx) {
    try {
        const {id} = ctx.params;

        deleteDataProduct(id);

        ctx.body = {
            success: true,
            message: 'Product deleted successfully'
        };
    } catch (e) {
        ctx.status = 500;
        ctx.body = {
            success: false,
            error: e.message
        };
    }
}

module.exports = {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
};