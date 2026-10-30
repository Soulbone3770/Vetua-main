import useGetCitas from "../hooks/useGetCitas.ts";
import {useNavigate} from "react-router-dom";
import {ESTADOS, EstadosCita} from "../types/CitasType.ts";
import useForm from "../hooks/useForm.ts";
import {useMemo, useState} from "react";
import useAuth from "../hooks/useAuth.ts";
import Input from "../components/Input.tsx";
import { Pagina, FormCard, SelectField, FilaLista, MensajeError, BOTON_PRINCIPAL, BOTON_SECUNDARIO } from "../components/FormUI.tsx";
import { etiquetaRol, rutaInicio } from "../utils/rolInfo.ts";
import { formatFecha } from "../utils/formatFecha.ts";

const RecBuscarCitas = () => {

    const navigate = useNavigate();
    const { rol } = useAuth();
    const { citas, mensaje } = useGetCitas();
    const { valores, handleOnChange, resetForm } = useForm({estadoFiltro: "", fechaFiltro: ""});

    // Filtro aplicado (solo cambia al pulsar "Filtrar")
    const[filtro, setFiltro] = useState({ estado: "", fecha: "" });

    const citasFiltradas = useMemo(() => citas.filter(c =>
        (filtro.estado === "" || c.estado === filtro.estado) &&
        (filtro.fecha === "" || c.fecha_hora.slice(0, 10) === filtro.fecha)
    ), [citas, filtro]);

    return (
        <Pagina titulo="Consultar citas" ancho="max-w-3xl" rolLabel={etiquetaRol(rol)} volverA={rutaInicio(rol)}>
            <FormCard titulo="Filtrar citas">
                <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
                    <SelectField name="estadoFiltro" label="Filtrar por estado" value={valores.estadoFiltro} onChange={handleOnChange}>
                        <option value="">Todos los estados</option>
                        {ESTADOS.map(e => (
                            <option key={e} value={EstadosCita[e]}>{e}</option>
                        ))}
                    </SelectField>
                    <Input label="Filtrar por fecha" type="date" name="fechaFiltro" value={valores.fechaFiltro} onChange={handleOnChange} />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <button type="button" className={BOTON_SECUNDARIO} onClick={() => { resetForm(); setFiltro({ estado: "", fecha: "" }); }}>
                        Borrar filtro
                    </button>
                    <button type="button" className={BOTON_PRINCIPAL} onClick={() => setFiltro({ estado: valores.estadoFiltro, fecha: valores.fechaFiltro })}>
                        Filtrar
                    </button>
                </div>
            </FormCard>

            <FormCard titulo="Citas">
                <div className="min-h-48">
                    {mensaje
                        ? <MensajeError texto={mensaje} />
                        : citasFiltradas.length === 0
                            ? <p className="py-4 text-sm text-gray-500">No se encontraron citas</p>
                            : citasFiltradas.map(c => (
                                <FilaLista
                                    key={c.id}
                                    titulo={c.motivo}
                                    lineas={[["Estado", c.estado], ["Fecha", formatFecha(c.fecha_hora)]]}
                                    onClick={() => navigate(`/recCitaPage/${c.id}`)}
                                />
                            ))
                    }
                </div>
            </FormCard>
        </Pagina>
    );
};

export default RecBuscarCitas;