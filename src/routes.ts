import { Express } from 'express';

module.exports.setupRoutes = async function (app: Express) {
    const categoryRoutes = require('./routers/Category')
    app.use('/api/category', categoryRoutes)
};