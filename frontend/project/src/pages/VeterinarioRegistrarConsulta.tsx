import useForm from "../hooks/useForm.ts";
import useAuth from "../hooks/useAuth.ts";
import {TIPO_DOCUMENTOS, type TipoDocumentoType} from "../types/TipoDocumentoType.ts";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import type {DataType} from "../types/DataType.ts";
import Input from "../components/Input.tsx";
import PanelLayout from "../components/PanelLayout.tsx";
import useGetMascotas from "../hooks/useGetMascotas.ts";
import useGetCliente from "../hooks/useGetCliente.ts";

const API_URL = import.meta.env.VITE_API_URL;

const VeterinarioRegistrarConsulta = () => {

    const navigate = useNavigate();

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
            <form className="vet-formulario" onSubmit={registerConsultaProcess}>
                <div className="vet-fila-campos">
                    <Input label="Fecha y hora" name="fecha_hora" type="date" value={valores.fecha_hora} onChange={handleOnChange} />
                    <Input label="Costo" name="costo" type="number" step="0.01" value={valores.costo} onChange={handleOnChange} />
                </div>
                <label>
                    Motivo de la consulta
                    <textarea name="motivo_consulta" value={valores.motivo_consulta} onChange={handleOnChange} />
                </label>
                <div className="vet-fila-campos">
                    <Input label="Peso en consulta" name="peso_en_consulta" type="number" step="0.01" value={valores.peso_en_consulta} onChange={handleOnChange} />
                    <Input label="Temperatura" name="temperatura" type="number" step="0.01" value={valores.temperatura} onChange={handleOnChange} />
                    <Input label="Frecuencia cardiaca" name="frecuencia_cardiaca" type="number" step="0.01" value={valores.frecuencia_cardiaca} onChange={handleOnChange} />
                </div>
                <label>
                    Síntomas
                    <textarea name="sintomas" value={valores.sintomas} onChange={handleOnChange} />
                </label>
                <label>
                    Diagnóstico
                    <textarea name="diagnostico" value={valores.diagnostico} onChange={handleOnChange} />
                </label>
                <label>
                    Tratamiento indicado
                    <textarea name="tratamiento_indicado" value={valores.tratamiento_indicado} onChange={handleOnChange} />
                </label>
                <label>
                    Observaciones
                    <textarea name="observaciones" value={valores.observaciones} onChange={handleOnChange} />
                </label>
                {noMascotas !== ""
                    ? <p className="vet-aviso">{noMascotas}</p>
                    : mascotas.length > 0 &&
                    <label>
                        Mascota
                        <select name="nombre_mascota" value={valores.nombre_mascota} onChange={handleOnChange}>
                            <option value="">Selecciona una opción</option>
                            {mascotas.map(m => (
                                <option key={m.id} value={m.nombre}>{m.nombre}</option>
                            ))}
                        </select>
                    </label>
                }
                {mensaje !== "" && <p className="vet-aviso">{mensaje}</p>}
                <button type="submit" className="vet-boton solido">Registrar consulta</button>
            </form>
        )
    };

    return (
        <PanelLayout titulo="Registrar consulta" rol="Veterinario" onBack={() => navigate("/veterinarioPage")}>
            <main className="vet-contenido">
                <h2 className="vet-titulo-pagina">Ingresa el número de documento del cliente al que será asignada la consulta</h2>
                <form className="vet-formulario" onSubmit={(e: React.SubmitEvent<HTMLFormElement>) => {e.preventDefault(); getCliente(); getMascotas();}}>
                    <div className="vet-fila-campos">
                        <label>
                            Tipo de documento
                            <select name="clienteTipoDocumento" value={valoresDocumento.clienteTipoDocumento} onChange={handleDocumentos}>
                                <option value="">Selecciona una opción</option>
                                {TIPO_DOCUMENTOS.map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </label>
                        <Input label="Número de documento" name="clienteNumDocumento" type="text" value={valoresDocumento.clienteNumDocumento} onChange={handleDocumentos} />
                    </div>
                    <button type="submit" className="vet-boton solido">Buscar cliente</button>
                </form>
                {noCliente !== ""
                    ? <p className="vet-aviso">{noCliente}</p>
                    : cliente !== undefined && renderForm()
                }
            </main>
        </PanelLayout>
    );
};

export default VeterinarioRegistrarConsulta;