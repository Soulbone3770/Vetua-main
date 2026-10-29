import useAuth from "../hooks/useAuth.ts";
import type { EstadisticasDataType } from "../types/DataType.ts";
import {useEffect, useState} from "react";
import type {EstadisticasType} from "../types/EstadisticasType.ts";

const API_URL = import.meta.env.VITE_API_URL;

const AdminClinicaEstadisticasPage = () => {

    const { usuario } = useAuth();

    const[estadisticas, setEstadisticas] = useState<EstadisticasType>()
    const[mensaje, setMensaje] = useState("");

    const clinicaId = usuario?.clinicaId;

    useEffect(() => {
        const getEstadisticas = async() => {

            const res: Response = await fetch(`${API_URL}/clinicas/api/getEstadisticas/${clinicaId}`);

            const data: EstadisticasDataType = await res.json();

            if(data.mensaje){
                setMensaje(data.mensaje);
                return
            }

            if(data.error){
                alert(data.error);
                return
            }

            setEstadisticas(data.estadisticas);

        }

        getEstadisticas();
    }, [clinicaId]);

    if(mensaje !== "") return <p>{mensaje}</p>

    if(!estadisticas) return <p>NO HAY ESTADISTICAS</p>

    return (
        <div>
            <h2>Total de mascotas</h2>
            <p>{estadisticas.totalMascotas}</p>
            <h2>Total de citas</h2>
            <p>{estadisticas.totalCitas}</p>
        </div>
    )

};

export default AdminClinicaEstadisticasPage;