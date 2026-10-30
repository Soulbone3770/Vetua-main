import useGetConsultas from "../hooks/useGetConsultas.ts";
import useBarraBusqueda from "../hooks/useBarraBusqueda.tsx";
import type {ConsultasType} from "../types/ConsultasType.ts";
import {useNavigate} from "react-router-dom";
import useAuth from "../hooks/useAuth.ts";
import { Pagina, FormCard, FilaLista, MensajeError } from "../components/FormUI.tsx";
import { formatFecha } from "../utils/formatFecha.ts";

const VeterinarioBuscarConsultas = () => {

    const navigate = useNavigate();
    const  { usuario } = useAuth();

    const veterinarioId = usuario ? usuario.id : 0

    const { consultas, mensaje: noConsultas } = useGetConsultas(veterinarioId);
    const {array: consultasArray, renderBarra} = useBarraBusqueda<ConsultasType>({criterioBusqueda: "motivo_consulta", arrayBusqueda: consultas});

    const renderConsultas = () => {
        if(consultasArray.length === 0){
            return <p className="py-4 text-sm text-gray-500">No hay registros médicos</p>
        }

        return consultasArray.map(consulta => (
            <FilaLista
                key={consulta.id}
                titulo={consulta.motivo_consulta}
                lineas={[["Fecha", formatFecha(consulta.fecha_hora)]]}
                onClick={() => navigate(`/veterinarioPage/veterinarioConsultaPage/${consulta.id}/${consulta.id_veterinario}`)}
            />
        ))
    }

    return (
        <Pagina titulo="Consultar registros" ancho="max-w-3xl" rolLabel="Veterinario" volverA="/veterinarioPage">
            <div className="text-left text-sm font-bold text-black">
                {renderBarra()}
            </div>
            <FormCard titulo="Registros médicos">
                <div className="min-h-64">
                    {noConsultas
                        ? <MensajeError texto={noConsultas} />
                        : renderConsultas()
                    }
                </div>
            </FormCard>
        </Pagina>
    )

};

export default VeterinarioBuscarConsultas;