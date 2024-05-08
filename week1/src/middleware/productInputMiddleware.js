const yup = require('yup');

const productSchema = yup.object().shape({
    id: yup.number().required(),
    name: yup.string().required(),
    price: yup.number().required(),
    description: yup.string().required(),
    product: yup.string().required(),
    color: yup.string().required(),
    createdAt: yup.date().required(),
    image: yup.string().required()
});

async function validateProductInput(ctx, next) {
    try {
        const postData = ctx.request.body;
        const productSchema = yup.object().shape({
            id: yup.number().required(),
            name: yup.string().required(),
            price: yup.number().required(),
            description: yup.string().required(),
            product: yup.string().required(),
            color: yup.string().required(),
            createdAt: yup.date().required(),
            image: yup.string().required()
        });
        await productSchema.validate(postData);
        next();
    } catch (e) {
        ctx.status = 400;
        ctx.body = {
            success: false,
            errors: e.errors,
            errorName: e.name
        }
    }

}

module.exports = {
    validateProductInput
};
