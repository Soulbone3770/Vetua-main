import type {Request, Response} from "express";
import {selectIdClienteByDocumento} from "../models/clientesModel.js";
import {selectIdMascotaByNombreAndPropietario} from "../models/mascotasModel.js";
import {selectIdVeterinarioByNombreAndClinicaId} from "../models/usersModel.js";
import {selectCitasCliente, selectAllCitasManana, selectAllCitas, selectCitaById, updateEstadoCita, updateFechaCita} from "../models/citasModel.js";
import {insertCita} from "../models/citasModel.js";
import type {ClienteType} from "../types/ClienteType.js";
import type {MascotaType} from "../types/MascotaType.js";
import type {UserType} from "../types/UserType.js";
import type {CitasType} from "../types/CitasType.js";

export const agendarCita = async (req: Request, res: Response) => {
    try {

        //Recibir datos
        const {
            fecha_hora, clienteTipoDocumento, clienteNumDocumento,
            motivo, estado, notas, nombreMascota, nombreVeterinario, clinicaId
        } = req.body;

        //Convertir documento en id
        const propietario: ClienteType | undefined = await selectIdClienteByDocumento(clienteTipoDocumento, clienteNumDocumento);

        if (propietario === undefined) {
            return res.json({
                mensaje: "No se encontro el propietario por su número de documento"
            });
        }

        const propietarioId = propietario.id;

        //obtener el id de la mascota
        const mascota: MascotaType | undefined = await selectIdMascotaByNombreAndPropietario(nombreMascota, propietarioId);

        if (mascota === undefined) {
            return res.json({
                mensaje: "No se encontro la mascota"
            });
        }

        const mascotaId = mascota.id;

        const veterinario: UserType | undefined = await selectIdVeterinarioByNombreAndClinicaId(nombreVeterinario, clinicaId);

        if (veterinario === undefined) {
            return res.json({
                mensaje: "No se encontro el veterinario"
            });
        }

        const veterinarioId = veterinario.id;

        await insertCita(fecha_hora, clienteTipoDocumento, clienteNumDocumento, motivo, estado, notas, mascotaId, clinicaId, veterinarioId);

        res.json({
            ok: true,
            exito: "Se ha programado la cita correctamente!"
        })

    } catch (err) {

        console.error(err);

        res.status(500).json({
            ok: false,
            error: err instanceof Error ? err.message : "Hubo un error al crear la cita"
        })

    }
};

export const getCitas = async (req: Request, res: Response) => {

    const {clienteTipoDocumento, clienteNumDocumento} = req.query;

    if (!clienteNumDocumento || !clienteTipoDocumento) {
        return res.json({
            mensaje: "Se debe especificar el tipo y numero de documento del cliente"
        });
    }
    try {

        const citas: CitasType[] = await selectCitasCliente(clienteTipoDocumento as string, clienteNumDocumento as string);

        if(citas.length > 0){
            const numCitas = citas.length;
            return res.json({
                ok: true,
                hayCitas: true,
                notificacion: `Atención, el cliente ya tiene ${numCitas} cita/s agendadas, presione continuar si desea agendar otra, cancelar si no`
            });
        }

        res.json({
            ok: true,
            hayCitas: false
        })


    } catch (err) {

        console.error(err);

        res.status(500).send({
            ok: false,
            error: err instanceof Error ? err.message : "Hubo un problema al obtener las citas programadas"
        })

    }
};

export const getCitasManana = async(req: Request, res: Response) => {

    try {

        const citas: CitasType[] = await selectAllCitasManana();

        if(citas.length === 0){
            return res.json({
                mensaje: "No hay citas programadas para mañana"
            });
        }

        res.json({
            ok: true,
            citas: citas
        });

    } catch(err) {

        console.error(err);

        res.status(500).send({
            ok: false,
            error: err instanceof Error ? err.message : "Hubo un error al obtener las citas de mañana"
        });

    }
}

export const getAllCitas = async(req: Request, res: Response) => {

    try {

        const citas: CitasType[] = await selectAllCitas();

        if(citas.length === 0){
            return res.json({
                mensaje: "No hay citas registradas"
            });
        }

        res.json({
            ok: true,
            citas: citas
        });

    } catch(err) {

        console.error(err);

        res.status(500).send({
            ok: false,
            error: err instanceof Error ? err.message : "Hubo un error al obtener las citas"
        });

    }
}

export const getCitaByParamsId = async(req: Request, res: Response) => {

    const { id } = req.params;

    const citaId = Number(id);

    if(!citaId){
        throw new Error("ERR_IDCITA_TO_NUM");
    }

    try {

        const cita: CitasType | undefined = await selectCitaById(citaId);

        if(cita === undefined){
            return res.json({
                mensaje: "No se encontro la cita seleccionada"
            });
        }

        res.json({
            ok: true,
            cita: cita
        });

    } catch(err) {

        console.error(err);

        res.status(500).send({
            ok: false,
            error: err instanceof Error ? err.message : "Hubo un error al obtener la cita por ID params"
        });

    }
};

export const changeEstadoCita = async(req: Request, res: Response) => {

    const { estado, id } = req.body;

    const citaId = Number(id);

    if(!citaId){
        throw new Error("ERR_IDCITA_TO_NUM");
    }

    try {

        await updateEstadoCita(citaId, estado);

        res.json({
            ok: true,
            exito: "Estado de la cita actualizado"
        })

    } catch(err){

        console.error(err);

        res.status(500).send({
            ok: false,
            error: err instanceof Error ? err.message : "Hubo un error al actualizar el estado de la cita"
        });


    }
};

export const reprogramarCita = async(req: Request, res: Response) => {

    const { fecha_hora, id } = req.body;

    const citaId = Number(id);

    if(!citaId){
        throw new Error("ERR_IDCITA_TO_NUM");
    }

    try {

        await updateFechaCita(citaId, fecha_hora);

        res.json({
            ok: true,
            exito: "Cita reprogramada exitosamente"
        });

    } catch(err) {

        console.error(err);

        res.status(500).send({
            ok: false,
            error: err instanceof Error ? err.message : "Hubo un error al reprogramar la cita"
        });

    }
};