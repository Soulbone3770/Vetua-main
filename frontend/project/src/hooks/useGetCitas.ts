import {useEffect, useState} from "react";
import type {CitasType} from "../types/CitasType.ts";
import type {CitasDataType} from "../types/DataType.ts";

const API_URL = import.meta.env.VITE_API_URL;

const useGetCitas = () => {

    const[citas, setCitas] = useState<CitasType[]>([]);
    const[mensaje, setMensaje] = useState("");

    useEffect(() => {
        const getCitas = async() => {

            const res: Response = await fetch(`${API_URL}/citas/api/getAllCitas`, {
                credentials: "include"
            });

            const data: CitasDataType = await res.json();

            if(data.mensaje){
                setMensaje(data.mensaje);
                return
            }

            if(data.error){
                alert(data.error);
                return
            }

            setCitas(data.citas);

        };

        getCitas();
    }, []);

    return { citas, mensaje };

};

export default useGetCitas;