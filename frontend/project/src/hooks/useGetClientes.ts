import {useCallback, useEffect, useState} from "react";
import type { ClienteType } from "../types/ClienteType.ts";
import type {ClienteDataType} from "../types/DataType.ts";

const API_URL = import.meta.env.VITE_API_URL;

const useGetClientes = () => {

    const[clientes, setClientes] = useState<ClienteType[]>([]);
    const[mensaje, setMensaje] = useState("");
    const[loading, setLoading] = useState(false);

    const getCliente = useCallback(async() => {

        setLoading(true);

        const res: Response = await fetch(`${API_URL}/clientes/api/getClientes`, {
            credentials: "include"
        });

        const data: ClienteDataType = await res.json();

        if(data.mensaje){
            setMensaje(data.mensaje);
            setLoading(false);
            return
        }

        if(!data.ok){
            alert(data.error);
            setLoading(false);
            return
        } else if(data.clientes){
            setClientes(data.clientes);
            setLoading(false);
        }

    },[]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        getCliente()
    },[getCliente]);

    return { clientes, mensaje, loading, getCliente };

};

export default useGetClientes;