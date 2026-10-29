import type { DataType } from '../types/DataType.ts';
import { useNavigate } from 'react-router-dom';
import useAuth from "./useAuth.ts";

const API_URL = import.meta.env.VITE_API_URL;

//Función para cerrar sesión
const Logout = () => {

    const navigate = useNavigate();

    const { authCheck } = useAuth();

    //Función que le solicita al backend que limpie la cookie de sesión
    const logoutProcess = async() => {

        const res: Response = await fetch(`${API_URL}/users/api/logout`, {
            credentials: "include",
            method: "POST"
        });

        const data: DataType = await res.json();

        if(data.autenticado === false){
            alert("No esta autenticado");
            navigate("/noAutorizado", {replace: true});
        }

        if(!data.ok){
            alert("hubo un error");
            return
        } else if(data.exito){
            await authCheck();
            alert(data.exito);
            navigate("/", {replace: true});
        }

    };

    return { logoutProcess };

};

export default Logout;