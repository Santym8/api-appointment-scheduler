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
        //-------------No token----------------
        this.router.post('/sing-up', Middlewares.validateFieldsSingUp, Controllers.singUpPatient);
        this.router.get('/log-in', Middlewares.validateFieldsLogIn, Controllers.logIn);
        //-------------User Token-------------
        this.router.get('/', Middlewares.isUserToken, Controllers.getUser);
        this.router.put('/rename', Middlewares.isUserToken, Middlewares.validateFieldsRename, Controllers.renameUser);
        this.router.put('/change-password', Middlewares.isUserToken, Middlewares.validateFieldsChangePassword, Controllers.changePassword);
        this.router.put('/change-email', Middlewares.isUserToken, Middlewares.validateFieldsChangeEmail, Controllers.changeEmail);
        //-------------User rol:Admin token--------------
        this.router.get('/get-all-users', Middlewares.isAdminToken, Controllers.getAllUsers);
        this.router.post('/create-doctor', Middlewares.isAdminToken, Middlewares.validateFieldsSingUp, Controllers.createDoctor);
        this.router.put('/enable-disable-user', Middlewares.isAdminToken, Middlewares.validateFieldsEnableDisableUser, Controllers.enableDisableUser);
    }
}

export default new Routes().router;