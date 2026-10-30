import useForm from "../hooks/useForm.ts";
import React, {useState} from "react";
import type {DataType} from "../types/DataType.ts";
import Logout from '../hooks/Logout.ts';
import {ROLES, rolesObjeto, type RolesType} from "../types/Roles.ts";
import Input from "../components/Input.tsx";
import { PageHeader, FormCard, SelectField, MensajeError, BOTON_PRINCIPAL } from "../components/FormUI.tsx";

const API_URL = import.meta.env.VITE_API_URL;

const AdminPage = () => {

    //Importe de la funcion useForm y del proceso para cerrar sesión
    const { valores: valoresUsuario, handleOnChange: handleOnChangeUsuario, resetForm: resetFormUsuario } = useForm({"username": "", "password": "", "rol": "" as RolesType, "clinicaId": 0});
    const { valores: valoresClinica, handleOnChange: handleOnChangeClinica, resetForm: resetFormClinica } = useForm({"nombre": "", "nit": "", "telefono": "", "correo": "", "direccion": "", "ciudad": "", "departamento": "", "estado": true, "logo_url": ""});
    const { logoutProcess } = Logout();

    const[mensajeUsuario, setMensajeUsuario] = useState("");
    const[mensajeClinica, setMensajeClinica] = useState("");

    //Proceso para registrar un usuario general del sistema
    const registerUserProcess = async(e: React.SubmitEvent<HTMLFormElement>) => {

        e.preventDefault();
        setMensajeUsuario("");

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
        setMensajeClinica("");

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

    return (
        <div id="mainAdminPage" className="min-h-screen w-full bg-[#EEF1FA]">
            <PageHeader titulo="Bienvenido/a" rolLabel="Admin sistema" onExit={() => logoutProcess()} />

            <section className="bg-white shadow-md">
                <div className="mx-auto max-w-5xl px-6 py-8 text-left md:px-10">
                    <h2 className="text-xl font-bold !text-black">Panel de administración del sistema</h2>
                    <p className="mt-1 max-w-xl text-sm text-gray-800">
                        Desde aquí puedes registrar usuarios del sistema y nuevas clínicas.
                    </p>
                </div>
            </section>

            <main className="mx-auto max-w-5xl space-y-8 px-6 py-10 md:px-10">
                <form onSubmit={registerUserProcess}>
                    <FormCard titulo="Registrar usuario">
                        <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
                            <Input label="Nombre de usuario" type="text" name="username" value={valoresUsuario.username} onChange={handleOnChangeUsuario} />
                            <Input label="Contraseña" type="password" name="password" value={valoresUsuario.password} onChange={handleOnChangeUsuario} />
                            <SelectField name="rol" label="Rol" value={valoresUsuario.rol} onChange={handleOnChangeUsuario}>
                                <option value="">Selecciona una opción</option>
                                {ROLES.map(rol => (
                                    <option key={rol} value={rolesObjeto[rol]}>{rol}</option>
                                ))}
                            </SelectField>
                            <Input label="ID de la clínica" type="number" name="clinicaId" value={valoresUsuario.clinicaId} onChange={handleOnChangeUsuario} />
                        </div>
                        {mensajeUsuario !== "" && <div className="mb-4"><MensajeError texto={mensajeUsuario} /></div>}
                        <button type="submit" className={BOTON_PRINCIPAL}>Registrar usuario →</button>
                    </FormCard>
                </form>

                <form onSubmit={registerClinicaUser}>
                    <FormCard titulo="Registrar clínica">
                        <div className="grid grid-cols-1 gap-x-8 md:grid-cols-3">
                            <Input label="Nombre de la clínica" type="text" name="nombre" value={valoresClinica.nombre} onChange={handleOnChangeClinica} />
                            <Input label="NIT" type="text" name="nit" value={valoresClinica.nit} onChange={handleOnChangeClinica} />
                            <Input label="Teléfono" type="tel" name="telefono" value={valoresClinica.telefono} onChange={handleOnChangeClinica} />
                            <Input label="Correo de la clínica" type="email" name="correo" value={valoresClinica.correo} onChange={handleOnChangeClinica} />
                            <Input label="Dirección" type="text" name="direccion" value={valoresClinica.direccion} onChange={handleOnChangeClinica} />
                            <Input label="Ciudad" type="text" name="ciudad" value={valoresClinica.ciudad} onChange={handleOnChangeClinica} />
                            <Input label="Departamento" type="text" name="departamento" value={valoresClinica.departamento} onChange={handleOnChangeClinica} />
                            <Input label="URL del logo" type="text" name="logo_url" value={valoresClinica.logo_url} onChange={handleOnChangeClinica} />
                            <label className="mb-4 flex cursor-pointer items-center gap-3 self-end pb-2.5 text-sm font-medium text-gray-800">
                                <input type="checkbox" name="estado" checked={valoresClinica.estado} onChange={handleOnChangeClinica} className="h-5 w-5 cursor-pointer accent-purple-600" />
                                Clínica activa
                            </label>
                        </div>
                        {mensajeClinica !== "" && <div className="mb-4"><MensajeError texto={mensajeClinica} /></div>}
                        <button type="submit" className={BOTON_PRINCIPAL}>Registrar clínica →</button>
                    </FormCard>
                </form>
            </main>
        </div>
    )
};

export default AdminPage;