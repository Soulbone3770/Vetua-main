
import useForm from "../hooks/useForm.ts";
import React, {useState} from "react";
import type {DataType} from "../types/DataType.ts";
import Logout from '../hooks/Logout.ts';
import type {RolesType} from "../types/Roles.ts";
import Input from "../components/Input.tsx";

import RegisterUser from "../components/RegisterUser.tsx";

const API_URL = import.meta.env.VITE_API_URL;

const AdminPage = () => {

    //Hacer la ruta y metodos para registrar clinicas

    //Impoorte de la funcion useForm y del proceso para cerrar sesión
    const { valores: valoresUsuario, handleOnChange: handleOnChangeUsuario, resetForm: resetFormUsuario } = useForm({"username": "", "password": "", "rol": "" as RolesType, "clinicaId": 0});
    const { valores: valoresClinica, handleOnChange: handleOnChangeClinica, resetForm: resetFormClinica } = useForm({"nombre": "", "nit": "", "telefono": "", "correo": "", "direccion": "", "ciudad": "", "departamento": "", "estado": true, "logo_url": ""});
    const { logoutProcess } = Logout();

    const[mensajeUsuario, setMensajeUsuario] = useState("");
    const[mensajeClinica, setMensajeClinica] = useState("");

    //Proceso para registrar un usuario general del sistema
    const registerUserProcess = async(e: React.SubmitEvent<HTMLFormElement>) => {

        e.preventDefault();

        const res: Response = await fetch(`${API_URL}/users/api/register`, {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(valoresUsuario)
        });

        const data: DataType = await res.json();

        if(data.mensaje){
            setMensajeUsuario(data.mensaje);
            return
        }

        if(!data.ok || data.error) {
            alert(data.error);
        } else if(data.exito){
            alert(data.exito);
            resetFormUsuario();
        }

    };

    const registerClinicaUser = async(e: React.SubmitEvent<HTMLFormElement>) => {

        e.preventDefault();

        const res: Response = await fetch(`${API_URL}/clinicas/api/register`, {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(valoresClinica)
        });

        const data: DataType = await res.json();

        if(data.mensaje){
            setMensajeClinica(data.mensaje);
            return
        }

        if(!data.ok){
            alert(data.error);
        } else if(data.exito){
            alert(data.exito);
            resetFormClinica();
        }

    };

    const renderRegistrarUsuario = () => {
        return (
            <RegisterUser onSubmit={registerUserProcess} valores={valoresUsuario} handleOnChange={handleOnChangeUsuario} mensaje={mensajeUsuario} />
        )
    };

    const renderRegistrarClinica = () => {
        return (
            <div>
                <form onSubmit={registerClinicaUser}>
                    <Input label="Nombre de la clínica" type="text" name="nombre" value={valoresClinica.nombre} onChange={handleOnChangeClinica} />
                    <Input label="NIT" type="text" name="nit" value={valoresClinica.nit} onChange={handleOnChangeClinica} />
                    <Input label="Teléfono" type="tel" name="telefono" value={valoresClinica.telefono} onChange={handleOnChangeClinica} />
                    <Input label="Correo de la clínica" type="email" name="correo" value={valoresClinica.correo} onChange={handleOnChangeClinica} />
                    <Input label="Dirección" type="text" name="direccion" value={valoresClinica.direccion} onChange={handleOnChangeClinica} />
                    <Input label="Ciudad" type="text" name="ciudad" value={valoresClinica.ciudad} onChange={handleOnChangeClinica} />
                    <Input label="Departamento" type="text" name="departamento" value={valoresClinica.departamento} onChange={handleOnChangeClinica} />
                    <input type="checkbox" name="estado" checked={valoresClinica.estado} onChange={handleOnChangeClinica} />
                    <Input label="URL del logo" type="text" name="logo_url" value={valoresClinica.logo_url} onChange={handleOnChangeClinica} />
                    {mensajeClinica !== "" && <p>{mensajeClinica}</p>}
                    <button type="submit">Registrar clínica</button>
                </form>
            </div>
        )
    };

    //RETURN
    return (
        <div id="mainAdminPage">
            <h1>SUPER PAGINA DE ADMIN</h1>
            {renderRegistrarUsuario()}
            {renderRegistrarClinica()}
            <div>
                <button onClick={(e) => {e.preventDefault(); logoutProcess()}}>Cerrar sesión</button>
            </div>
        </div>
    )
};

export default AdminPage;