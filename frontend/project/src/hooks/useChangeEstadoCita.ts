import type {EstadosCitaType} from "../types/CitasType.ts";
import type {DataType} from "../types/DataType.ts";
import {useState} from "react";

const API_URL = import.meta.env.VITE_API_URL;

const useChangeEstadoCita = () => {

    const[editandoEstado, setEditandoEstado] = useState(false);

    const changeCita = async(estado: EstadosCitaType, id: number) => {

        const res: Response = await fetch(`${API_URL}/citas/api/changeEstadoCita`, {
            credentials: "include",
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({estado, id})
        });

        const data: DataType = await res.json();

        if(data.error){
            alert(data.error);
            return
        }

        if(data.ok){
            setEditandoEstado(false);
        }

    }

    return { changeCita, editandoEstado, setEditandoEstado };

};

export default useChangeEstadoCita;