import useGetConsultas from "../hooks/useGetConsultas.ts";
import useBarraBusqueda from "../hooks/useBarraBusqueda.tsx";
import type {ConsultasType} from "../types/ConsultasType.ts";
import {useNavigate} from "react-router-dom";
import useAuth from "../hooks/useAuth.ts";
import PanelLayout from "../components/PanelLayout.tsx";

const VeterinarioBuscarConsultas = () => {

    const navigate = useNavigate();
    const  { usuario } = useAuth();

    const veterinarioId = usuario ? usuario.id : 0

    const { consultas, mensaje: noConsultas } = useGetConsultas(veterinarioId);
    const {array: consultasArray, renderBarra} = useBarraBusqueda<ConsultasType>({criterioBusqueda: "motivo_consulta", arrayBusqueda: consultas});

    const renderConsultas = () => {
        return (
            <div className="vet-lista">
                {consultasArray.map(consulta => (
                    <button
                        type="button"
                        key={consulta.id}
                        className="vet-fila"
                        onClick={() => navigate(`/veterinarioPage/veterinarioConsultaPage/${consulta.id}/${consulta.id_veterinario}`)}
                    >
                        <div>
                            <h3>{consulta.motivo_consulta}</h3>
                            <p>{consulta.fecha_hora}</p>
                        </div>
                        <span className="flecha" aria-hidden="true">›</span>
                    </button>
                ))}
            </div>
        )
    }

    return (
        <PanelLayout titulo="Consultar registros médicos" rol="Veterinario" onBack={() => navigate("/veterinarioPage")}>
            <main className="vet-contenido">
                <div className="vet-busqueda">
                    {renderBarra()}
                </div>
                {noConsultas
                    ? <p className="vet-aviso">{noConsultas}</p>
                    : renderConsultas()
                }
            </main>
        </PanelLayout>
    )

};

export default VeterinarioBuscarConsultas;