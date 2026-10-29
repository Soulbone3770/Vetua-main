import Input from "../components/Input.tsx";
import type { ClienteType } from "../types/ClienteType.ts";
import type {DataType} from "../types/DataType.ts";
import React, {useState} from "react";
import { FormCard, Dato, BOTON_PRINCIPAL } from "../components/FormUI.tsx";
import useDeleteCliente from "./useDeleteCliente.ts";

const API_URL = import.meta.env.VITE_API_URL;

const formatFecha = (fecha: unknown): string => {
    if (!fecha) return "—";
    const [y, m, d] = String(fecha).slice(0, 10).split("-");
    return y && m && d ? `${d}/${m}/${y}` : String(fecha);
};

const CAMPOS_VACIOS = { nombres: "", apellidos: "", telefono: "", correo: "", direccion: "", ciudad: "", departamento: "" };

const useUpdateClienteForm = (cliente: ClienteType | undefined, getCliente: () => Promise<void>) => {

    const [valores, setValores] = useState(CAMPOS_VACIOS);
    const [mensaje, setMensaje] = useState("");
    const usuario = cliente;
    const[editando, setEditando] = useState(false);
    const { deleteCliente } = useDeleteCliente();

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValores(prev => ({ ...prev, [name]: value }));
    };


    const empezarEdicion = () => {
        if (!usuario) return;
        setValores({
            nombres: String(usuario.nombres ?? ""),
            apellidos: String(usuario.apellidos ?? ""),
            telefono: String(usuario.telefono ?? ""),
            correo: String(usuario.correo ?? ""),
            direccion: String(usuario.direccion ?? ""),
            ciudad: String(usuario.ciudad ?? ""),
            departamento: String(usuario.departamento ?? ""),
        });
        setMensaje("");
        setEditando(true);
    };

    const updateProcess = async() => {

        if( !cliente ) return setMensaje("Error, no se encontro el cliente")

        const nuevosValores = {
            ...valores,
            id: Number(cliente.id)
        }

        const res: Response = await fetch(`${API_URL}/clientes/api/actualizarInformacion`, {
            credentials: "include",
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(nuevosValores)
        });

        const data: DataType = await res.json();

        if(data.mensaje){
            setMensaje(data.mensaje);
            return
        }

        if(data.error){
            alert(data.error);
        }

        if(data.ok){
            setMensaje("");
            setEditando(false);
            await getCliente();
        }

    }

    const editingForm = () => {
        if (!usuario) return <p className="text-sm text-gray-500">No hay datos del cliente</p>

        return (
            <form onSubmit={(e) => {e.preventDefault(); updateProcess()}} className="space-y-6">
                <FormCard titulo="Información personal">
                    <div className="grid grid-cols-1 gap-x-8 md:grid-cols-3">
                        <Input label="Nombres" name="nombres" type="text" value={valores.nombres} onChange={handleOnChange} />
                        <Input label="Apellidos" name="apellidos" type="text" value={valores.apellidos} onChange={handleOnChange} />
                        <Dato label="Fecha de nacimiento" valor={formatFecha(usuario.fecha_nacimiento)} />
                        <Dato label="Tipo de documento" valor={usuario.tipo_documento} />
                        <Dato label="Número de documento" valor={usuario.num_documento} />
                        <Dato label="Sexo" valor={usuario.sexo} />
                    </div>
                </FormCard>

                <FormCard titulo="Información de contacto">
                    <div className="grid grid-cols-1 gap-x-8 md:grid-cols-3">
                        <Input label="Teléfono" name="telefono" type="text" value={valores.telefono} onChange={handleOnChange} />
                        <Input label="Correo electrónico" name="correo" type="email" value={valores.correo} onChange={handleOnChange} />
                        <Input label="Dirección" name="direccion" type="text" value={valores.direccion} onChange={handleOnChange} />
                        <Input label="Ciudad" name="ciudad" type="text" value={valores.ciudad} onChange={handleOnChange} />
                        <Input label="Departamento" name="departamento" type="text" value={valores.departamento} onChange={handleOnChange} />
                    </div>
                </FormCard>

                {mensaje !== "" && <p className="text-sm font-medium text-red-500">{mensaje}</p>}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <button
                        type="button"
                        onClick={() => { setMensaje(""); setEditando(false); }}
                        className="w-full rounded-xl border-2 border-[#4C00C8] bg-white px-6 py-3.5 text-base font-medium text-[#4C00C8] transition hover:bg-purple-50"
                    >
                        Cancelar
                    </button>
                    <button type="submit" className={BOTON_PRINCIPAL}>Guardar cambios →</button>
                </div>
            </form>
        )
    };

    const normalData = () => {
        if (!usuario) return <p className="text-sm text-gray-500">No hay datos del cliente</p>

        return (
            <div className="space-y-6">
                <FormCard titulo="Información personal">
                    <div className="grid grid-cols-1 gap-x-8 md:grid-cols-3">
                        <Dato label="Nombres" valor={usuario.nombres} />
                        <Dato label="Apellidos" valor={usuario.apellidos} />
                        <Dato label="Fecha de nacimiento" valor={formatFecha(usuario.fecha_nacimiento)} />
                        <Dato label="Tipo de documento" valor={usuario.tipo_documento} />
                        <Dato label="Número de documento" valor={usuario.num_documento} />
                        <Dato label="Sexo" valor={usuario.sexo} />
                    </div>
                </FormCard>

                <FormCard titulo="Información de contacto">
                    <div className="grid grid-cols-1 gap-x-8 md:grid-cols-3">
                        <Dato label="Teléfono" valor={usuario.telefono} />
                        <Dato label="Correo electrónico" valor={usuario.correo} />
                        <Dato label="Dirección" valor={usuario.direccion} />
                        <Dato label="Ciudad" valor={usuario.ciudad} />
                        <Dato label="Departamento" valor={usuario.departamento} />
                    </div>
                </FormCard>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <button type="button" onClick={() => deleteCliente(usuario.id)} className={BOTON_PRINCIPAL}>
                        Borrar cliente →
                    </button>
                    <button type="button" onClick={empezarEdicion} className={BOTON_PRINCIPAL}>
                        Editar información →
                    </button>
                </div>
            </div>
        )
    }

    const renderFinal = () => {
        return (
            <>
                {editando
                    ? editingForm()
                    : normalData()
                }
            </>
        )
    }

    return { renderFinal };

};

export default useUpdateClienteForm;