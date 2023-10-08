import { Request, Response } from "express";

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const version = "1.0.0"

const options = {
    definition: {
        openapi: "3.0.3",
        info: {
            title: "Walton Job Task",
            version,
            description: "This is the Rest APIs for 'Walton'"
        },
        servers: [
            {
                url: `/api`
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: "bearer",
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: [
        './src/swagger-docs/Category.yaml',
    ]
}

const swaggerSpec = swaggerJsdoc(options)

function swaggerDocs(app: any, port: any) {
    //Swagger page
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

    //Docs in JSON Format
    app.get('/api/docs.json', (req: Request, res: Response) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec)
    })
    console.log(`APIs docs available at "/api/docs"`);
}

module.exports = swaggerDocs
