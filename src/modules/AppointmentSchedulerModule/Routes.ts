import { Router } from "express";
import { Controllers } from './Controllers';
import { Middlewares } from './Middlewares';
class Routes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.addRoutes();
    }

    private addRoutes() {
        this.router.post('/create-shift', Middlewares.isDoctorToken, Middlewares.validateFieldsCreateShift, Controllers.createShift);
        this.router.delete('/delete-shift', Middlewares.isDoctorToken, Middlewares.validateFieldsDeleteShift, Controllers.deleteShift);
    }
}

export default new Routes().router;
