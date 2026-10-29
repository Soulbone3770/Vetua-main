import React from "react";

//Interfaz que define el tipo de los hijos de la ruta protegida y del provider de la sesión
export interface ChildrenType{
    children: React.ReactNode
    rolesPermitidos?: string[];
}