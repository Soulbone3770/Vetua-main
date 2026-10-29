import {useEffect, useState} from "react";
import type {CitasType} from "../types/CitasType.ts";
import type {CitaDataType} from "../types/DataType.ts";

const API_URL = import.meta.env.VITE_API_URL;

const useGetCitaByParams = (id: number) => {

    const[cita, setCita] = useState<CitasType>();
    const[mensaje, setMensaje] = useState("");

    useEffect(() => {
        const getCita = async() => {

            const res: Response = await fetch(`${API_URL}/citas/api/getCitaByParams/${id}`, {
                credentials: "include"
            });

            const data: CitaDataType = await res.json();

            if(data.mensaje){
                setMensaje(data.mensaje);
                return
            }

            if(data.error){
                alert(data.error);
                return
            }

            setCita(data.cita);
        };

        getCita();
    }, [id, cita]);

    return { cita, mensaje };

};

export default useGetCitaByParams;