import {useParams} from "react-router-dom";
import useGetMascotaByParams from "../hooks/useGetMascotaByParams.ts";
import useUpdateMascotaForm from "../hooks/useUpdateMascotaForm.tsx";
import { Pagina, Cargando, MensajeError } from "../components/FormUI.tsx";
import useAuth from "../hooks/useAuth.ts";
import { etiquetaRol } from "../utils/rolInfo.ts";

const MascotaPage = () => {

    const { id } = useParams();
    const mascotaId = Number(id);
    const { rol } = useAuth();

    const { mascota, mensaje, getMascota } = useGetMascotaByParams(mascotaId);
    const { renderFinal } = useUpdateMascotaForm(mascota, getMascota);

    return (
        <Pagina titulo="Mascota" rolLabel={etiquetaRol(rol)} volverA={-1}>
            {mensaje
                ? <MensajeError texto={mensaje} />
                : !mascota
                    ? <Cargando />
                    : renderFinal()
            }
        </Pagina>
    )
};

export default MascotaPage;