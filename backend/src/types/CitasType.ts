import type{RowDataPacket} from "mysql2";
import type {EstadosCitaType} from "./EstadosCitaType.js";

export interface CitasType extends RowDataPacket{
    id: number;
    fecha_hora: Date;
    propietario_num_documento: string;
    motivo: string;
    estado: EstadosCitaType;
    notas: string;
    created_at: Date;
    updated_at: Date;
    mascotaId: number;
    clinicaId: number;
    veterinarioId: number;
}