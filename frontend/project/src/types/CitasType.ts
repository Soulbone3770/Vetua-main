
export type EstadosCitaType = "pendiente" | "cancelada" | "cumplida";

export const ESTADOS = ["Pendiente", "Cancelada", "Cumplida"]

export const EstadosCita: Record<string, string> = {
    Pendiente: "pendiente",
    Cancelada: "cancelada",
    Cumplida: "cumplida"
};

export interface CitasType{
    id: number;
    fecha_hora: string;
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