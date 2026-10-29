import {useParams} from "react-router-dom";
import useGetCitaByParams from "../hooks/useGetCitaByParams.ts";
import {ESTADOS, EstadosCita, type EstadosCitaType} from "../types/CitasType.ts";
import useForm from "../hooks/useForm.ts";
import useChangeEstadoCita from '../hooks/useChangeEstadoCita.ts';
import useReprogramarCita from "../hooks/useReprogramarCita.ts";

const RecCitaPage = () => {

    const { id } = useParams();
    const citaId = Number(id);

    const { cita, mensaje } = useGetCitaByParams(citaId);
    const { valores, handleOnChange } = useForm({"estado": "" as EstadosCitaType, fecha_hora: ""});
    const { changeCita, editandoEstado, setEditandoEstado } = useChangeEstadoCita();
    const { reprogramar, reprogramando, setReprogramando} = useReprogramarCita();

    const today = new Date().toLocaleDateString("es-CO");



    const renderEstadoSelector = () => {
        return (
            <>
                <select value={valores.estado} name="estado" onChange={handleOnChange}>
                    {ESTADOS.map(e => {
                        return (
                            <option key={e} value={EstadosCita[e]} >{e}</option>
                        )
                    })}
                </select>
                <button onClick={() => changeCita(valores.estado, citaId)}>Guardar estado de la cita</button>
            </>
        )
    }

    const renderReprogramarCita = () => {
        return (
            <>
                <input type="date" min={today} name="fecha_hora" value={valores.fecha_hora} onChange={handleOnChange}/>
                <button onClick={() => reprogramar(valores.fecha_hora, citaId)} >Reprogramar</button>
            </>
        )
    }

    if(mensaje) return <h1>{mensaje}</h1>

    if(!cita) return <h1>ERROR NO HAY CITA</h1>

    return (
     <div>
         <h1>{cita.motivo}</h1>
         {editandoEstado
             ? renderEstadoSelector()
             : <>
                 <p>{cita.estado}</p>
                 <button onClick={() => setEditandoEstado(true)}>Editar estado de la cita</button>
             </>

         }
         {reprogramando
             ? renderReprogramarCita()
             : <>
                <p>{cita.fecha_hora}</p>
                 <button onClick={() => setReprogramando(true)}>Reprogramar cita</button>
             </>
         }
     </div>
    )
};

export default RecCitaPage;