import {useParams} from "react-router-dom";
import type {ClienteDataType} from "../types/DataType.ts";
import {useCallback, useEffect, useState} from "react";
import type {ClienteType} from "../types/ClienteType.ts";
import useUpdateClienteForm from "../hooks/useUpdateClienteForm.tsx";
import useAuth from "../hooks/useAuth.ts";
import { Pagina } from "../components/FormUI.tsx";

const API_URL = import.meta.env.VITE_API_URL;

const ETIQUETA_ROL: Record<string, string> = {
    recepcionista: "Recepcionista",
    veterinario: "Veterinario",
    adminClinica: "Administrador",
    adminSistema: "Administrador",
};

const RecPaginaCliente = () => {

    const {clienteId} = useParams();
    const { rol } = useAuth();

    const[mensaje, setMensaje] = useState("");
    const[cliente, setCliente] = useState<ClienteType>();

    const getCliente = useCallback(async() => {

        const res: Response = await fetch(`${API_URL}/clientes/api/getClienteByParams/${clienteId}`, {
            credentials: "include"
        });

        const data: ClienteDataType = await res.json();

        if(data.mensaje){
            setMensaje(data.mensaje);
            return
        }

        if(!data.ok){
            alert(JSON.stringify(data.error));
            return
        } else if(data.cliente) {
            setCliente(data.cliente);
        }

    },[clienteId]);

    const { renderFinal } = useUpdateClienteForm(cliente, getCliente);

    useEffect(() => {
       
        getCliente();
    },[getCliente]);

    return (
        <Pagina titulo="Cliente" rolLabel={ETIQUETA_ROL[rol] ?? "Usuario"} volverA={-1}>
            {mensaje !== ""
                ? <p className="text-sm font-medium text-red-500">{mensaje}</p>
                : !cliente
                    ? <h1 className="animate-pulse text-center text-xl font-semibold !text-purple-700">CARGANDO...</h1>
                    : renderFinal()
            }
        </Pagina>
    );
};

export default RecPaginaCliente;