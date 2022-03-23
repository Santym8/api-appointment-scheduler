import { Request, Response } from "express";
import { ShiftModel } from "./Models ";
import jwt from 'jsonwebtoken';
import { IUser } from "../UserModule/Interfaces/IUser";

export class Controllers {

    private static getIdToken(req: Request) {
        const token = req.headers['x-access-token']?.toString();
        if (token) {
            return jwt.verify(token, process.env.KEYWORD || '');
        }
        return null
    }

    //------------------------Doctor---------------------
    public static async createShift(req: Request, res: Response): Promise<void> {
        const { startDate } = req.body;
        const doctorId = Controllers.getIdToken(req);
        const shiftsOnTheDate = await ShiftModel.findOne({ startDate, doctorId });

        if (shiftsOnTheDate) {
            res.json({ errors: 'the shift on the date ' + startDate + ' already exists' });
        } else {
            const newShift = new ShiftModel({ doctorId, startDate });
            newShift.save()
                .then(() => {
                    res.json({ msg: 'shift created succesfully' });
                })
                .catch((err) => {
                    console.log(err);
                    res.json({ errors: 'Error' });
                })
        }
    }

    public static async deleteShift(req: Request, res: Response): Promise<void> {
        const { shiftId } = req.body;
        const doctorId = Controllers.getIdToken(req);

        const shift = await ShiftModel.findOne({ doctorId, _id: shiftId })
            .catch((err) => {
                console.log(err);
            })


        if (shift) {
            shift.delete();
            res.json({ msg: 'deletion successful' });
        } else {
            res.json({ errors: 'the shift does not exists' });
        }
    }

    public static async changeStatus(req: Request, res: Response): Promise<void> {
        const { shiftId } = req.body;
        const doctorId = Controllers.getIdToken(req);

        const shift = await ShiftModel.findOne({ _id: shiftId, doctorId })
            .catch((err) => {
                console.log(err);
            })


        if (shift) {
            if (shift.patientId != null) {
                shift.complete = !shift.complete;
                shift.save()
                    .then(() => {
                        res.json({ msg: 'status changed successfully' });
                    })
                    .catch((err) => {
                        res.json({ errors: 'error' });
                        console.log(err);
                    })

            } else {
                res.json({ errors: 'the shift does not have a patient' });
            }
        } else {
            res.json({ errors: 'the shift does not exists' });
        }
    }

    public static async getShifts(req: Request, res: Response): Promise<void> {
        const { startDate, endDate } = req.query;
        const doctorId = Controllers.getIdToken(req);

        const shifts = await ShiftModel.find({ doctorId, startDate: { $gte: startDate, $lt: endDate } })
            .populate('patientId')
            .catch((error) => {
                console.log(error);
                res.json({ errors: 'error' });
            })

        if (shifts) {
            let shiftsSend: any[] = [];
            for (let i = 0; i < shifts.length; i++) {
                let shift: any = {
                    _id: shifts[i].id,
                    startDate: shifts[i].startDate,
                    complete: shifts[i].complete,
                    patient: null
                }
                const patient = shifts[i].patientId as unknown as IUser;
                if (patient) {
                    shift['patient'] = {
                        firstName: patient.firstName,
                        lastName: patient.lastName,
                        email: patient.email
                    }
                }
                shiftsSend.push(shift);
            }
            res.json({ data: shiftsSend });
        } else {
            res.json({ msg: 'no shifts found' })
        }



    }
    
    //----------------------Patient-------------------
    public static async getAvailableShifts(req: Request, res: Response): Promise<void> {
        const { startDate, endDate } = req.query;

        const shifts = await ShiftModel.find(
            {
                startDate: { $gte: startDate, $lt: endDate },
                patientId: null
            })
            .populate('doctorId')
            .catch((err) => { console.log(err) })

        if (shifts) {
            let shiftsSend: any[] = [];
            for (let i = 0; i < shifts.length; i++) {
                const doctor = shifts[i].doctorId as unknown as IUser;
                shiftsSend.push({
                    _id: shifts[i].id,
                    startDate: shifts[i].startDate,
                    doctor: {
                        firstName: doctor.firstName,
                        lastName: doctor.lastName,
                        email: doctor.email
                    }
                });
            }
            res.json({ data: shiftsSend });
        }

    }

    public static async getMyAppointments(req: Request, res: Response): Promise<void> {
        const { startDate, endDate } = req.query;
        const patientId = Controllers.getIdToken(req);

        const shifts = await ShiftModel.find(
            {
                startDate: { $gte: startDate, $lt: endDate },
                patientId: patientId
            })
            .populate('doctorId')
            .catch((err) => { console.log(err) })

        if (shifts) {
            let shiftsSend: any[] = [];
            for (let i = 0; i < shifts.length; i++) {
                const doctor = shifts[i].doctorId as unknown as IUser;
                shiftsSend.push({
                    _id: shifts[i].id,
                    startDate: shifts[i].startDate,
                    doctor: {
                        firstName: doctor.firstName,
                        lastName: doctor.lastName,
                        email: doctor.email
                    }
                });
            }
            res.json({ data: shiftsSend });
        }


    }

    public static async scheduleAppointment(req: Request, res: Response): Promise<void> {
        const { shiftId } = req.body;
        const patientId = Controllers.getIdToken(req);
        const shift = await ShiftModel.findById(shiftId)
            .catch((err) => {
                console.log(err);
            })

        if (shift) {
            if (shift.patientId != null) res.json({ errors: 'the shift is already occupied by another patient' });
            else {
                shift.patientId = patientId as string;
                shift.save()
                    .then(() => res.send({ msg: 'the scheduling was successful' }))
                    .catch((err) => {
                        console.log(err);
                        res.json({ errors: 'error' });
                    })
            }
        } else {
            res.json({ errors: 'the shift does not exists' });
        }
    }

    public static async cancelAppointment(req: Request, res: Response): Promise<void> {
        const { shiftId } = req.body;
        const patientId = Controllers.getIdToken(req);

        const shift = await ShiftModel.findOne({ _id: shiftId, patientId }).
            catch((err) => console.log(err))

        if (shift) {
            shift.patientId = null as unknown as string;
            shift.save()
                .then(() => res.json({ msg: 'successful cancellation' }))
                .catch((err) => {
                    console.log(err);
                    res.json({ errors: 'error' })
                })
        }
        else {
            res.json({ errors: 'the shift does not exists' })
        }
    }


}