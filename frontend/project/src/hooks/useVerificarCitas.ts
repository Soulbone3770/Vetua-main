import type {TipoDocumentoType} from "../types/TipoDocumentoType.ts";
import type {DataType} from "../types/DataType.ts";
import {useNavigate} from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const useVerificarCitas = (clienteTipoDocumento: TipoDocumentoType, clienteNumDocumento: string) => {

    const navigate = useNavigate();

    interface VerificarCitaDataType extends DataType{
        hayCitas: boolean;
        notificacion: string;
    }

    const params = new URLSearchParams({
        clienteTipoDocumento,
        clienteNumDocumento
    })

    const verificar = async() => {

        const res: Response = await fetch(`${API_URL}/citas/api/getCitas?${params.toString()}`, {
            credentials: "include",
        });

        const data: VerificarCitaDataType = await res.json();

        if(data.mensaje){
            alert(data.mensaje);
        }

        if(!data.ok){
            alert(data.error);
            return
        }

        if(data.hayCitas){
            const continuar = confirm(data.notificacion);
            if(continuar){
                return
            } else {
                navigate("/RecepcionistaPage", {replace: true});
                return
            }
        }

    }

    return { verificar }

};

export default useVerificarCitas;