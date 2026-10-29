
export interface ClinicaType{
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