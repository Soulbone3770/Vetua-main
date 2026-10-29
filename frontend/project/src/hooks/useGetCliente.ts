import {useState} from "react";
import type {ClienteType} from "../types/ClienteType.ts";
import type {TipoDocumentoType} from "../types/TipoDocumentoType.ts";
import type {ClienteDataType} from "../types/DataType.ts";

const API_URL = import.meta.env.VITE_API_URL;

const useGetCliente = (clienteNumDocumento: string, clienteTipoDocumento: TipoDocumentoType) => {

    const[cliente, setCliente] = useState<ClienteType>();
    const[noCliente, setNoCliente] = useState("");

    const getCliente = async() => {

        const params = new URLSearchParams({
            clienteNumDocumento,
            clienteTipoDocumento
        });

        const res: Response = await fetch(`${API_URL}/clientes/api/getClienteByDocumento?${params.toString()}`, {
            credentials: "include"
        });

        const data: ClienteDataType = await res.json();

        if(data.mensaje){
            setNoCliente(data.mensaje);
            return
        }

        if(!data.ok){
            alert(data.error);
            return
        } else if(data.cliente){
            setCliente(data.cliente);
            setNoCliente("");
        }

    };

    return { cliente, noCliente, getCliente }

};

export default useGetCliente;