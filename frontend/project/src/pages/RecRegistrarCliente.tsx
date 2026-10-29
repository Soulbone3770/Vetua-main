import useForm from '../hooks/useForm';
import type { TipoDocumentoType} from '../types/TipoDocumentoType.ts';
import type {SexoType} from '../types/SexoType.ts';
import type{DataType} from '../types/DataType.ts';
import React, { useState } from 'react';
import Input from "../components/Input.tsx";
import {TIPO_DOCUMENTOS} from "../types/TipoDocumentoType.ts";
import {SEXOS} from "../types/SexoType.ts";
import {sexosObjeto} from "../types/SexoType.ts";
import { Pagina, FormCard, SelectField, Autorizo, BOTON_PRINCIPAL } from "../components/FormUI.tsx";

const API_URL = import.meta.env.VITE_API_URL;

const RecRegistrarCliente = () => {

    const { valores, handleOnChange, resetForm } = useForm({"nombres": "", "apellidos": "", "fecha_nacimiento": "", "tipo_documento": "" as TipoDocumentoType, "num_documento": "", "sexo": "" as SexoType, "telefono": "", "correo": "", "direccion": "", "ciudad": "", "departamento": "", "autorizo": false});

    const[mensaje, setMensaje] = useState("");

    const registerProcess = async(e: React.SubmitEvent<HTMLFormElement>) => {

        e.preventDefault();
        setMensaje("");

        const res: Response = await fetch(`${API_URL}/clientes/api/register`, {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(valores)
        });

        const data: DataType = await res.json();

        if(data.mensaje){
            setMensaje(data.mensaje);
            return
        }

        if(!data.ok){
            alert(data.error);
            return
        } else if(data.exito){
            alert(data.exito)
            resetForm();
        }

    };

    return (
        <Pagina titulo="Registrar cliente">
            <form onSubmit={registerProcess} className="space-y-6">
                <FormCard titulo="Información personal">
                    <div className="grid grid-cols-1 gap-x-8 md:grid-cols-3">
                        <Input label="Nombres" type="text" name="nombres" value={valores.nombres} onChange={handleOnChange} />
                        <Input label="Apellidos" type="text" name="apellidos" value={valores.apellidos} onChange={handleOnChange} />
                        <Input label="Fecha de nacimiento" type="date" name="fecha_nacimiento" value={valores.fecha_nacimiento} onChange={handleOnChange} />
                        <SelectField name="tipo_documento" label="Tipo de documento" value={valores.tipo_documento} onChange={handleOnChange}>
                            <option value="">Selecciona tipo de documento</option>
                            {TIPO_DOCUMENTOS.map(tipo => (
                                <option key={tipo} value={tipo}>{tipo}</option>
                            ))}
                        </SelectField>
                        <Input label="Número de documento" type="text" name="num_documento" value={valores.num_documento} onChange={handleOnChange} />
                        <SelectField name="sexo" label="Sexo" value={valores.sexo} onChange={handleOnChange}>
                            <option value="">Selecciona tu sexo</option>
                            {SEXOS.map(s => (
                                <option key={s} value={sexosObjeto[s]}>{s}</option>
                            ))}
                        </SelectField>
                    </div>
                </FormCard>

                <FormCard titulo="Información de contacto">
                    <div className="grid grid-cols-1 gap-x-8 md:grid-cols-3">
                        <Input label="Teléfono" type="tel" name="telefono" value={valores.telefono} onChange={handleOnChange}/>
                        <Input label="Correo electrónico" type="email" name="correo" value={valores.correo} onChange={handleOnChange} />
                        <Input label="Dirección" type="text" name="direccion" value={valores.direccion} onChange={handleOnChange} />
                        <Input label="Ciudad" type="text" name="ciudad" value={valores.ciudad} onChange={handleOnChange} />
                        <Input label="Departamento" type="text" name="departamento" value={valores.departamento} onChange={handleOnChange} />
                    </div>
                </FormCard>

                {mensaje !== "" && <p className="text-sm font-medium text-red-500">{mensaje}</p>}

                <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2">
                    <Autorizo checked={valores.autorizo} onChange={handleOnChange} />
                    <button type="submit" className={BOTON_PRINCIPAL}>Registrar cliente →</button>
                </div>
            </form>
        </Pagina>
    );
};

export default RecRegistrarCliente;