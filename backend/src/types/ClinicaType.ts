import type { RowDataPacket } from 'mysql2';

export interface ClinicaType extends RowDataPacket{
    id: number;
    nombre: string;
    nit: string;
    telefono: string;
    correo: string;
    direccion: string;
    ciudad: string;
    departamento: string;
    fecha_registro: Date;
    estado: boolean;
    logo_url?: string;
}