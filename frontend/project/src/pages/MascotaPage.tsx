import {useParams} from "react-router-dom";
import useGetMascotaByParams from "../hooks/useGetMascotaByParams.ts";
import useUpdateMascotaForm from "../hooks/useUpdateMascotaForm.tsx";
import {Pagina} from "../components/FormUI.tsx";
import useAuth from "../hooks/useAuth.ts";

const MascotaPage = () => {

    const { id } = useParams();
    const mascotaId = Number(id);
    const { rol } = useAuth();

    const { mascota, mensaje, getMascota } = useGetMascotaByParams(mascotaId);
    const { renderFinal } = useUpdateMascotaForm(mascota, getMascota);

    if(mensaje) return <p>{mensaje}</p>

    return (
        <Pagina titulo="Mascota" rolLabel={rol ?? "Usuario"} volverA={-1}>
            {mensaje !== ""
                ? <p className="text-sm font-medium text-red-500">{mensaje}</p>
                : !mascota
                    ? <h1 className="animate-pulse text-center text-xl font-semibold !text-purple-700">CARGANDO...</h1>
                    : renderFinal()
            }
        </Pagina>
    )
};

export default MascotaPage;