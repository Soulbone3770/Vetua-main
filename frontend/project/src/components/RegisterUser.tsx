import Input from "./Input.tsx";
import {ROLES, rolesObjeto} from "../types/Roles.ts";
import React from "react";
import type {RegisterUserType} from "../types/RegisterUserType.ts";

interface RegisterUserProps{
    onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
    valores: RegisterUserType;
    handleOnChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    mensaje: string;
}

const RegisterUser = ({onSubmit, valores, handleOnChange, mensaje}: RegisterUserProps) => {

    return (
        <div>
            <form onSubmit={onSubmit}>
                <Input type="text" name="username" label="Nombre de usuario" value={valores.username} onChange={handleOnChange} />
                <Input type="password" name="password" label="Contraseña" value={valores.password} onChange={handleOnChange} />
                <select name="rol" value={valores.rol} onChange={handleOnChange}>
                    <option>Selecciona una opción</option>
                    {ROLES.map(rol => (
                        <option key={rol} value={rolesObjeto[rol]}>{rol}</option>
                    ))}
                </select>
                <Input type="number" name="clinicaId" label="ID de la clinica" value={valores.clinicaId} onChange={handleOnChange} />
                {mensaje !== "" && <p>{mensaje}</p>}
                <button type="submit">Registrar</button>
            </form>
        </div>
    )
};

export default RegisterUser;