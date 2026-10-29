import {useEffect, useState} from "react";
import type {ConsultasType} from "../types/ConsultasType.ts";
import type {ConsultaDataType} from "../types/DataType.ts";

const API_URL = import.meta.env.VITE_API_URL;

const useGetConsultas = (veterinarioId: number) => {

    const [consultas, setConsultas] = useState<ConsultasType[]>([]);
    const [mensaje, setMensaje] = useState("");

    const params = new URLSearchParams({
        veterinarioId: String(veterinarioId)
    })

    useEffect(() => {
        const getConsultas = async() => {

            const res: Response = await fetch(`${API_URL}/consultas/api/getConsultas?${params.toString()}`, {
                credentials: "include"
            });

            const data: ConsultaDataType = await res.json();

            if(data.mensaje){
                setMensaje(data.mensaje);
                return
            }

            if(!data.ok){
                alert(data.error);
                return
            }

            if(data.consultas){
                setConsultas(data.consultas);
            }

        };

        getConsultas();
    }, []);

    return { consultas, mensaje };

}

export default useGetConsultas;