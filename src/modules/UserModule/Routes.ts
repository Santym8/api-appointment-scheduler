import { Router } from "express";
import Controllers from './Controllers'
import Middlewares from './Middleware'


class Routes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.addRoutes();
    }

    private addRoutes() {
        this.router.post('/sing-up', Middlewares.validateFieldsSingUp, Controllers.singUpPatient);
        this.router.get('/log-in', Middlewares.validateFieldsLogIn, Controllers.logIn);
        //-------------User Token-------------
        this.router.get('/', Middlewares.isUserToken, Controllers.getUser);
        this.router.put('/rename', Middlewares.isUserToken, Middlewares.validateFieldsRename, Controllers.renameUser);
        this.router.put('/change-password', Middlewares.isUserToken, Middlewares.validateFieldsChangePassword, Controllers.changePassword);
        this.router.put('/change-email', Middlewares.isUserToken, Middlewares.validateFieldsChangeEmail, Controllers.changeEmail);
        //-------------Admin token--------------
        
    }
}

export default new Routes().router;