import type{ Request, Response } from 'express';
import { selectClienteByDocumento, insertCliente, selectClientes, selectClienteById, updateClienteById, deleteClienteById } from '../models/clientesModel.js';
import type { ClienteType } from '../types/ClienteType.js';
import type {TipoDocumentoType} from "../types/TipoDocumentoType.js";

export const registerClientes = async(req: Request, res: Response) => {
    try {

        const { nombres, apellidos, fecha_nacimiento, tipo_documento,
            num_documento, sexo, telefono, correo,
            direccion, ciudad, departamento } = req.body

        const cliente: ClienteType | undefined = await selectClienteByDocumento(num_documento, tipo_documento);

        if(cliente !== undefined){
            return res.json({
                mensaje: "El numero de documento ya se encuentra registrado en el sistema"
            });
        }

        await insertCliente(nombres, apellidos, fecha_nacimiento, tipo_documento, num_documento, sexo, telefono, correo, direccion, ciudad, departamento);

        res.json({
            ok: true,
            exito: "Usuario registrado exitosamente"
        });

    } catch(err) {

        console.error(err);

        res.status(500).json({
            ok: false,
            error: err
        });

    }
};

export const getClientes = async(req: Request, res: Response) => {
    try {

        const clientes: ClienteType[] | undefined = await selectClientes();

        if(clientes.length === 0){
            return res.json({
                mensaje: "No hay clientes registrados"
            });
        }

        res.json({
            ok: true,
            clientes: clientes
        });

    } catch(err) {

        console.error(err);

        res.status(500).json({
            ok: false,
            error: err
        });

    }
};

export const getClienteByParams = async(req: Request, res: Response) => {
    try {

        const clienteId = Number(req.params.clienteId);

        const cliente: ClienteType | undefined = await selectClienteById(clienteId);

        if(cliente === undefined){
            return res.status(400).json({
                mensaje: "Error, el cliente no existe"
            });
        }

        res.json({
            ok: true,
            cliente: cliente
        });

    } catch(err) {

        console.error(err);

        res.status(500).json({
            ok: false,
            error: err instanceof Error ? err.message : "Hubo un error al obtener el cliente"
        });

    }
}

export const getClienteByDocumento = async(req: Request, res: Response) => {

    const { clienteNumDocumento, clienteTipoDocumento } = req.query;

    if(!clienteNumDocumento || !clienteTipoDocumento){
        return res.json({
            mensaje: "Se debe especificar el número y tipo de documento"
        });
    }

    try {

        const cliente: ClienteType | undefined = await selectClienteByDocumento(clienteNumDocumento as string, clienteTipoDocumento as TipoDocumentoType);

        if(cliente === undefined){
            return res.json({
                mensaje: "No existe un cliente con ese número y tipo de documento"
            });
        }

        res.json({
            ok: true,
            cliente: cliente
        })

    } catch(err) {

        console.error(err);

        res.json({
            ok: false,
            error: err instanceof Error ? err.message : "Hubo un problema al obtener el cliente mediante su identificación"
        })

    }
};

//POSIBLE INCOMPLETO
export const updateClienteInformacion = async(req: Request, res: Response) => {

    const { id, nombres, apellidos, telefono, correo, direccion, ciudad, departamento } = req.body;

    try {

        await updateClienteById(id, nombres, apellidos, telefono, correo, direccion, ciudad, departamento );

        res.json({
            ok: true,
            exito: "Usuario actualizado correctamente"
        });

    } catch(err) {

        console.error(err);

        res.status(500).json({
            ok: false,
            error: err instanceof Error ? err.message : "Hubo un error al actualizar la información del cliente"
        });

    }
};

export const deleteCliente = async(req: Request, res: Response) => {

    const { id } = req.params

    const clienteId = Number(id);

    if(!clienteId){
        throw new Error("ERR_IDCLIENTE_TO_NUM");
    }

    try {

        await deleteClienteById(clienteId);

        res.json({
            ok: true,
            exito: "Cliente borrado correctamente"
        });

    } catch(err) {

        console.error(err);

        res.status(500).json({
            ok: false,
            error: err instanceof Error ? err.message : "Hubo un problema al eliminar el cliente"
        })

    }
};