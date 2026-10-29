import type {DataType} from "../types/DataType.ts";
import {useState} from "react";

const API_URL = import.meta.env.VITE_API_URL;

const useReprogramarCita = () => {

    const[reprogramando, setReprogramando] = useState(false);

    const reprogramar = async(fecha_hora: string, id: number) => {

        const res: Response = await fetch(`${API_URL}/citas/api/reprogramarCita`, {
            credentials: "include",
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({fecha_hora, id})
        });

        const data: DataType = await res.json();

        if(data.error){
            alert(data.error);
            return
        }

        if(data.ok){
            console.log(data.exito);
            setReprogramando(false);
        }

    };

    return { reprogramar, reprogramando, setReprogramando };

};

export default useReprogramarCita;