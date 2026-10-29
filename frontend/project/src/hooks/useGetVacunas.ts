import {useState} from "react";
import type {VacunasType} from "../types/VacunasType.ts";
import type {VacunasDataType} from "../types/DataType.ts";

const API_URL = import.meta.env.VITE_API_URL;

const useGetVacunas = () => {

    const[vacunas, setVacunas] = useState<VacunasType[]>([]);
    const[noVacunas, setNoVacunas] = useState("");

    const getVacunas = async() => {

        const res: Response = await fetch(`${API_URL}/vacunas/api/getVacunas`, {
            credentials: "include"
        });

        const data: VacunasDataType = await res.json();

        if(data.mensaje){
            setNoVacunas(data.mensaje);
            return
        }

        if(data.error){
            alert(data.error);
        } else {
            setVacunas(data.vacunas);
            setNoVacunas("");
        }

    };

    return { vacunas, noVacunas, getVacunas };

};

export default useGetVacunas;