import {useNavigate, useParams} from "react-router-dom";
import type {ConsultaDataType} from "../types/DataType.ts";
import {useCallback, useEffect, useState} from "react";
import type {ConsultasType} from "../types/ConsultasType.ts";
import PanelLayout from "../components/PanelLayout.tsx";

const API_URL = import.meta.env.VITE_API_URL;

const VeterinarioConsultaPage = () => {

    const navigate = useNavigate();
    const { consultaId, veterinarioId } = useParams();
    const[consulta, setConsulta] = useState<ConsultasType>();

    const getConsultaByParams = useCallback(async() => {

        const res: Response = await fetch(`${API_URL}/consultas/api/getConsultaByParams/${consultaId}/${veterinarioId}`, {
            credentials: "include"
        });

        const data: ConsultaDataType = await res.json();

        if(data.error){
            alert(data.error);
            return
        }

        setConsulta(data.consulta);

    },[consultaId, veterinarioId]);

    useEffect(() => {
        const get = async() => {
            await getConsultaByParams();
        }

        get();
    },[getConsultaByParams]);

    const volver = () => navigate("/veterinarioPage/veterinarioBuscarConsulta");

    if(!veterinarioId) return (
        <PanelLayout titulo="Registro médico" rol="Veterinario" onBack={volver}>
            <main className="vet-contenido"><p className="vet-aviso">No se pudo obtener el id del veterinario.</p></main>
        </PanelLayout>
    );

    if(!consulta) return (
        <PanelLayout titulo="Registro médico" rol="Veterinario" onBack={volver}>
            <main className="vet-contenido"><p className="vet-aviso">No se pudo obtener la consulta.</p></main>
        </PanelLayout>
    );

    return (
        <PanelLayout titulo="Registro médico" rol="Veterinario" onBack={volver}>
            <main className="vet-contenido">
                <article className="vet-detalle">

                    <h2>{consulta.motivo_consulta}</h2>
                    <p className="fecha">{consulta.fecha_hora}</p>

                    <div className="vet-datos">
                        <div className="vet-dato"><span>Peso en consulta</span><strong>{consulta.peso_en_consulta}</strong></div>
                        <div className="vet-dato"><span>Temperatura</span><strong>{consulta.temperatura}</strong></div>
                        <div className="vet-dato"><span>Frecuencia cardiaca</span><strong>{consulta.frecuencia_cardiaca}</strong></div>
                        <div className="vet-dato"><span>Costo</span><strong>{consulta.costo}</strong></div>
                    </div>

                    <section className="vet-bloque">
                        <h4>Síntomas</h4>
                        <p>{consulta.sintomas}</p>
                    </section>
                    <section className="vet-bloque">
                        <h4>Diagnóstico</h4>
                        <p>{consulta.diagnostico}</p>
                    </section>
                    <section className="vet-bloque">
                        <h4>Tratamiento indicado</h4>
                        <p>{consulta.tratamiento_indicado}</p>
                    </section>
                    <section className="vet-bloque">
                        <h4>Observaciones</h4>
                        <p>{consulta.observaciones}</p>
                    </section>
                </article>
            </main>
        </PanelLayout>
    );
};

export default VeterinarioConsultaPage;