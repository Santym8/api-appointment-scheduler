import express from 'express';
export class Routes {
    public static addRoutes(app: express.Application) {
        //add your rutes here
        app.use('/', (req, res)=>res.send('Hello world'));
    }
} 