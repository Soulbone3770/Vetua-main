import type {ClinicaUserType} from "./ClinicaUserType.ts";
import type {ClienteType} from "./ClienteType.ts";
import type {MascotaType} from "./MascotaType.ts";
import type {ConsultasType} from "./ConsultasType.ts";
import type {CitasType} from "./CitasType.ts";
import type {VacunasType} from "./VacunasType.ts";
import type {EstadisticasType} from "./EstadisticasType.ts";

//Interfaz que define los datos que puede tener la respuesta enviada por el backend
export interface DataType{
    mensaje?: string;
    ok?: boolean;
    error?: string;
    exito?: string;
    autenticado?: boolean;
    rol?: string;
}

export interface UserDataType extends DataType{
    userClinica: ClinicaUserType;
}

export interface ClienteDataType extends DataType{
    clientes?: ClienteType[];
    cliente?: ClienteType;
}

export interface MascotasDataType extends DataType{
    mascotas: MascotaType[];
}

export interface MascotaDataType extends DataType{
    mascota: MascotaType;
}

export interface VeterinarioDataType extends DataType{
    veterinarios: ClinicaUserType[];
}

export interface ConsultaDataType extends DataType{
    consultas?: ConsultasType[];
    consulta?: ConsultasType;
    vacio?: boolean;
}

export interface CitasDataType extends DataType{
    citas: CitasType[];
}

export interface CitaDataType extends DataType{
    cita: CitasType;
}

export interface VacunasDataType extends DataType{
    vacunas: VacunasType[];
}

export interface EstadisticasDataType extends DataType{
    estadisticas: EstadisticasType;
}
