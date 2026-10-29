import {useEffect, useState} from "react";
import type {CitasDataType} from "../types/DataType.ts";
import type {CitasType} from "../types/CitasType.ts";

const API_URL = import.meta.env.VITE_API_URL;

const CalendarioPage = () => {

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


    const renderCitas = () => {
      return citas.map(c => {
          return (
              <div key={c.id}>
                  <h2>{c.motivo}</h2>
                  <p>{c.estado}</p>
              </div>
          )
      })
    };

    return (
        <div>
            {mensaje !== ""
                ? <p>{mensaje}</p>
                : renderCitas()
            }
        </div>
    )

};

export default CalendarioPage;