import type {RolesType} from "./Roles.ts";

export interface ClinicaUserType{
    id: number;
    username: string;
    rol: RolesType;
    clinicaId: number;
    created_at: Date;
    nombreClinica: string;
    urlCLinica: string;
}

