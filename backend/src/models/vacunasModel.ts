import db from "../utils/db.js";
import type {VacunasType} from "../types/VacunasType.js";
import type {VacunacionesType} from "../types/VacunacionesType.js";


export const insertVacunacion = async(fecha_aplicacion: string, proxima_dosis: string, mascota_id: number, vacuna_id: number) => {

    const sqlInsert = "INSERT INTO vacunaciones(fecha_aplicacion, proxima_dosis, mascota_id, vacuna_id) VALUES (?, ?, ?, ?)";

    await db.query(sqlInsert, [fecha_aplicacion, proxima_dosis, mascota_id, vacuna_id]);

}

export const selectVacunas = async() => {

    const sqlSelect = "SELECT * FROM vacunas";

    const[resultSelect] = await db.query<VacunasType[]>(sqlSelect);

    return resultSelect;

}

export const selectVacunacion = async(mascota_id: number, vacuna_id: number) => {

    const sqlSelect = "SELECT * FROM vacunaciones WHERE mascota_id = ? AND vacuna_id = ?";

    const[resultSelect] = await db.query<VacunacionesType[]>(sqlSelect, [mascota_id, vacuna_id]);

    return resultSelect[0];

};