import { insertConsulta, selectConsultaByVeterinarios, selectConsultasByVetId, selectConsultaByIdAndVetId } from '../models/consultasModel.js';
import type {ConsultaType} from '../types/ConsultaType.js';
import {selectClienteByDocumento} from "../models/clientesModel.js";
import {selectIdMascotaByNombreAndPropietario} from "../models/mascotasModel.js";
import type {Request, Response} from "express";
import type {ClienteType} from "../types/ClienteType.js";
import type {MascotaType} from "../types/MascotaType.js";

export const registerConsulta = async(req: Request, res: Response) => {

    const {fecha_hora, motivo_consulta, peso_en_consulta, temperatura, frecuencia_cardiaca,
        sintomas, diagnostico, tratamiento_indicado, observaciones, costo, nombre_mascota, cliente_tipo_documento, cliente_num_documento, id_veterinario, id_clinica} = req.body;

    try {

        const cliente: ClienteType | undefined = await selectClienteByDocumento(cliente_num_documento, cliente_tipo_documento);

        if(cliente === undefined){
            return res.json({
                ok: false,
                error: "Error, el cliente seleccionado no existe"
            });
        }

        const id_cliente = cliente.id;

        const mascota: MascotaType | undefined = await selectIdMascotaByNombreAndPropietario(nombre_mascota, id_cliente);

        if(mascota === undefined){
            return res.json({
                ok: false,
                error: "Error, la mascota seleccionada no existe"
            });
        }

        const id_mascota = mascota.id;

        await insertConsulta(fecha_hora, motivo_consulta, peso_en_consulta, temperatura, frecuencia_cardiaca, sintomas, diagnostico, tratamiento_indicado, observaciones, costo, id_mascota, id_veterinario, id_cliente, id_clinica);

        res.json({
            ok: true,
            exito: "Registro medico exitoso"
        });

    } catch(err) {

        console.error(err);

        res.status(500).json({
            ok: false,
            error: err instanceof Error ? err.message : "Hubo un prolema al hacer la nueva consulta"
        });

    }
};

export const getConsultas = async(req: Request, res: Response) => {

    const { veterinarioId } = req.query

    const vetId = Number(veterinarioId);

    try {

        const consultas: ConsultaType[] = await selectConsultasByVetId(vetId);

        if(consultas.length === 0){
            return res.json({
                vacio: true,
                mensaje: "No hay consultas registradas"
            });
        }

        res.json({
            ok: true,
            consultas: consultas
        });

    } catch(err) {

        console.error(err);

        res.status(500).json({
            ok: false,
            error: err instanceof Error ? err.message : "Hubo un problema obteniendo las consultas"
        });

    }
};

export const getConsultaByQuery = async(req: Request, res: Response) => {

    const { veterinarioId, clinicaId } = req.query

    const vetId = Number(veterinarioId);
    const cliId = Number(clinicaId);

    try {

        const consulta: ConsultaType | undefined = await selectConsultaByVeterinarios(vetId, cliId);

        if(consulta === undefined){
            return res.json({
                vacio: true,
                mensaje: "No existe la consulta solicitada"
            });
        }

        res.json({
            ok: true,
            consulta: consulta
        });

    } catch(err) {

        console.error(err);

        res.status(500).json({
            ok: false,
            error: err instanceof Error ? err.message : "Ha ocurrido un problema al obtener las consulta por query"
        });

    }
};

export const getConsultaByIdParams = async(req: Request, res: Response) => {

    const { consultaId, veterinarioId } = req.params;

    const consId = Number(consultaId);
    const vetId = Number(veterinarioId);

    try {

        const consulta: ConsultaType | undefined = await selectConsultaByIdAndVetId(consId, vetId);

        if(consulta === undefined){
            return res.status(400).json({
                mensaje: "No se encontro la consulta seleccionada"
            })
        }

        res.json({
            ok: true,
            consulta: consulta
        });

    } catch(err) {

        console.error(err);

        res.json({
            ok: false,
            error: err instanceof Error ? err.message : "Hubo un problema al obtener la consulta por su id"
        })

    }

}