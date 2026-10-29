import {useState} from "react";
import type {MascotaType} from "../types/MascotaType.ts";
import type {MascotasDataType} from "../types/DataType.ts";
import type {TipoDocumentoType} from "../types/TipoDocumentoType.ts";

const API_URL = import.meta.env.VITE_API_URL;

const useGetMascotas = (clienteNumDocumento: string, clienteTipoDocumento: TipoDocumentoType) => {

    const[mascotas, setMascotas] = useState<MascotaType[]>([]);
    const[noMascotas, setNoMascotas] = useState("");

    const getMascotas = async() => {

        const params = new URLSearchParams({
            clienteNumDocumento,
            clienteTipoDocumento
        });

        const res: Response = await fetch(`${API_URL}/mascotas/api/getMascota?${params.toString()}`, {
            credentials: "include"
        });

        const data: MascotasDataType = await res.json();

        if(data.mensaje){
            setNoMascotas(data.mensaje);
            return
        }

        if(!data.ok){
            alert(data.error);
            return
        } else if(data.mascotas){
            setMascotas(data.mascotas);
            setNoMascotas("");
        }

    };

    return { mascotas, noMascotas, getMascotas }

};

export default useGetMascotas;