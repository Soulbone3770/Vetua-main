import db from "../utils/db.js";
import type {EstadosCitaType} from "../types/EstadosCitaType.js";
import type {CitasType} from "../types/CitasType.js";

export const insertCita = async(fecha_hora: Date, propietario_tipo_documento: string, propietario_num_documento: string, motivo: string, estado: EstadosCitaType, notas: string, mascotaId: number, clinicaId: number, veterinarioId: number) => {

    const sqlInsert = "INSERT INTO citas(fecha_hora, propietario_tipo_documento, propietario_num_documento, motivo, estado, notas, mascotaId, clinicaId, veterinarioId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

    await db.query(sqlInsert, [fecha_hora, propietario_tipo_documento, propietario_num_documento, motivo, estado, notas, mascotaId, clinicaId, veterinarioId]);

    //Convertir nombreMascota a mascotaId y nombreVeterinario a veterinarioId
};

export const selectCitasCliente = async(propietarioTipoDocumento: string, propietarioNumDocumento: string) => {

    const sqlSelect = "SELECT * from citas WHERE propietario_tipo_documento = ? AND propietario_num_documento = ?";

    const[resultSelect] = await db.query<CitasType[]>(sqlSelect, [propietarioTipoDocumento, propietarioNumDocumento]);

    return resultSelect;

};

export const selectAllCitasManana = async() => {

    const sqlSelect = "SELECT * FROM citas WHERE fecha_hora >= CURDATE() + INTERVAL 1 DAY AND fecha_hora <  CURDATE() + INTERVAL 2 DAY";

    const[resultSelect] = await db.query<CitasType[]>(sqlSelect);

    return resultSelect;

};

export const selectAllCitas = async() => {

    const sqlSelect = "SELECT * FROM citas";

    const[resultSelect] = await db.query<CitasType[]>(sqlSelect);

    return resultSelect;

}

export const selectCitaById = async(id: number) => {

    const sqlSelect = "SELECT * FROM citas WHERE id = ?";

    const[resultSelect] = await db.query<CitasType[]>(sqlSelect, [id]);

    return resultSelect[0];

};

export const updateEstadoCita = async(id: number, estado: EstadosCitaType) => {

    const sqlUpdate = "UPDATE citas SET estado = ? WHERE id = ?";

    await db.query(sqlUpdate, [estado, id]);

};

export const updateFechaCita = async(id: number, fecha_hora: string) => {

    const sqlUpdate = "UPDATE citas SET fecha_hora = ? WHERE id = ?";

    await db.query(sqlUpdate, [fecha_hora, id]);

};