import React from "react";
import Input from "./Input.tsx";
import type {RegisterUserType} from "../types/RegisterUserType.ts";
import { ROLESADMINCLINICA, rolesObjeto} from "../types/Roles.ts";
import { SelectField, BOTON_PRINCIPAL } from "./FormUI.tsx";

interface RegisterUserProps{
    onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
    valores: RegisterUserType;
    handleOnChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    mensaje: string;
}

const RegisterUserByAdminClinica = ({onSubmit, valores, handleOnChange, mensaje}: RegisterUserProps) => {

    return (
        <form onSubmit={onSubmit}>
            <Input label="Nombre de usuario" type="text"  name="username" value={valores.username} onChange={handleOnChange} />
            <Input label="Contraseña" type="password"  name="password" value={valores.password} onChange={handleOnChange} />
            <SelectField name="rol" label="Rol" value={valores.rol} onChange={handleOnChange}>
                <option value="">Selecciona una opción</option>
                {ROLESADMINCLINICA.map(rol => (
                    <option key={rol} value={rolesObjeto[rol]}>{rol}</option>
                ))}
            </SelectField>
            {mensaje !== "" && <p className="mb-4 text-sm font-medium text-red-500">{mensaje}</p>}
            <button type="submit" className={BOTON_PRINCIPAL}>Registrar usuario →</button>
        </form>
    )
}

export default RegisterUserByAdminClinica;