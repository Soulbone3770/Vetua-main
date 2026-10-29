import useGetCitas from "../hooks/useGetCitas.ts";
import {useNavigate} from "react-router-dom";
import {ESTADOS, EstadosCita, type EstadosCitaType} from "../types/CitasType.ts";
import useForm from "../hooks/useForm.ts";
import {useEffect, useState} from "react";

const RecBuscarCitas = () => {

    const navigate = useNavigate();
    const { citas, mensaje } = useGetCitas();
    const { valores, handleOnChange, resetForm } = useForm({estadoFiltro: "" as EstadosCitaType | string, fechaFiltro: ""});
    const[citasFiltradas, setCitasFiltradas] = useState(citas);
    const[filtrando, setFiltrando] = useState(false);

    useEffect(() => {
        setCitasFiltradas(citas);
    },[citas])

    const filtrar = () => {
        if(valores.estadoFiltro === "" && valores.fechaFiltro === ""){
            setCitasFiltradas(citas);
            setFiltrando(false);
            return
        }

        if(valores.estadoFiltro === "" && valores.fechaFiltro !== ""){
            setCitasFiltradas(citas.filter(c => c.fecha_hora.slice(0, 10) === valores.fechaFiltro));
            setFiltrando(false);
            return
        }

        if(valores.estadoFiltro !== "" && valores.fechaFiltro === ""){
            setCitasFiltradas(citas.filter(c => c.estado === valores.estadoFiltro));
            setFiltrando(false);
            return
        }

        setCitasFiltradas(citas.filter(c => c.estado === valores.estadoFiltro && c.fecha_hora.slice(0, 10) === valores.fechaFiltro));
        setFiltrando(false);
    }

    const renderCitas = () => {
        if(citasFiltradas.length === 0){
            return <p>No se encontraron citas</p>
        }

        return citasFiltradas.map(c => {
            return (
                <div key={c.id} onClick={() => navigate(`/recCitaPage/${c.id}`)}>
                    <h2>{c.motivo}</h2>
                    <p>{c.estado}</p>
                    <p>{c.fecha_hora.slice(0, 10)}</p>
                </div>
            )
        })
    };

    const renderFiltro = () => {
        return (
            <>
                <button onClick={() => {resetForm(); setCitasFiltradas(citas)}}>Borrar filtro</button>
                <button onClick={() => setFiltrando(false)}>Cancelar</button>
                <div>
                    <p>Filtrar por estado</p>
                    <select value={valores.estadoFiltro} name="estadoFiltro" onChange={handleOnChange}>
                        <option value="">Todos los estados</option>
                        {ESTADOS.map(e => {
                            return (
                                <option key={e} value={EstadosCita[e]} >{e}</option>
                            )
                        })}
                    </select>
                </div>
                <div>
                    <p>Filtrar por fecha</p>
                    <input type="date" name="fechaFiltro" value={valores.fechaFiltro} onChange={handleOnChange} />
                </div>
                <button onClick={() => filtrar()}>Filtrar</button>
            </>
        )
    }

    if(mensaje) return <h1>{mensaje}</h1>

    return (
        <div>
            {filtrando
                ? renderFiltro()
                : <button onClick={() => setFiltrando(true)}>Filtrar</button>
            }
            {renderCitas()}
        </div>
    );
};

export default RecBuscarCitas;