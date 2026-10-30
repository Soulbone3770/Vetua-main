import useForm from "../hooks/useForm.ts";
import {TIPO_DOCUMENTOS, type TipoDocumentoType} from "../types/TipoDocumentoType.ts";
import useGetCliente from "../hooks/useGetCliente.ts";
import useGetMascotas from "../hooks/useGetMascotas.ts";
import { Pagina, FormCard, FilaLista, BuscadorDocumento, MensajeError } from "../components/FormUI.tsx";
import useAuth from "../hooks/useAuth.ts";
import {useNavigate} from "react-router-dom";
import { etiquetaRol } from "../utils/rolInfo.ts";
import { formatFecha } from "../utils/formatFecha.ts";

const BuscarMascota = () => {

    const { rol } = useAuth();
    const navigate = useNavigate();

    const { valores: valoresDocumento, handleOnChange: handleDocumentos } = useForm({"clienteNumDocumento": "", "clienteTipoDocumento": "" as TipoDocumentoType});
    const { cliente, noCliente, getCliente } = useGetCliente(valoresDocumento.clienteNumDocumento, valoresDocumento.clienteTipoDocumento);
    const { mascotas, noMascotas, getMascotas } = useGetMascotas(valoresDocumento.clienteNumDocumento, valoresDocumento.clienteTipoDocumento);

    const renderListaMascotas = () => {
        return (
            <FormCard titulo="Mascotas">
                <div className="min-h-48">
                    {noMascotas !== ""
                        ? <MensajeError texto={noMascotas} />
                        : mascotas.map(mascota => (
                            <FilaLista
                                key={mascota.id}
                                titulo={mascota.nombre}
                                lineas={[["Especie", mascota.especie], ["Nacimiento", formatFecha(mascota.fecha_nacimiento)]]}
                                onClick={() => navigate(`/mascotaPage/${mascota.id}`)}
                            />
                        ))
                    }
                </div>
            </FormCard>
        )
    }

    return (
        <Pagina titulo="Buscar mascota" ancho="max-w-3xl" rolLabel={etiquetaRol(rol)} volverA={-1}>
            <BuscadorDocumento
                tipo={valoresDocumento.clienteTipoDocumento}
                numero={valoresDocumento.clienteNumDocumento}
                onChange={handleDocumentos}
                onSubmit={() => { getCliente(); getMascotas(); }}
                opciones={TIPO_DOCUMENTOS}
            />
            {noCliente !== ""
                ? <MensajeError texto={noCliente} />
                : cliente !== undefined && renderListaMascotas()
            }
        </Pagina>
    )
};

export default BuscarMascota;