const fs = require('fs');
const faker = require('faker');

// Function to generate fake products
function generateFakeProducts(count) {
    const products = [];

    for (let i = 0; i < count; i++) {
        const product = {
            id: i + 1,
            name: faker.commerce.productName(),
            price: parseFloat(faker.commerce.price()),
            description: faker.commerce.productDescription(),
            product: faker.commerce.product(),
            color: faker.commerce.color(),
            createdAt: faker.date.past().toISOString(),
            image: faker.image.imageUrl()
        };
        products.push(product);
    }

    return products;
}

// Generate fake products
const products = generateFakeProducts(1001); // Change the number of products as needed

// Write products to JSON file
fs.writeFileSync('products.json', JSON.stringify(products, null, 2));

console.log('Fake products generated and saved to products.json');
