import {insertClinica, selectClinicaByName, selectCountEstadisticas} from "../models/clinicasModel.js";
import type {ClinicaType} from "../types/ClinicaType.js";
import type{Request, Response} from "express";
import type {EstadisticasType} from "../types/EstadisticasType.js";

export const registerClinica = async(req: Request, res: Response) => {
    try {

        const { nombre, nit, telefono, correo, direccion, ciudad, departamento, estado, logo_url } = req.body;

        const clinica: ClinicaType | undefined = await selectClinicaByName(nombre);

        if(clinica !== undefined){
            return res.json({
                mensaje: "El nombre de la clinica ya esta registrado"
            });
        }

        await insertClinica(nombre, nit, telefono, correo, direccion, ciudad, departamento, estado, logo_url);

        res.json({
            ok:true,
            exito: "Clinica registrada correctamente"
        })

    } catch(err) {

        console.error(err);

        res.status(500).json({
            ok: false,
            error: err instanceof Error ? err.message : "Hubo un error al registrar la clínica"
        });

    }
};

export const getEstadisticas = async(req: Request, res: Response) => {

    const { id } = req.params;

    const clinicaId = Number(id);

    if(!clinicaId){
        throw new Error("ERR_IDCLINICA_TO_NUM");
    }

    try {

        const estadisticas: EstadisticasType | undefined = await selectCountEstadisticas(clinicaId);

        if(estadisticas === undefined){
            return res.json({
                mensaje: "No hay estadisticas"
            });
        }

        res.json({
            ok: true,
            estadisticas: estadisticas
        });

    } catch(err) {

        console.error(err);

        res.status(500).json({
            ok: false,
            error: err instanceof Error ? err.message : "Hubo un error al obtener las estadisticas de la clinica"
        });

    }
};