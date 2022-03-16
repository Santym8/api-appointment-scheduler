import { Router, Request, Response } from "express";
import Controllers from './Controllers'
import Middlewares from './Middleware'
import { body, validationResult } from 'express-validator';

class Routes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.addRoutes();
    }

    private addRoutes() {
        this.router.post('/sing-up', Middlewares.validateSingUp, Controllers.singUpPatient);
        this.router.get('/log-in', Middlewares.validateLogIn, Controllers.logIn);

    }
}

export default new Routes().router;