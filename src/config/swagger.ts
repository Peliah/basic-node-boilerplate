import swaggerJsDoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'True Number API',
            version: "1.0.0",
            description: 'API documentation for True Number',
        },
    },
    apis: [__dirname + '/../routes/v1/*.ts'],
};

export default swaggerJsDoc(options);