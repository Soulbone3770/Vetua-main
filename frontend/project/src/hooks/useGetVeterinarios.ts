import {useCallback, useEffect, useState} from "react";
import type {VeterinarioDataType} from "../types/DataType.ts";
import type {ClinicaUserType} from "../types/ClinicaUserType.ts";
import useAuth from "./useAuth.ts";

const API_URL = import.meta.env.VITE_API_URL;

const useGetVeterinarios = () => {

    const { usuario } = useAuth();

    const clinicaId = usuario?.clinicaId;

    const [veterinarios, setVeterinarios] = useState<ClinicaUserType[]>([]);
    const [noVeterinarios, setNoVeterinarios] = useState("");

    const getVeterinarios = useCallback(async() => {

        // Esperamos a que el usuario (y su clínica) estén cargados
        if(clinicaId === undefined) return;

        const params = new URLSearchParams({
            clId: String(clinicaId)
        });

        const res: Response = await fetch(`${API_URL}/users/api/getVeterinarios?${params.toString()}`, {
            credentials: "include"
        });

        const data: VeterinarioDataType = await res.json();

        if(data.mensaje){
            setNoVeterinarios(data.mensaje);
            return
        }

        if(!data.ok){
            alert(data.error);
            return
        } else if(data.veterinarios){
            setVeterinarios(data.veterinarios);
        }

    },[clinicaId]);

    useEffect(() => {
       
        getVeterinarios()
    }, [getVeterinarios]);

    return { veterinarios, noVeterinarios, getVeterinarios }
};

export default useGetVeterinarios;