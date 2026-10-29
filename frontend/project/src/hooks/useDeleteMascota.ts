import type {DataType} from "../types/DataType.ts";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const useDeleteMascota = () => {

    const navigate = useNavigate();

    const deleteMascota = async(id: number) => {

        const confirmar = window.confirm("Esta seguro que quiere borrar esta mascota? Se eliminaran todos los registros y citas asociadas a esta");

        if(!confirmar){
            return
        }

        const res: Response = await fetch(`${API_URL}/mascotas/api/deleteMascota/${id}`, {
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

    return { deleteMascota };

};

export default useDeleteMascota;