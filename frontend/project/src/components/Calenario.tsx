import {useNavigate} from "react-router-dom";

const Calenario = () => {

    const navigate = useNavigate();

    const fecha = new Date();
    const mes = new Intl.DateTimeFormat("es-CO", {month: "long"});
    const dia = new Intl.DateTimeFormat("es-CO", {day: "numeric"});

    return (
        <div onClick={() => navigate("../calendaioPage")}>
            <h2>{mes.format(fecha)}</h2>
            <h2>{dia.format(fecha)}</h2>
        </div>
    )

}

export default Calenario;