import type {RowDataPacket} from "mysql2";

export interface VacunasType extends RowDataPacket{
    id: number;
    nombre: string;
    dosis: string;
    frecuencia: string;
    descripcion: string;
}