import type { RowDataPacket } from 'mysql2';
import type { RolType } from './RolType.js';

export interface UserType extends RowDataPacket{
    id: number;
    username: string;
    password: string;
    rol: RolType;
    clinicaId: number;
    created_at: Date;
}

export interface UserClinicaType extends UserType{
    nombreClinica: string;
    urlCLinica: string;
}