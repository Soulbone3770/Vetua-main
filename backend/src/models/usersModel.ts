import db from '../utils/db.js';
import type { RolType } from '../types/RolType.js';
import type { UserType, UserClinicaType } from '../types/UserType.js';

export const insertUser = async(username: string, password: string, rol: RolType, clinicaId: number) => {

    const sqlInsert = "INSERT INTO clinica_users(username, password, rol, clinicaId) VALUES(?, ?, ?, ?)";

    await db.query(sqlInsert, [username, password, rol, clinicaId]);

};

export const selectUserByUsername = async(username: string, clinicaId: number) => {

    const sqlSelect = "SELECT * FROM clinica_users WHERE username = ? AND clinicaId = ?";

    const[resultSelect] = await db.query<UserType[]>(sqlSelect, [username, clinicaId]);

    return resultSelect[0];

};

export const selectUserByUsernameAndRol = async(username: string, rol: RolType, clinicaId: number) => {

    const sqlSelect = "SELECT * FROM clinica_users WHERE username = ? AND rol = ? AND clinicaId = ?";

    const[resultSelect] = await db.query<UserType[]>(sqlSelect, [username, rol, clinicaId]);

    return resultSelect[0];
};

export const selectUserById = async(userId: number) => {

    const sqlSelect = "SELECT u.*, c.nombre AS nombreClinica, c.logo_url AS urlClinica  FROM clinica_users u JOIN clinicas c ON c.id = u.clinicaId  WHERE u.id = ?";

    const[resultSelect] = await db.query<UserClinicaType[]>(sqlSelect, [userId]);

    return resultSelect[0];

};

export const selectVeterinariosDisponibles = async(clinicaId: number) => {

    const sqlSelect = "SELECT v.* FROM clinica_users v LEFT JOIN citas c ON c.veterinarioId = v.id AND c.clinicaId = v.clinicaId WHERE c.id IS NULL AND rol = 'veterinario' AND v.clinicaId = ? ";

    const[resultSelect] = await db.query<UserType[]>(sqlSelect, [clinicaId]);

    return resultSelect;

};

export const selectIdVeterinarioByNombreAndClinicaId = async(username: string, clinicaId: number) => {

    const sqlSelect = "SELECT * FROM clinica_users WHERE rol = 'veterinario' AND clinicaId = ? AND username = ? ";

    const[resultSelect] = await db.query<UserType[]>(sqlSelect, [clinicaId, username]);

    return resultSelect[0];

}