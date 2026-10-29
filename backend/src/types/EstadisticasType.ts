import type {RowDataPacket} from "mysql2";

export interface EstadisticasType extends RowDataPacket{
    totalMascotas: number,
    totalcitas: number
}