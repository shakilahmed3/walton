const version = "1.0.0"
import { Express, Request, Response } from "express";
import swaggerJsdoc, { Options } from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options: Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Walton Job Task",
            version,
            description: "API documentation for Walton Job Task (Technology Stack-> NodeJS, MongoDB, Typescript, ExpressJS, REST, Redis, Git)"
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        servers: [
            {
                url: `/api`
            }
        ],
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: [
        './src/swagger-docs/Category.yaml',
    ]
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Express, port: number) {
    // Swagger page
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Docs in JSON format
    app.get("/api/docs.json", (req: Request, res: Response) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });

    console.log(`APIs docs available at "/api/docs"`);
}

export default swaggerDocs;

