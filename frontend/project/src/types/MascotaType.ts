import type {SexoMascotaType} from "./SexoType.ts";

export interface MascotaType{
    id: number;
    nombre: string;
    especie: string;
    raza: string;
    sexo: SexoMascotaType;
    fecha_nacimiento: string;
    peso: number;
    foto_url: string;
    propietarioId: number;
    created_at: string;
}
