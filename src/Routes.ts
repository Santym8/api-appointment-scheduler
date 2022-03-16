import express from 'express';

import UserRoutes from './modules/UserModule/Routes';
export class Routes {
    public static addRoutes(app: express.Application) {
        //add your rutes here
        app.use('/api/user', UserRoutes)
    }
} 