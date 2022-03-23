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
        //-------------------Doctor------------------
        this.router.post('/create-shift', Middlewares.isDoctorToken, Middlewares.validateFieldsCreateShift, Controllers.createShift);
        this.router.delete('/delete-shift', Middlewares.isDoctorToken, Middlewares.validateFieldsShiftId, Controllers.deleteShift);
        this.router.put('/change-status', Middlewares.isDoctorToken, Middlewares.validateFieldsShiftId, Controllers.changeStatus);
        this.router.get('/get-shifts', Middlewares.isDoctorToken, Middlewares.validateFieldGetShifts, Controllers.getShifts);
        //-------------------Patient---------------
        this.router.get('/get-available-shifts', Middlewares.isPatientToken, Middlewares.validateFieldGetShifts, Controllers.getAvailableShifts);
        this.router.get('/get-my-appointments', Middlewares.isPatientToken, Middlewares.validateFieldGetShifts, Controllers.getMyAppointments);
        this.router.put('/schedule-appointment', Middlewares.isPatientToken, Middlewares.validateFieldsShiftId, Controllers.scheduleAppointment);
        this.router.put('/cancel-appointment', Middlewares.isPatientToken, Middlewares.validateFieldsShiftId, Controllers.cancelAppointment);
    }
}

export default new Routes().router;
