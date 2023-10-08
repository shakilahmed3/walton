import { Application, Router } from 'express';

module.exports.setupRoutes = async function (app: Application) {
    const categoryRoutes: Router = require('./routers/Category');

    app.use('/api/categories', categoryRoutes);
};
