import useGetMascotas from "../hooks/useGetMascotas.ts";
import useGetCliente from "../hooks/useGetCliente.ts";
import useForm from "../hooks/useForm.ts";
import useGetVeterinarios from "../hooks/useGetVeterinarios.ts";
import {TIPO_DOCUMENTOS, type TipoDocumentoType} from "../types/TipoDocumentoType.ts";
import Input from "../components/Input.tsx";
import type {EstadosCitaType} from "../types/EstadosCitaType.ts";
import useAuth from "../hooks/useAuth.ts";
import React, {useState} from "react";
import type {DataType} from "../types/DataType.ts";
import useVerificarCitas from "../hooks/useVerificarCitas.ts";
import { Pagina, FormCard, SelectField, Autorizo, BOTON_PRINCIPAL, CAMPO } from "../components/FormUI.tsx";

const API_URL = import.meta.env.VITE_API_URL;

const RecAgendarCita = () => {

    const { usuario } = useAuth();
    const clinicaId = usuario?.clinicaId;

    const { valores: valoresDocumento, handleOnChange: handleDocumentos } = useForm({"clienteNumDocumento": "", "clienteTipoDocumento": "" as TipoDocumentoType});
    const { valores: valoresCita, handleOnChange: handleOnChangeCitas, resetForm: resetFormCitas } = useForm({"fecha_hora": "","clienteTipoDocumento": "" as TipoDocumentoType, "clienteNumDocumento": "", "motivo": "", "estado": "pendiente" as EstadosCitaType, "notas": "", "nombreMascota": "", "nombreVeterinario": "", "clinicaId": clinicaId});

    const { mascotas, noMascotas, getMascotas } = useGetMascotas(valoresDocumento.clienteNumDocumento, valoresDocumento.clienteTipoDocumento);
    const { veterinarios, noVeterinarios, getVeterinarios } = useGetVeterinarios();
    const { cliente, noCliente, getCliente } = useGetCliente(valoresDocumento.clienteNumDocumento, valoresDocumento.clienteTipoDocumento);
    const { verificar } = useVerificarCitas(valoresDocumento.clienteTipoDocumento, valoresDocumento.clienteNumDocumento);

    const[mensaje, setMensaje] = useState("");
    const[autorizo, setAutorizo] = useState(false);

    const agendarCitaProcess = async(e: React.SubmitEvent<HTMLFormElement>) => {

        e.preventDefault();
        setMensaje("");

        if(!autorizo){
            setMensaje("Debes autorizar el tratamiento de datos personales.");
            return;
        }

        const nuevosValores = {
            ...valoresCita,
            clienteTipoDocumento: valoresDocumento.clienteTipoDocumento,
            clienteNumDocumento: valoresDocumento.clienteNumDocumento
        }

        const res: Response = await fetch(`${API_URL}/citas/api/agendarCita`, {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(nuevosValores)
        });

        const data: DataType = await res.json();

        if(data.mensaje){
            setMensaje(data.mensaje);
            return;
        }

        if(!data.ok){
            alert(data.error);
            return
        } else if(data.exito){
            alert(data.exito);
            resetFormCitas();
            setAutorizo(false);
        }

    };

    const renderAgendarCita = () => {
        return (
            <form onSubmit={agendarCitaProcess} className="space-y-6">
                <FormCard titulo="Nueva cita">
                    <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
                        <Input label="Fecha y hora" type="datetime-local" name="fecha_hora" value={valoresCita.fecha_hora} onChange={handleOnChangeCitas} />

                        <div>
                            {noMascotas !== ""
                                ? <p className="text-sm text-red-500">{noMascotas}</p>
                                : mascotas.length > 0 &&
                                <SelectField name="nombreMascota" label="Selecciona una mascota" value={valoresCita.nombreMascota} onChange={handleOnChangeCitas}>
                                    <option value="">Selecciona la mascota</option>
                                    {mascotas.map(m => (
                                        <option key={m.id} value={m.nombre}>{m.nombre}</option>
                                    ))}
                                </SelectField>
                            }
                        </div>

                        <div className="mb-4 flex flex-col text-left">
                            <label htmlFor="motivo" className="mb-1 text-sm font-medium text-gray-800">Motivo de la cita</label>
                            <textarea id="motivo" name="motivo" rows={5} value={valoresCita.motivo} onChange={handleOnChangeCitas} className={`${CAMPO} resize-none`} />
                        </div>

                        <div className="mb-4 flex flex-col text-left">
                            <label htmlFor="notas" className="mb-1 text-sm font-medium text-gray-800">Notas (opcional)</label>
                            <textarea id="notas" name="notas" rows={5} value={valoresCita.notas} onChange={handleOnChangeCitas} className={`${CAMPO} resize-none`} />
                        </div>

                        <div className="md:col-span-2">
                            {noVeterinarios !== ""
                                ? <p className="text-sm text-red-500">{noVeterinarios}</p>
                                : veterinarios.length > 0 &&
                                <SelectField name="nombreVeterinario" label="Selecciona un veterinario" value={valoresCita.nombreVeterinario} onChange={handleOnChangeCitas}>
                                    <option value="">Selecciona un veterinario</option>
                                    {veterinarios.map(v => (
                                        <option key={v.id} value={v.username}>{v.username}</option>
                                    ))}
                                </SelectField>
                            }
                        </div>
                    </div>
                </FormCard>

                {mensaje !== "" && <p className="text-sm font-medium text-red-500">{mensaje}</p>}

                <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2">
                    <Autorizo checked={autorizo} onChange={(e) => setAutorizo(e.target.checked)} />
                    <button type="submit" className={BOTON_PRINCIPAL}>Agendar cita →</button>
                </div>
            </form>
        )
    }

    return (
        <Pagina titulo="Agendar cita" ancho="max-w-3xl">
            <form
                onSubmit={(e: React.SubmitEvent<HTMLFormElement>) => {
                    e.preventDefault();
                    getCliente(); getMascotas(); getVeterinarios(); verificar();
                }}
            >
                <p className="mb-1 text-sm font-bold text-black">Introduzca el número y tipo de documento del cliente</p>
                <div className="flex flex-col gap-3 md:flex-row">
                    <select
                        name="clienteTipoDocumento"
                        aria-label="Tipo de documento"
                        value={valoresDocumento.clienteTipoDocumento}
                        onChange={handleDocumentos}
                        className={`${CAMPO} md:w-40`}
                    >
                        <option value="">Tipo</option>
                        {TIPO_DOCUMENTOS.map(t => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                    <input
                        name="clienteNumDocumento"
                        type="text"
                        aria-label="Número de documento"
                        placeholder="Número de documento"
                        value={valoresDocumento.clienteNumDocumento}
                        onChange={handleDocumentos}
                        className={`${CAMPO} flex-1`}
                    />
                    <button type="submit" className="rounded-2xl bg-[#4C00C8] px-6 py-2.5 text-sm font-medium text-white shadow-md transition hover:bg-[#3b009c]">
                        Buscar cliente
                    </button>
                </div>
            </form>

            {noCliente !== ""
                ? <p className="text-sm font-medium text-red-500">{noCliente}</p>
                : cliente !== undefined && renderAgendarCita()
            }
        </Pagina>
    );
};

export default RecAgendarCita;