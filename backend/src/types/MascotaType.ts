import type {RowDataPacket} from "mysql2";
import type { SexoMascotaType} from "./SexoType.js";

export interface MascotaType extends RowDataPacket{
    id: number;
    nombre: string;
    especie: string;
    raza: string;
    sexo: SexoMascotaType;
    fecha_nacimiento: Date;
    peso: number;
    foto_url: string;
    propietarioId: number;
    created_at: Date;
}