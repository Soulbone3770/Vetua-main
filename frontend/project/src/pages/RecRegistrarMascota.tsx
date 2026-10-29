import useForm from "../hooks/useForm.ts";
import type {SexoMascotaType} from "../types/SexoType.ts";
import React, {useState} from "react";
import type { DataType } from "../types/DataType.ts";
import Input from "../components/Input.tsx";
import {SEXOS_MASCOTA, sexosMascotaObjeto} from '../types/SexoType.ts';
import {TIPO_DOCUMENTOS, type TipoDocumentoType} from "../types/TipoDocumentoType.ts";
import useAuth from "../hooks/useAuth.ts";
import { Pagina, FormCard, SelectField, Autorizo, BOTON_PRINCIPAL, CAMPO } from "../components/FormUI.tsx";

const API_URL = import.meta.env.VITE_API_URL;

const RecRegistrarMascota = () => {

    const { usuario } = useAuth();

    const clinicaId = usuario?.clinicaId

    const { valores, handleOnChange, resetForm } = useForm({"nombre": "", "especie": "", "raza": "", "sexo": "" as SexoMascotaType, "fecha_nacimiento": "", "peso": 0.0, "foto_url": "", "propietarioNumDocumento": "", "propietarioTipoDocumento": "" as TipoDocumentoType, "clinicaId": clinicaId});

    const[mensaje, setMensaje] = useState("");
    const[autorizo, setAutorizo] = useState(false);

    const registerProcess = async(e: React.SubmitEvent<HTMLFormElement>) => {

        e.preventDefault();
        setMensaje("");

        if(!autorizo){
            setMensaje("Debes autorizar el tratamiento de datos personales.");
            return;
        }

        const res: Response = await fetch(`${API_URL}/mascotas/api/register`, {
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
            alert(data.exito);
            resetForm();
            setAutorizo(false);
        }

    };

    return (
        <Pagina titulo="Registrar mascota">
            <form onSubmit={registerProcess} className="space-y-6">
                <FormCard titulo="Información de la mascota">
                    <div className="grid grid-cols-1 gap-x-8 md:grid-cols-3">
                        <Input label="Nombre" name="nombre" type="text" value={valores.nombre} onChange={handleOnChange} />
                        <Input label="Especie" name="especie" type="text" value={valores.especie} onChange={handleOnChange} />
                        <Input label="Fecha de nacimiento" name="fecha_nacimiento" type="date" value={valores.fecha_nacimiento} onChange={handleOnChange} />
                        <Input label="Raza" name="raza" type="text" value={valores.raza} onChange={handleOnChange} />
                        <Input label="Peso" name="peso" type="number" step="0.01" value={valores.peso} onChange={handleOnChange} />
                        <SelectField name="sexo" label="Sexo" value={valores.sexo} onChange={handleOnChange}>
                            <option value="">Selecciona el sexo de la mascota</option>
                            {SEXOS_MASCOTA.map(sm => (
                                <option key={sm} value={sexosMascotaObjeto[sm]}>{sm}</option>
                            ))}
                        </SelectField>
                    </div>
                </FormCard>

                <FormCard titulo="Propietario">
                    <div className="grid grid-cols-1 gap-x-8 md:grid-cols-3">
                        <SelectField name="propietarioTipoDocumento" label="Tipo de documento" value={valores.propietarioTipoDocumento} onChange={handleOnChange}>
                            <option value="">Selecciona tipo de documento</option>
                            {TIPO_DOCUMENTOS.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </SelectField>
                        <Input label="Número de documento del propietario" name="propietarioNumDocumento" type="text" value={valores.propietarioNumDocumento} onChange={handleOnChange} />
                    </div>
                </FormCard>

                <FormCard titulo="Foto de la mascota" derecha="Pega el enlace (URL) de la imagen">
                    <div className="mx-auto flex max-w-sm flex-col gap-4">
                        <div className="flex h-44 w-full items-center justify-center overflow-hidden rounded-lg border border-gray-400 bg-[#F8F9FA]">
                            {valores.foto_url !== ""
                                ? <img
                                    src={valores.foto_url}
                                    alt="Vista previa de la mascota"
                                    className="h-full w-full object-cover"
                                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                                    onLoad={(e) => { e.currentTarget.style.display = "block"; }}
                                  />
                                : <span className="text-6xl font-thin text-gray-500">+</span>
                            }
                        </div>
                        <input
                            type="text"
                            name="foto_url"
                            value={valores.foto_url}
                            onChange={handleOnChange}
                            placeholder="https://..."
                            className={CAMPO}
                        />
                    </div>
                </FormCard>

                {mensaje !== "" && <p className="text-sm font-medium text-red-500">{mensaje}</p>}

                <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2">
                    <Autorizo checked={autorizo} onChange={(e) => setAutorizo(e.target.checked)} />
                    <button type="submit" className={BOTON_PRINCIPAL}>Registrar mascota →</button>
                </div>
            </form>
        </Pagina>
    );
};

export default RecRegistrarMascota;