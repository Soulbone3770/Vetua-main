//Array que define los roles del sistema
export const ROLES = ["Administrador del sistema", "Administrador de una clinica", "Recepcionista", "Veterinario"];

//Hacemos un objeto que convierte el texto que ve el usuario al valor real que utilizamos en el backend
export const rolesObjeto = {
    "Administrador del sistema": "adminSistema",
    "Administrador de una clinica": "adminClinica",
    "Recepcionista": "recepcionista",
    "Veterinario": "veterinario"
} as Record<string, string>;

export type RolesType = "adminSistema" | "adminClinica" | "recepcionista" | "veterinario"

export const ROLESADMINCLINICA = ["Administrador de una clinica", "Recepcionista", "Veterinario"];