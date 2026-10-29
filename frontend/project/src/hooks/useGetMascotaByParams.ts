import {useCallback, useEffect, useState} from "react";
import type {MascotaType} from "../types/MascotaType.ts";
import type {MascotaDataType} from "../types/DataType.ts";

const API_URL = import.meta.env.VITE_API_URL;

const useGetMascotaByParams = (id: number) => {

    const[mascota, setMascota] = useState<MascotaType>();
    const[mensaje, setMensaje] = useState("");

    const getMascota = useCallback(async() => {

        const res: Response = await fetch(`${API_URL}/mascotas/api/getMascotaByParams/${id}`, {
            credentials: "include"
        });

        const data: MascotaDataType = await res.json();

        if(data.mensaje){
            setMensaje(data.mensaje);
        }

        if(data.error){
            alert(data.error);
            return
        }

        setMascota(data.mascota);
        setMensaje("");

    },[id]);

    useEffect(() => {
        const get = async() => {
            await getMascota();
        }

        get();

    }, [getMascota]);

    return { mascota, mensaje, getMascota };

};

export default useGetMascotaByParams;