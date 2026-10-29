import type { ClinicaType } from '../types/ClinicaType.js';
import type {EstadisticasType} from "../types/EstadisticasType.js";
import db from '../utils/db.js';

export const selectClinicaByName = async(nombre: string) => {

    const sqlSelect = "SELECT * from clinicas WHERE nombre = ?";

    const[resultSelect] = await db.query<ClinicaType[]>(sqlSelect, [nombre]);

    return resultSelect[0];

};

export const insertClinica = async(nombre: string, nit: string, telefono: string, correo: string, direccion: string, ciudad: string, departamento: string, estado: boolean, logo_url: string) => {

    const sqlInsert = "INSERT INTO clinicas(nombre, nit, telefono, correo, direccion, ciudad, departamento, estado, logo_url) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)";

    await db.query(sqlInsert, [nombre, nit, telefono, correo, direccion, ciudad, departamento, estado, logo_url]);

};

export const selectCountEstadisticas = async(id: number) => {

    const sqlSelect = "SELECT (SELECT COUNT(*) FROM mascotas WHERE clinicaId = ?) AS totalMascotas, (SELECT COUNT(*) FROM citas WHERE clinicaId = ?) AS totalCitas ";

    const[resultSelect] = await db.query<EstadisticasType[]>(sqlSelect, [id, id]);

    return resultSelect[0];

}