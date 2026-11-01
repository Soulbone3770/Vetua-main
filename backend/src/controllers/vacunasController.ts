import {insertVacunacion, selectVacunas, selectVacunacion} from '../models/vacunasModel.js';
import type {Request, Response} from "express";
import type {VacunasType} from "../types/VacunasType.js";
import type {VacunacionesType} from "../types/VacunacionesType.js";

export const createVacunacion = async(req: Request, res: Response) => {

    const { fecha_aplicacion, proxima_dosis, mascota_id, vacuna_id } = req.body;
    const today = new Date()

    try {

        const vacunacion: VacunacionesType | undefined = await selectVacunacion(mascota_id, vacuna_id);

        if(vacunacion !== undefined) {
            const proxima = new Date(vacunacion.proxima_dosis);
            if (proxima > today) {
                return res.json({
                    mensaje: "Esta mascota ya tiene esta vacuna y no ha pasado la fecha para la ultima dosis"
                });
            }
        }


        await insertVacunacion(fecha_aplicacion, proxima_dosis, mascota_id, vacuna_id);

        res.json({
            ok: true,
            exito: "Vacunacion creada correctamente"
        });

    } catch(err) {

        console.error(err);

        res.status(500).json({
            ok: false,
            error: err instanceof Error ? err.message : "Hubo un error al insertar la vacunacion"
        });

    }
};

export const getVacunas = async(req: Request, res: Response) => {

    try {

        const vacunas: VacunasType[] = await selectVacunas();

        if(vacunas.length === 0){
            return res.json({
                mensaje: "No hay vacunas"
            });
        }

        res.json({
            ok: true,
            vacunas: vacunas
        });

    } catch(err){

        console.error(err);

        res.status(500).json({
            ok: false,
            error: err instanceof Error ? err.message : "Hubo un problema al obtener las vacunas"
        })

    }
};