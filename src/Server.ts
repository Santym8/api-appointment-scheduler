import express from 'express';
import dotenv from 'dotenv';
import { DataBase } from './DataBase';
import { Middlewares } from './Middlewares';
import { Routes } from './Routes';

class Server{
    private app: express.Application;
    
    constructor(){
        this.app = express();
        this.config();
    }

    private config(){
        dotenv.config(); //Create a .env file
        this.app.set('port', process.env.PORT || 5000);
        Middlewares.addMiddlewares(this.app);
        DataBase.configDataBase();
        Routes.addRoutes(this.app);
    }

    public start() {
        let port = this.app.get('port');
        this.app.listen(port, () => console.log('Server on port ', port))
    }
}

const server = new Server();
server.start();