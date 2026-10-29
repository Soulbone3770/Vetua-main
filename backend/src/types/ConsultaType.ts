import type {RowDataPacket} from "mysql2";

export interface ConsultaType extends RowDataPacket{
    id: number;
    fecha_hora: Date;
    motivo_consulta: string;
    peso_en_consulta: number;
    temperatura: number;
    frecuencia_cardiaca: number;
    sintomas: string;
    diagnostico: string;
    tratamiento_indicado: string;
    observaciones: string;
    costo: number;
    id_mascota: number;
    id_veterinario: number;
    id_cliente: number;
    id_clinica: number;
}