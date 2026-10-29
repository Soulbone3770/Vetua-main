import db from "../utils/db.js";
import type {ConsultaType} from '../types/ConsultaType.js';

export const insertConsulta = async(fecha_hora: Date, motivo_consulta: string, peso_en_consulta: number, temperatura: number, frecuencia_cardiaca: number, sintomas: string, diagnostico: string, tratamiento_indicado: string, observaciones: string, costo: number, id_mascota: number, id_veterinario: number, id_cliente: number, id_clinica: number) => {

    const sqlInsert = "INSERT INTO consultas(fecha_hora, motivo_consulta, peso_en_consulta, temperatura, frecuencia_cardiaca, sintomas, diagnostico, tratamiento_indicado, observaciones, costo, id_mascota, id_veterinario, id_cliente, id_clinica) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    await db.query(sqlInsert, [fecha_hora, motivo_consulta, peso_en_consulta, temperatura, frecuencia_cardiaca, sintomas, diagnostico, tratamiento_indicado, observaciones, costo, id_mascota, id_veterinario, id_cliente, id_clinica]);

};

export const selectConsultaByVeterinarios = async(veterinarioId: number, clinicaId: number) => {

    const sqlSelect = "SELECT * FROM consultas WHERE id_veterinario = ? AND id_clinica = ?";

    const[resultSelect] = await db.query<ConsultaType[]>(sqlSelect, [veterinarioId, clinicaId]);

    return resultSelect[0];

};

export const selectConsultasByVetId = async(veterinarioId: number) => {

    const sqlSelect = "SELECT * FROM consultas WHERE id_veterinario = ?";

    const[resultSelect] = await db.query<ConsultaType[]>(sqlSelect, [veterinarioId]);

    return resultSelect;

}

export const selectConsultaByIdAndVetId = async(consultaId: number, veterinarioId: number) => {

    const sqlSelect = "SELECT * FROM consultas WHERE id = ? AND id_veterinario = ?";

    const[resultSelect] = await db.query<ConsultaType[]>(sqlSelect, [consultaId, veterinarioId]);

    return resultSelect[0];

};