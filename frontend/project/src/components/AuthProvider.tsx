import AuthContext from './AuthContext.tsx';
import type {UserDataType} from "../types/DataType.ts";
import {useEffect, useState} from "react";
import type {ChildrenType} from "../types/ChildrenType.ts";
import type {ClinicaUserType} from "../types/ClinicaUserType.ts";

// Si no existe VITE_API_URL en el .env del frontend, usa el backend local por defecto
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

//Función de provider para el context de la sesión
const AuthProvider = ({children}: ChildrenType) => {

    //Creamos useStates para la variable de verificación de autenticación del usuario y de su rol
    const[autenticado, setAutenticado] = useState(false);
    const[usuario, setUsuario] = useState<ClinicaUserType | null>(null);
    const[rol, setRol] = useState("");

    //Función que le pide al backend el estado de autenticación
    const authCheck = async() => {
        try {
            const res: Response = await fetch(`${API_URL}/users/api/authCheck`, {
                credentials: "include"
            });

            // Si el servidor no devolvió JSON (por ejemplo HTML), no rompemos la app
            const contentType = res.headers.get("content-type") || "";
            if (!contentType.includes("application/json")) {
                console.error(`authCheck: respuesta no JSON (status ${res.status}) desde ${API_URL}/users/api/authCheck`);
                setAutenticado(false);
                setUsuario(null);
                setRol("sin rol");
                return;
            }

            const data: UserDataType = await res.json();

            setAutenticado(data.autenticado ?? false);

            if(!data.userClinica){
                setUsuario(null);
                setRol("sin rol");
                return;
            }

            setUsuario(data.userClinica);
            setRol(data.userClinica.rol);
        } catch (error) {
            console.error("Error en authCheck:", error);
            setAutenticado(false);
            setUsuario(null);
            setRol("sin rol");
        }
    };

    useEffect(() => {
       
        authCheck();
    },[]);

    return (
        //Etiqueta de provider para el contexto, los elementos que esten dentro de esta etiqueta podrán utilizar
        //el contexto
        <AuthContext.Provider value={{autenticado, authCheck, rol, usuario}}>
            { children }
        </AuthContext.Provider>
    )
};

export default AuthProvider;