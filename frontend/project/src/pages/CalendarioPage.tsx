import {useEffect, useState} from "react";
import type {CitasDataType} from "../types/DataType.ts";
import type {CitasType} from "../types/CitasType.ts";
import { Pagina, FormCard, MensajeError } from "../components/FormUI.tsx";
import useAuth from "../hooks/useAuth.ts";
import { etiquetaRol } from "../utils/rolInfo.ts";
import { formatFecha } from "../utils/formatFecha.ts";

const API_URL = import.meta.env.VITE_API_URL;

const CalendarioPage = () => {

    const { rol } = useAuth();
    const [citas, setCitas] = useState<CitasType[]>([]);
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        const getCitas = async() => {

            const res: Response = await fetch(`${API_URL}/citas/api/getCitasManana`, {
                credentials: "include"
            });

            const data: CitasDataType = await res.json();

            if(data.mensaje){
                setMensaje(data.mensaje);
                return
            }

            if(data.error){
                alert(data.error);
                return
            }

            if(data.ok){
                setCitas(data.citas);
                setMensaje("");
                return
            }

        }

        getCitas();
    },[]);

    return (
        <Pagina titulo="Calendario" ancho="max-w-3xl" rolLabel={etiquetaRol(rol)} volverA={-1}>
            <FormCard titulo="Citas de mañana">
                <div className="min-h-48 text-left">
                    {mensaje !== ""
                        ? <MensajeError texto={mensaje} />
                        : citas.length === 0
                            ? <p className="py-4 text-sm text-gray-500">No hay citas programadas</p>
                            : citas.map(c => (
                                <div key={c.id} className="border-b border-gray-300 px-1 py-3 last:border-b-0">
                                    <p className="text-lg font-semibold text-gray-600">{c.motivo}</p>
                                    <p className="text-sm text-gray-900"><span className="font-bold">Estado:</span> {c.estado}</p>
                                    <p className="text-sm text-gray-900"><span className="font-bold">Fecha:</span> {formatFecha(c.fecha_hora)}</p>
                                </div>
                            ))
                    }
                </div>
            </FormCard>
        </Pagina>
    )

};

export default CalendarioPage;