import type {ChildrenType} from "../types/ChildrenType.ts";
import AuthContext from "./AuthContext.tsx";
import {useContext} from "react";
import { Navigate} from "react-router-dom";

//Componente de ruta protegida, la cual recibe los hijos de la etiqueta(componentes a los que protege
//y un array de los roles que se permiten en esa ruta
const ProtectedRoute = ({children, rolesPermitidos}: ChildrenType) => {

    //Importe del contecto para obtener el rol del usuaro y el estado de autenticación del mismo
    const context = useContext(AuthContext);

    if(!context){
        throw new Error("El contexto no existe");
    }

    const { rol, autenticado } = context;

    //Si el usuario no esta autenticado lo llevamos al index y reemplazamos la página anterior
    if(!autenticado){
        return (
            <Navigate to="/" replace></Navigate>
        );
    }

    //Si el array rolesPermitidos y el rol del usuario existen y estos roles permitidos no incluyen el rol actual del usuario
    //Navegamos a la página de no autorizado
    if(rolesPermitidos && rol && !rolesPermitidos.includes(rol)){
        return (
            <Navigate to="/noAutorizado"></Navigate>
        );
    }

    //Si todo va bien redirigimos al usuario a la página protegida por el componente
    return children;

};

export default ProtectedRoute;