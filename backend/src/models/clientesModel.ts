import type {TipoDocumentoType} from "../types/TipoDocumentoType.js";
import type { ClienteType } from '../types/ClienteType.js';
import db from "../utils/db.js";

export const selectClienteByDocumento = async(num_documento: string, tipo_documento: TipoDocumentoType) => {

    const sqlSelect = "SELECT * FROM clientes WHERE num_documento = ? AND tipo_documento = ?";

    const[resultSelect] = await db.query<ClienteType[]>(sqlSelect, [num_documento, tipo_documento]);

    return resultSelect[0];
};

export const insertCliente = async(nombres: string, apellidos: string, fecha_nacimiento: Date, tipo_documento: TipoDocumentoType, num_documento: string, sexo: string, telefono: string, correo: string, direccion: string, ciudad: string, departamento: string) => {

    const sqlInsert = "INSERT INTO clientes(nombres, apellidos, fecha_nacimiento, tipo_documento, num_documento, sexo, telefono, correo, direccion, ciudad, departamento) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    await db.query(sqlInsert, [nombres, apellidos, fecha_nacimiento, tipo_documento, num_documento, sexo, telefono, correo, direccion, ciudad, departamento]);

};

export const selectClientes = async() => {

    const sqlSelect = "SELECT * FROM clientes";

    const[resultSelect] = await db.query<ClienteType[]>(sqlSelect);

    return resultSelect;

};

export const selectClienteById = async(id: number) => {

    const sqlSelect = "SELECT * FROM clientes WHERE id = ?";

    const[resultSelect] = await db.query<ClienteType[]>(sqlSelect, [id]);

    return resultSelect[0];

}

export const selectIdClienteByDocumento = async(tipo_documento: TipoDocumentoType, num_documento: string) => {

    const sqlSelect = "SELECT id FROM clientes WHERE tipo_documento = ? AND num_documento = ?";

    const[resultSelect] = await db.query<ClienteType[]>(sqlSelect, [tipo_documento, num_documento]);

    return resultSelect[0];

};

export const updateClienteById = async(id: number, nombres: string, apellidos: string, telefono: string, correo: string, direccion: string, ciudad: string, departamento: string) => {

    const sqlUpdate = "UPDATE clientes SET nombres = ?, apellidos = ?, telefono = ?, correo = ?, direccion = ?, ciudad = ?, departamento = ? WHERE id = ?";

    await db.query(sqlUpdate, [nombres, apellidos, telefono, correo, direccion, ciudad, departamento, id]);

}

export const deleteClienteById = async(id: number) => {

    const sqlDelete = "DELETE FROM clientes WHERE id = ?";

    await db.query(sqlDelete, [id]);

}