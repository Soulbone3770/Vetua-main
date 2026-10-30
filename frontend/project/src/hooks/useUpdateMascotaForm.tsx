
import type {MascotaType} from "../types/MascotaType.ts";
import type {DataType} from "../types/DataType.ts";
import React, {useState} from "react";
import Input from "../components/Input.tsx";
import {SEXOS_MASCOTA, sexosMascotaObjeto} from "../types/SexoType.ts";
import {FormCard, SelectField, Dato, MensajeError, BOTON_PRINCIPAL, BOTON_SECUNDARIO} from "../components/FormUI.tsx";
import useDeleteMascota from "./useDeleteMascota.ts";
import { formatFecha } from "../utils/formatFecha.ts";

const API_URL = import.meta.env.VITE_API_URL;

const BOTON_BORRAR =
    "w-full rounded-xl border-2 border-[#8B3A3A] bg-white px-6 py-3.5 text-base font-medium text-[#8B3A3A] transition hover:bg-red-50";

const CAMPOS_VACIOS = { nombre: "", especie: "", raza: "", sexo: "", peso: "" };

const useUpdateMascotaForm = (mascota: MascotaType | undefined, getMascota: () => Promise<void>) => {

    const [valores, setValores] = useState(CAMPOS_VACIOS);
    const { deleteMascota } = useDeleteMascota();

    const[mensaje, setMensaje] = useState("");
    const[editando, setEditando] = useState(false);

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setValores(prev => ({ ...prev, [name]: value }));
    };

    // Al empezar a editar, los campos se llenan con los datos actuales de la mascota
    const empezarEdicion = () => {
        if(!mascota) return;
        setValores({
            nombre: String(mascota.nombre ?? ""),
            especie: String(mascota.especie ?? ""),
            raza: String(mascota.raza ?? ""),
            sexo: String(mascota.sexo ?? ""),
            peso: String(mascota.peso ?? ""),
        });
        setMensaje("");
        setEditando(true);
    };

    const updateMascota = async() => {

        if(!mascota){
            alert("Error, no hay mascota")
            return
        }

        const valoresFinales = {
            ...valores,
            peso: Number(valores.peso),
            id: mascota.id
        }

        const res: Response = await fetch(`${API_URL}/mascotas/api/changeMascotaInformacion`, {
            credentials: "include",
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(valoresFinales)
        });

        const data: DataType = await res.json();

        if(data.mensaje){
            setMensaje(data.mensaje);
            return
        }

        if(data.error){
            alert(data.error);
            return
        }

        setMensaje("");
        setEditando(false);
        await getMascota();

    };

    const confirmarBorrado = () => {
        if(!mascota) return;
        if(window.confirm(`¿Seguro que quieres borrar a ${mascota.nombre}? Esta acción no se puede deshacer.`)){
            deleteMascota(mascota.id);
        }
    };

    const renderMascotaInfo = () => {
        if(!mascota) return <MensajeError texto="No se encontró la información de la mascota" />

        return (
            <div className="space-y-6">
                <FormCard titulo="Información de la mascota">
                    <div className="grid grid-cols-1 gap-x-8 md:grid-cols-3">
                        <Dato label="Nombre" valor={mascota.nombre} />
                        <Dato label="Especie" valor={mascota.especie} />
                        <Dato label="Raza" valor={mascota.raza} />
                        <Dato label="Sexo" valor={mascota.sexo} />
                        <Dato label="Fecha de nacimiento" valor={formatFecha(mascota.fecha_nacimiento)} />
                        <Dato label="Peso" valor={mascota.peso} />
                        <Dato label="Fecha de registro" valor={formatFecha(mascota.created_at)} />
                    </div>
                </FormCard>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <button type="button" className={BOTON_BORRAR} onClick={confirmarBorrado}>Borrar mascota</button>
                    <button type="button" className={BOTON_PRINCIPAL} onClick={empezarEdicion}>Editar información →</button>
                </div>
            </div>
        )
    };

    const renderMascotaForm = () => {
        if(!mascota) return <MensajeError texto="No se encontró la información de la mascota" />

        return (
            <form onSubmit={(e) => {e.preventDefault(); updateMascota()}} className="space-y-6">
                <FormCard titulo="Información de la mascota">
                    <div className="grid grid-cols-1 gap-x-8 md:grid-cols-3">
                        <Input label="Nombre" name="nombre" type="text" value={valores.nombre} onChange={handleOnChange}/>
                        <Input label="Especie" name="especie" type="text" value={valores.especie} onChange={handleOnChange} />
                        <Input label="Raza" name="raza" type="text" value={valores.raza} onChange={handleOnChange} />
                        <SelectField name="sexo" label="Sexo" value={valores.sexo} onChange={handleOnChange}>
                            <option value="">Selecciona el sexo de la mascota</option>
                            {SEXOS_MASCOTA.map(sm => (
                                <option key={sm} value={sexosMascotaObjeto[sm]}>{sm}</option>
                            ))}
                        </SelectField>
                        <Input label="Peso" name="peso" type="number" step="0.1" value={valores.peso} onChange={handleOnChange} />
                        <Dato label="Fecha de nacimiento" valor={formatFecha(mascota.fecha_nacimiento)} />
                    </div>
                </FormCard>

                {mensaje !== "" && <MensajeError texto={mensaje} />}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <button type="button" className={BOTON_SECUNDARIO} onClick={() => { setMensaje(""); setEditando(false); }}>Cancelar</button>
                    <button type="submit" className={BOTON_PRINCIPAL}>Guardar cambios →</button>
                </div>
            </form>
        )
    };

    const renderFinal = () => {
        return (
            <>
                {editando
                    ? renderMascotaForm()
                    : renderMascotaInfo()
                }
            </>
        )
    };

    return { renderFinal };

};

export default useUpdateMascotaForm;