import express, { NextFunction, Request, Response } from 'express';
const app = express();
const createError = require('http-errors')
const cors = require('cors')
const xssClean = require('xss-clean')
const config = require('config');
const { connectToDatabase } = require('./src/services/database')
require('dotenv').config()

const swaggerDocs = require('./src/utils/swagger')
const { setupRoutes } = require('./src/routes')

const port = config.get('SERVER_PORT')

const bootstrapApp = async () => {

    try {
        app.use(cors())
        app.use(xssClean());
        app.use(express.json());
        app.use(express.urlencoded({ extended: true, limit: '50mb' }));
        app.use(express.static('public'));

        swaggerDocs(app, port)

        await setupRoutes(app);

        app.get('/', (req: Request, res: Response) => {
            res.send(`Server Running...`)
        })

        // Client Error Handling
        app.use((req: Request, res: Response, next: NextFunction) => {
            next(createError(404, 'Route not found'));
        })

        //Server error handleing..
        app.use((err: any, req: Request, res: Response, next: NextFunction) => {
            // console.error(err.status);
            return res.status(err.status).json({
                success: false,
                message: err.message,
                data: err
            });
        });

        await connectToDatabase()

        app.listen(port, () => {
            console.log(`Server is running ${process.env.NODE_ENV} on port: ${port}`)
        })

    } catch (error) {
        console.log(error);
    }
}

bootstrapApp()