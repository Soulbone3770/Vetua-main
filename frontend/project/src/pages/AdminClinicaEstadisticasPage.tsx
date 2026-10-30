import useAuth from "../hooks/useAuth.ts";
import type { EstadisticasDataType } from "../types/DataType.ts";
import {useEffect, useState} from "react";
import type {EstadisticasType} from "../types/EstadisticasType.ts";
import { Pagina, Cargando, MensajeError } from "../components/FormUI.tsx";

const API_URL = import.meta.env.VITE_API_URL;

const Estadistica = ({ titulo, valor, color }: { titulo: string; valor: number | string; color: string }) => (
    <div className="overflow-hidden rounded-xl bg-white text-center shadow-md">
        <div className="h-5" style={{ backgroundColor: color }} />
        <div className="px-6 py-8">
            <h3 className="border-b border-gray-700 pb-2 text-xl font-bold !text-black">{titulo}</h3>
            <p className="mt-6 text-6xl font-light text-gray-700">{valor}</p>
        </div>
    </div>
);

const AdminClinicaEstadisticasPage = () => {

    const { usuario } = useAuth();

    const[estadisticas, setEstadisticas] = useState<EstadisticasType>()
    const[mensaje, setMensaje] = useState("");

    const clinicaId = usuario?.clinicaId;

    useEffect(() => {
        // Esperamos a que la sesión esté cargada
        if(clinicaId === undefined) return;

        const getEstadisticas = async() => {

            const res: Response = await fetch(`${API_URL}/clinicas/api/getEstadisticas/${clinicaId}`, {
                credentials: "include"
            });

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

    return (
        <Pagina titulo="Estadísticas" ancho="max-w-3xl" rolLabel="Admin clínica" volverA="/adminClinicaPage">
            {mensaje !== ""
                ? <MensajeError texto={mensaje} />
                : !estadisticas
                    ? <Cargando />
                    : (
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            <Estadistica titulo="Total de mascotas" valor={estadisticas.totalMascotas} color="#4C00C8" />
                            <Estadistica titulo="Total de citas" valor={estadisticas.totalCitas} color="#8B3A3A" />
                        </div>
                    )
            }
        </Pagina>
    )

};

export default AdminClinicaEstadisticasPage;