import express from 'express';

import UserRoutes from './modules/UserModule/Routes';
import AppointmentSchedulerRourtes from './modules/AppointmentSchedulerModule/Routes';

export class Routes {
    public static addRoutes(app: express.Application) {
        //add your rutes here
        app.use('/api/user', UserRoutes);
        app.use('/api/appointment-scheduler', AppointmentSchedulerRourtes);
    }
} 