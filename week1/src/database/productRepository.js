const fs = require('fs');
const products = require('./products.json');

/**
 * Get all products
 * @param {number} limit - Limit number of products to return
 * @param {string} sort - Sort order (asc or desc)
 * @returns {Array} - Array of products
 */
function getAll(limit = 0, sort = 'desc') {
    let sortedProducts = [...products];
    if (sort === 'asc') {
        sortedProducts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sort === 'desc') {
        sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    if (!limit && parseInt(limit) <= 0) {
        return sortedProducts;
    }

    return sortedProducts.slice(0, limit);
}

/**
 *
 * @param id
 * @returns {{author: string, name: string, id: number} | {author: string, name: string, id: number} | {author: string, name: string, id: number} | {author: string, name: string, id: number}}
 */
function getProduct(id) {
    return products.find(products => products.id === parseInt(id));
}

/**
 *
 * @param data
 */
function addProduct(data) {
    const updatedProducts = [data, ...products];
    return fs.writeFileSync('./src/database/products.json', JSON.stringify(updatedProducts));
}

/**
 * Update a product by ID
 * @param {number} id - Product ID
 * @param {object} newData - New product data
 */
function updateProduct(id, newData) {
    const index = products.findIndex(product => product.id === parseInt(id));
    if (index !== -1) {
        products[index] = { ...products[index], ...newData };
        fs.writeFileSync('./src/database/products.json', JSON.stringify(products));
    } else {
        throw new Error('Product not found');
    }
}

/**
 * Delete a product by ID
 * @param {number} id - Product ID
 */
function deleteProduct(id) {
    const index = products.findIndex(product => product.id === parseInt(id));
    if (index !== -1) {
        products.splice(index, 1);
        fs.writeFileSync('./src/database/products.json', JSON.stringify(products));
    } else {
        throw new Error('Product not found');
    }
}

module.exports = {
    getProduct,
    getAll,
    addProduct,
    updateProduct,
    deleteProduct
};