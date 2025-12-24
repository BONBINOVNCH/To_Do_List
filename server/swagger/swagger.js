const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "API Documentation",
        version: "1.0.0",
        description: "Документація API",
    },
    server: [
        {
            url: "http://localhost:3000",
            description: "Development server",
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ["./server/routers/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerUi, swaggerSpec };
