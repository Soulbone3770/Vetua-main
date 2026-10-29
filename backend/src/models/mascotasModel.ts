import db from "../utils/db.js";
import type {MascotaType} from "../types/MascotaType.js";

export const insertMascota = async(nombre: string, especie: string, raza: string, sexo: string, fecha_nacimiento: Date, peso: number, foto_url: string, propietarioId: number, clinicaId: number) => {

    const sqlInsert = "INSERT INTO mascotas(nombre, especie, raza, sexo, fecha_nacimiento, peso, foto_url, propietarioId, clinicaId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

    await db.query(sqlInsert, [nombre,especie, raza, sexo, fecha_nacimiento, peso, foto_url, propietarioId, clinicaId]);

};

export const selectMascotaByNombreAndPropietario = async(nombre: string, propietatarioId: number) => {

    const sqlSelect = "SELECT * FROM mascotas WHERE nombre = ? AND propietarioId = ?";

    const[resultSelect] = await db.query<MascotaType[]>(sqlSelect, [nombre, propietatarioId]);

    return resultSelect[0];
}

export const selectMasctaByPropietario = async(propietarioId: number) => {

    const sqlSelect = "SELECT * FROM mascotas WHERE propietarioId = ?"

    const[resultSelect] = await db.query<MascotaType[]>(sqlSelect, [propietarioId]);

    return resultSelect

};

export const selectIdMascotaByNombreAndPropietario = async(nombre: string, propietarioId: number) => {

    const sqlSelect = "SELECT id FROM mascotas WHERE nombre = ? AND propietarioId = ?";

    const[resultSelect] = await db.query<MascotaType[]>(sqlSelect, [nombre, propietarioId]);

    return resultSelect[0]

};

export const selectMascotaById = async(id: number) => {

    const sqlSelect = "SELECT * FROM mascotas WHERE id = ?";

    const[resultSelect] = await db.query<MascotaType[]>(sqlSelect, [id]);

    return resultSelect[0];

};

export const updateMascota = async(nombre: string, especie: string, raza: string, sexo: string, peso: string, id: number) => {

    const sqlUpdate = "UPDATE mascotas SET nombre = ?, especie = ?, raza = ?, sexo = ?, peso = ? WHERE id = ?";

    await db.query(sqlUpdate, [nombre, especie, raza, sexo, peso, id]);

};

export const deleteMascotaById = async(id: number) => {

    const sqlDelete = "DELETE FROM mascotas WHERE id = ?";

    await db.query(sqlDelete, [id]);

};