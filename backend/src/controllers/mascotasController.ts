import { insertMascota, selectMascotaByNombreAndPropietario, selectMasctaByPropietario, selectMascotaById, updateMascota, deleteMascotaById } from "../models/mascotasModel.js";
import {selectClienteByDocumento} from "../models/clientesModel.js";
import type {MascotaType} from "../types/MascotaType.js";
import type { Request, Response } from "express";
import type {ClienteType} from "../types/ClienteType.js";
import type {TipoDocumentoType} from "../types/TipoDocumentoType.js";

export const registerMascota = async(req: Request, res: Response) => {
    try{

        const { nombre, especie, raza, sexo, fecha_nacimiento, peso, foto_url, propietarioNumDocumento, propietarioTipoDocumento, clinicaId } = req.body;

        const propietario: ClienteType | undefined = await selectClienteByDocumento(propietarioNumDocumento, propietarioTipoDocumento);

        if(propietario === undefined){
            return res.json({
                mensaje: "El propietario con el número de documento seleccionado no existe"
            });
        }

        const propietarioId = propietario.id;

        const mascota: MascotaType | undefined = await selectMascotaByNombreAndPropietario(nombre, propietarioId);

        if(mascota !== undefined){
            return res.json({
                mensaje: "El propietario ya cuenta con una mascota con ese nombre"
            });
        }

        await insertMascota(nombre, especie, raza, sexo, fecha_nacimiento, peso, foto_url, propietarioId, clinicaId);

        res.json({
            ok: true,
            exito: "Mascota registrada correctamente al propietario seleccionado"
        })

    } catch(err) {

        console.error(err);

        res.status(500).json({
            ok: false,
            error: err instanceof Error ? err.message : "Hubo un error al registrar la mascota"
        });

    }
};

export const getMascota = async(req: Request, res: Response) => {

    const { clienteNumDocumento, clienteTipoDocumento } = req.query;

    if(!clienteNumDocumento || !clienteTipoDocumento){
        return res.json({
            mensaje: "Se debe especificar el número y tipo de documento del propietario"
        });
    }

    try {

        const cliente: ClienteType | undefined = await selectClienteByDocumento(clienteNumDocumento as string, clienteTipoDocumento as TipoDocumentoType );

        if(cliente === undefined){
            return res.json({
                mensaje: "No se encontro el cliente seleccionado"
            });
        }

        const propietarioId = cliente.id;

        const mascotas: MascotaType[] | undefined = await selectMasctaByPropietario(propietarioId);

        if(mascotas.length === 0){
            return res.json({
                mensaje: "El propietario no tiene mascotas registradas"
            });
        }

        res.json({
            ok: true,
            mascotas: mascotas
        });

    } catch(err) {

        console.error(err);

        res.status(500).json({
            ok: false,
            error: err instanceof Error ? err.message : "Hubo un problema al obtener la mascota"
        })

    }
};

export const getMascotaByParams = async(req: Request, res: Response) => {

    const { id } = req.params;

    const mascotaId = Number(id);

    if(!mascotaId){
        throw new Error("ERR_IDMASCOTA_TO_NUM");
    }

    try {

        const mascota: MascotaType | undefined = await selectMascotaById(mascotaId);

        if(mascota === undefined){
            return res.json({
                mensaje: "No se encontro la mascota"
            });
        }

        res.json({
            ok: true,
            mascota: mascota
        });

    } catch(err) {

        console.error(err);

        res.status(500).json({
            ok: false,
            error: err instanceof Error ? err.message : "Hubo un problema al obtener la mascota por params"
        })

    }
};

export const changeMascotaInformacion = async(req: Request, res: Response) => {

    const { nombre, especie, raza, sexo, peso, id} = req.body;

    try {

        await updateMascota(nombre, especie, raza, sexo, peso, id);

        res.json({
            ok: true,
            exito: "Informacion de la mascota actualizada correctamente"
        })

    } catch(err) {

        console.error(err);

        res.status(500).json({
            ok: false,
            error: err instanceof Error ? err.message : "Hubo un problema al modificar la informacion de la mascota"
        })


    }
};

export const deleteMascota = async(req: Request, res: Response) => {

    const { id } = req.params

    const mascotaId = Number(id);

    if(!mascotaId){
        throw new Error("ERR_IDMASCOTA_TO_NUM");
    }

    try {

        await deleteMascotaById(mascotaId);

        res.json({
            ok: true,
            exito: "Mascota borrada correctamente"
        });

    } catch(err) {

        console.error(err);

        res.status(500).json({
            ok: false,
            error: err instanceof Error ? err.message : "Hubo un problema al eliminar la mascota"
        })

    }
};
