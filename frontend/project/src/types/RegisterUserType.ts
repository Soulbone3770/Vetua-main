import type {RolesType} from "./Roles.ts";

export interface RegisterUserType{
    username: string;
    password: string;
    rol: RolesType;
    clinicaId: number;
}