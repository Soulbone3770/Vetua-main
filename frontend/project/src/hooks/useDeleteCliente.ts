import type {DataType} from "../types/DataType.ts";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const useDeleteCliente = () => {

    const navigate = useNavigate();

    const deleteCliente = async(id: number) => {

        const confirmar = window.confirm("Esta seguro que quiere borrar este cliente? Se eliminaran todas las mascotas registradas a este");

        if(!confirmar){
            return
        }

        const res: Response = await fetch(`${API_URL}/clientes/api/deleteCliente/${id}`, {
            credentials: "include",
            method: "DELETE"
        });

        const data: DataType = await res.json();

        if(data.error){
            alert(data.error);
            return
        }

        alert(data.exito ?? "No hubo exito");
        navigate(-1);

    };

    return { deleteCliente };

};

export default useDeleteCliente;