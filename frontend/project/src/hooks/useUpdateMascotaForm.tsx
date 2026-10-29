import type {MascotaType} from "../types/MascotaType.ts";
import useForm from "./useForm.ts";
import type {DataType} from "../types/DataType.ts";
import {useState} from "react";
import Input from "../components/Input.tsx";
import {type SexoMascotaType, SEXOS_MASCOTA, sexosMascotaObjeto} from "../types/SexoType.ts";
import {SelectField} from "../components/FormUI.tsx";
import useDeleteMascota from "./useDeleteMascota.ts";

const API_URL = import.meta.env.VITE_API_URL;

const UseUpdateMascotaForm = (mascota: MascotaType | undefined, getMascota: () => Promise<void>) => {

    const { valores, handleOnChange } = useForm({"nombre": "", "especie": "", "raza": "", "sexo": "" as SexoMascotaType, "peso": 0});
    const { deleteMascota } = useDeleteMascota();

    const[mensaje, setMensaje] = useState("");
    const[editando, setEditanto] = useState(false);

    const updateMascota = async() => {

        if(!mascota){
            alert("Error, no hay mascota")
            return
        }

        const id = mascota.id;
        const valoresFinales = {
            ...valores,
            id: id
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

        console.log(data.exito);
        setMensaje("");
        setEditanto(false);
        await getMascota();

    };

    const renderMascotaInfo = () => {
        if(!mascota) return <p>No se econtro la informacion de la mascota</p>

        return (
            <div>
                <h2>{mascota.nombre}</h2>
                <p>{mascota.especie}</p>
                <p>{mascota.raza}</p>
                <p>{mascota.sexo}</p>
                <p>{mascota.fecha_nacimiento.slice(0, 10).split("-")}</p>
                <p>{mascota.peso}</p>
                <p>{mascota.created_at.slice(0,10).split("-")}</p>
                <button onClick={(e) => {e.preventDefault(); setEditanto(true)}}>Editar informacion</button>
                <button onClick={() => deleteMascota(mascota.id)}>Borrar mascota</button>
            </div>
        )
    };

    const renderMascotaForm = () => {
        return (
            <div>
                <form onSubmit={(e) => {e.preventDefault(); updateMascota()}}>
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
                    {mensaje !== "" && <p>{mensaje}</p>}
                    <button type="submit">Guardar cambios</button>
                </form>
            </div>
        )
    };

    const renderFinal = () => {
        return (
            <div>
                {editando
                    ? renderMascotaForm()
                    : renderMascotaInfo()
                }
            </div>
        )
    };

    return { renderFinal };

};

export default UseUpdateMascotaForm;