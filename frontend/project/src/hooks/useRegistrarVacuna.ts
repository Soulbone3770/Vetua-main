import type {VacunacionesInputType} from "../types/VacunacionesType.ts";
import type {DataType} from "../types/DataType.ts";
import {useState} from "react";

const API_URL = import.meta.env.VITE_API_URL;


const useRegistrarVacuna = () => {

    const[mensaje, setMensaje] = useState("");

    const registrarVacuna = async({ valores }: {valores: VacunacionesInputType}) => {

        const res: Response = await fetch(`${API_URL}/vacunas/api/createVacunacion`, {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(valores)
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

        alert(data.exito);
        setMensaje("");

    };

    return { mensaje, registrarVacuna };

};

export default useRegistrarVacuna;