import { createContext } from 'react';
import type {ClinicaUserType} from "../types/ClinicaUserType.ts";

//Interfaz con los componentes de los datos de la sesión
interface AuthContextType{
    autenticado: boolean;
    usuario: ClinicaUserType | null;
    rol: string;
    authCheck: () => Promise<void>;
}

//Constante que crea un cotext para almacenar datos de sesión
const authContext = createContext<AuthContextType | undefined>(undefined);

export default authContext;