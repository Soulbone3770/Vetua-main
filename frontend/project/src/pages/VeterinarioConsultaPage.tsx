import {useParams} from "react-router-dom";
import type {ConsultaDataType} from "../types/DataType.ts";
import {useCallback, useEffect, useState} from "react";
import type {ConsultasType} from "../types/ConsultasType.ts";
import { Pagina, FormCard, Dato, Cargando, MensajeError } from "../components/FormUI.tsx";
import { formatFecha } from "../utils/formatFecha.ts";

const API_URL = import.meta.env.VITE_API_URL;

const VeterinarioConsultaPage = () => {

    const { consultaId, veterinarioId } = useParams();
    const[consulta, setConsulta] = useState<ConsultasType>();
    const[cargando, setCargando] = useState(true);

    const getConsultaByParams = useCallback(async() => {

        try {
            const res: Response = await fetch(`${API_URL}/consultas/api/getConsultaByParams/${consultaId}/${veterinarioId}`, {
                credentials: "include"
            });

            const data: ConsultaDataType = await res.json();

            if(data.error){
                alert(data.error);
                return
            }

            setConsulta(data.consulta);
        } finally {
            setCargando(false);
        }

    },[consultaId, veterinarioId]);

    useEffect(() => {
        const get = async() => {
            await getConsultaByParams();
        }

        get();
    },[getConsultaByParams]);

    const renderContenido = () => {
        if(!veterinarioId) return <MensajeError texto="No se pudo obtener el id del veterinario." />
        if(cargando) return <Cargando />
        if(!consulta) return <MensajeError texto="No se pudo obtener la consulta." />

        return (
            <>
                <FormCard titulo="Datos de la consulta">
                    <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
                        <Dato label="Motivo de la consulta" valor={consulta.motivo_consulta} />
                        <Dato label="Fecha" valor={formatFecha(consulta.fecha_hora)} />
                        <Dato label="Costo" valor={consulta.costo} />
                    </div>
                </FormCard>

                <FormCard titulo="Signos vitales">
                    <div className="grid grid-cols-1 gap-x-8 md:grid-cols-3">
                        <Dato label="Peso en consulta" valor={consulta.peso_en_consulta} />
                        <Dato label="Temperatura" valor={consulta.temperatura} />
                        <Dato label="Frecuencia cardiaca" valor={consulta.frecuencia_cardiaca} />
                    </div>
                </FormCard>

                <FormCard titulo="Diagnóstico y tratamiento">
                    <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
                        <Dato label="Síntomas" valor={consulta.sintomas} />
                        <Dato label="Diagnóstico" valor={consulta.diagnostico} />
                        <Dato label="Tratamiento indicado" valor={consulta.tratamiento_indicado} />
                        <Dato label="Observaciones" valor={consulta.observaciones} />
                    </div>
                </FormCard>
            </>
        )
    };

    return (
        <Pagina titulo="Registro médico" ancho="max-w-4xl" rolLabel="Veterinario" volverA="/veterinarioPage/veterinarioBuscarConsulta">
            {renderContenido()}
        </Pagina>
    );
};

export default VeterinarioConsultaPage;