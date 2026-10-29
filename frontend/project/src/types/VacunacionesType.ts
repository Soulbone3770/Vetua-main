
export interface VacunacionesType{
    id: number;
    fecha_aplicacion: string;
    proxima_dosis: string;
    mascota_id: number;
    vacuna_id: number;
}

export type VacunacionesInputType = Omit<VacunacionesType, "id">;