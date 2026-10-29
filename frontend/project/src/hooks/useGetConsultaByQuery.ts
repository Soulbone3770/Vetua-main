import { useEffect, useState} from "react";
import type {ConsultasType} from "../types/ConsultasType.ts";
import type {ConsultaDataType} from "../types/DataType.ts";

const API_URL = import.meta.env.VITE_API_URL;

const useGetConsultaByQuery = (veterinarioId: number, clinicaId: number) => {

    const[consulta, setConsulta] = useState<ConsultasType>();
    const[mensaje, setMensaje] = useState("");

    useEffect(() => {
        const getConsultas = async() => {

            const params = new URLSearchParams({veterinarioId: String(veterinarioId), clinicaId: String(clinicaId)});

            const res: Response = await fetch(`${API_URL}/consultas/api/getConsultas?${params.toString()}`, {
                credentials: "include"
            });

            const data: ConsultaDataType = await res.json();

            if(data.vacio && data.mensaje){
                setMensaje(data.mensaje);
                return
            }

            if(data.mensaje){
                setMensaje(data.mensaje);
                return
            }

            if(!data.ok){
                alert(data.error);
            }

            setConsulta(data.consulta);

        };

        getConsultas();
    }, []);

    return { consulta, mensaje }

};

export default useGetConsultaByQuery;