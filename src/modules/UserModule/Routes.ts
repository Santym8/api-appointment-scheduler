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
        this.router.post('/sing-up', Middlewares.validateFieldsSingUp, Controllers.singUpPatient);
        this.router.get('/log-in', Middlewares.validateFieldsLogIn, Controllers.logIn);

        this.router.put('/rename', Middlewares.isUserToken, Middlewares.validateFieldRename, Controllers.renameUser);

    }
}

export default new Routes().router;