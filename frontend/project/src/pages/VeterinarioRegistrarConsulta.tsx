import useForm from "../hooks/useForm.ts";
import useAuth from "../hooks/useAuth.ts";
import {TIPO_DOCUMENTOS, type TipoDocumentoType} from "../types/TipoDocumentoType.ts";
import React, {useState} from "react";
import type {DataType} from "../types/DataType.ts";
import Input from "../components/Input.tsx";
import useGetMascotas from "../hooks/useGetMascotas.ts";
import useGetCliente from "../hooks/useGetCliente.ts";
import { Pagina, FormCard, SelectField, TextAreaField, BuscadorDocumento, MensajeError, BOTON_PRINCIPAL } from "../components/FormUI.tsx";

const API_URL = import.meta.env.VITE_API_URL;

const VeterinarioRegistrarConsulta = () => {

    //------------
    const { usuario } = useAuth();
    const clinicaId = usuario?.clinicaId;

    const { valores: valoresDocumento, handleOnChange: handleDocumentos } = useForm({"clienteNumDocumento": "", "clienteTipoDocumento": "" as TipoDocumentoType});
    const { mascotas, noMascotas, getMascotas } = useGetMascotas(valoresDocumento.clienteNumDocumento, valoresDocumento.clienteTipoDocumento);
    const { cliente, noCliente, getCliente } = useGetCliente(valoresDocumento.clienteNumDocumento, valoresDocumento.clienteTipoDocumento);
    //------------

    const veterinarioId = usuario?.id;

    const { valores, handleOnChange, resetForm } = useForm({"fecha_hora": "", "motivo_consulta": "", "peso_en_consulta": 0, "temperatura": 0, "frecuencia_cardiaca": 0,
        "sintomas": "", "diagnostico": "", "tratamiento_indicado": "", "observaciones": "", "costo": 0, "nombre_mascota": "", "id_veterinario": veterinarioId, "id_clinica": clinicaId});

    const[mensaje, setMensaje] = useState("");

    const registerConsultaProcess = async(e: React.SubmitEvent<HTMLFormElement>) => {

        e.preventDefault();

        const nuevosValores = {
            ...valores,
            "cliente_tipo_documento": valoresDocumento.clienteTipoDocumento,
            "cliente_num_documento": valoresDocumento.clienteNumDocumento
        }

        const res: Response = await fetch(`${API_URL}/consultas/api/registerConsulta`, {
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
            return
        } else {
            setMensaje("");
        }

        if(!data.ok){
            alert(data.error);
            return
        }

        if(data.exito){
            alert(data.exito);
            resetForm();
        }

    }

    const renderForm = () => {
        return (
            <form onSubmit={registerConsultaProcess} className="space-y-6">
                <FormCard titulo="Datos de la consulta">
                    <div className="grid grid-cols-1 gap-x-8 md:grid-cols-3">
                        <Input label="Fecha" name="fecha_hora" type="date" value={valores.fecha_hora} onChange={handleOnChange} />
                        <Input label="Costo" name="costo" type="number" step="0.01" value={valores.costo} onChange={handleOnChange} />
                        <div>
                            {noMascotas !== ""
                                ? <MensajeError texto={noMascotas} />
                                : mascotas.length > 0 &&
                                <SelectField name="nombre_mascota" label="Mascota" value={valores.nombre_mascota} onChange={handleOnChange}>
                                    <option value="">Selecciona una mascota</option>
                                    {mascotas.map(m => (
                                        <option key={m.id} value={m.nombre}>{m.nombre}</option>
                                    ))}
                                </SelectField>
                            }
                        </div>
                    </div>
                    <TextAreaField name="motivo_consulta" label="Motivo de la consulta" value={valores.motivo_consulta} onChange={handleOnChange} />
                </FormCard>

                <FormCard titulo="Signos vitales">
                    <div className="grid grid-cols-1 gap-x-8 md:grid-cols-3">
                        <Input label="Peso en consulta" name="peso_en_consulta" type="number" step="0.01" value={valores.peso_en_consulta} onChange={handleOnChange} />
                        <Input label="Temperatura" name="temperatura" type="number" step="0.01" value={valores.temperatura} onChange={handleOnChange} />
                        <Input label="Frecuencia cardiaca" name="frecuencia_cardiaca" type="number" step="0.01" value={valores.frecuencia_cardiaca} onChange={handleOnChange} />
                    </div>
                </FormCard>

                <FormCard titulo="Diagnóstico y tratamiento">
                    <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
                        <TextAreaField name="sintomas" label="Síntomas" value={valores.sintomas} onChange={handleOnChange} />
                        <TextAreaField name="diagnostico" label="Diagnóstico" value={valores.diagnostico} onChange={handleOnChange} />
                        <TextAreaField name="tratamiento_indicado" label="Tratamiento indicado" value={valores.tratamiento_indicado} onChange={handleOnChange} />
                        <TextAreaField name="observaciones" label="Observaciones" value={valores.observaciones} onChange={handleOnChange} />
                    </div>
                </FormCard>

                {mensaje !== "" && <MensajeError texto={mensaje} />}

                <button type="submit" className={BOTON_PRINCIPAL}>Registrar consulta →</button>
            </form>
        )
    };

    return (
        <Pagina titulo="Registrar consulta" ancho="max-w-4xl" rolLabel="Veterinario" volverA="/veterinarioPage">
            <BuscadorDocumento
                tipo={valoresDocumento.clienteTipoDocumento}
                numero={valoresDocumento.clienteNumDocumento}
                onChange={handleDocumentos}
                onSubmit={() => { getCliente(); getMascotas(); }}
                opciones={TIPO_DOCUMENTOS}
            />
            {noCliente !== ""
                ? <MensajeError texto={noCliente} />
                : cliente !== undefined && renderForm()
            }
        </Pagina>
    );
};

export default VeterinarioRegistrarConsulta;