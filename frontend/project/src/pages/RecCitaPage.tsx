import {useParams} from "react-router-dom";
import useGetCitaByParams from "../hooks/useGetCitaByParams.ts";
import {ESTADOS, EstadosCita, type EstadosCitaType} from "../types/CitasType.ts";
import useForm from "../hooks/useForm.ts";
import useChangeEstadoCita from '../hooks/useChangeEstadoCita.ts';
import useReprogramarCita from "../hooks/useReprogramarCita.ts";
import useAuth from "../hooks/useAuth.ts";
import Input from "../components/Input.tsx";
import { Pagina, FormCard, SelectField, Dato, Cargando, MensajeError, BOTON_PRINCIPAL, BOTON_SECUNDARIO } from "../components/FormUI.tsx";
import { etiquetaRol } from "../utils/rolInfo.ts";
import { formatFecha } from "../utils/formatFecha.ts";

const RecCitaPage = () => {

    const { id } = useParams();
    const citaId = Number(id);
    const { rol } = useAuth();

    const { cita, mensaje } = useGetCitaByParams(citaId);
    const { valores, handleOnChange } = useForm({"estado": "" as EstadosCitaType, fecha_hora: ""});
    const { changeCita, editandoEstado, setEditandoEstado } = useChangeEstadoCita();
    const { reprogramar, reprogramando, setReprogramando} = useReprogramarCita();

    // Fecha de hoy en formato AAAA-MM-DD (mínimo permitido al reprogramar)
    const hoy = new Date().toISOString().slice(0, 10);

    const renderContenido = () => {
        if(mensaje) return <MensajeError texto={mensaje} />
        if(!cita) return <Cargando />

        return (
            <>
                <FormCard titulo="Datos de la cita">
                    <div className="grid grid-cols-1 gap-x-8 md:grid-cols-3">
                        <Dato label="Motivo" valor={cita.motivo} />
                        <Dato label="Estado" valor={cita.estado} />
                        <Dato label="Fecha" valor={formatFecha(cita.fecha_hora)} />
                    </div>
                </FormCard>

                <FormCard titulo="Estado de la cita">
                    {editandoEstado
                        ? <>
                            <SelectField name="estado" label="Nuevo estado" value={valores.estado} onChange={handleOnChange}>
                                <option value="">Selecciona un estado</option>
                                {ESTADOS.map(e => (
                                    <option key={e} value={EstadosCita[e]}>{e}</option>
                                ))}
                            </SelectField>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <button type="button" className={BOTON_SECUNDARIO} onClick={() => setEditandoEstado(false)}>Cancelar</button>
                                <button type="button" className={BOTON_PRINCIPAL} disabled={!valores.estado} onClick={() => changeCita(valores.estado, citaId)}>
                                    Guardar estado →
                                </button>
                            </div>
                          </>
                        : <button type="button" className={BOTON_PRINCIPAL} onClick={() => setEditandoEstado(true)}>Editar estado de la cita →</button>
                    }
                </FormCard>

                <FormCard titulo="Reprogramar cita">
                    {reprogramando
                        ? <>
                            <Input label="Nueva fecha" type="date" name="fecha_hora" value={valores.fecha_hora} onChange={handleOnChange} />
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <button type="button" className={BOTON_SECUNDARIO} onClick={() => setReprogramando(false)}>Cancelar</button>
                                <button type="button" className={BOTON_PRINCIPAL} disabled={valores.fecha_hora === "" || valores.fecha_hora < hoy} onClick={() => reprogramar(valores.fecha_hora, citaId)}>
                                    Reprogramar →
                                </button>
                            </div>
                          </>
                        : <button type="button" className={BOTON_PRINCIPAL} onClick={() => setReprogramando(true)}>Reprogramar cita →</button>
                    }
                </FormCard>
            </>
        )
    };

    return (
        <Pagina titulo="Cita" ancho="max-w-3xl" rolLabel={etiquetaRol(rol)} volverA={-1}>
            {renderContenido()}
        </Pagina>
    )
};

export default RecCitaPage;