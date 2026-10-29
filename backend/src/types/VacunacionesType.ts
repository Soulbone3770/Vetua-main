import type {RowDataPacket} from "mysql2";

export interface VacunacionesType extends RowDataPacket{
    id: number;
    fecha_aplicacion: string;
    proxima_dosis: string;
    mascota_id: number;
    vacuna_id: number;
}