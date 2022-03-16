import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
export class Middlewares {

    public static addMiddlewares(app: express.Application) {
        //Add your Middlewares here
        app.use(helmet());
        app.use(cors());
        app.use(morgan('dev'));
        app.use(express.json())
        app.use(compression());
    }
}
