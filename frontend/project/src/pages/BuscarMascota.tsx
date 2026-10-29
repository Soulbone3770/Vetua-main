import useForm from "../hooks/useForm.ts";
import {TIPO_DOCUMENTOS, type TipoDocumentoType} from "../types/TipoDocumentoType.ts";
import useGetCliente from "../hooks/useGetCliente.ts";
import useGetMascotas from "../hooks/useGetMascotas.ts";
import React from "react";
import {CAMPO, Pagina} from "../components/FormUI.tsx";
import useAuth from "../hooks/useAuth.ts";
import {useNavigate} from "react-router-dom";

const BuscarMascota = () => {

    const { rol } = useAuth();
    const navigate = useNavigate();

    const { valores: valoresDocumento, handleOnChange: handleDocumentos } = useForm({"clienteNumDocumento": "", "clienteTipoDocumento": "" as TipoDocumentoType});
    const { cliente, noCliente, getCliente } = useGetCliente(valoresDocumento.clienteNumDocumento, valoresDocumento.clienteTipoDocumento);
    const { mascotas, noMascotas, getMascotas } = useGetMascotas(valoresDocumento.clienteNumDocumento, valoresDocumento.clienteTipoDocumento);

    const renderListaMascotas = () => {
        if(noMascotas !== ""){
            return <p>{noMascotas}</p>
        }

        return mascotas.map(mascota => (
            <div key={mascota.id} onClick={() => navigate(`/mascotaPage/${mascota.id}`)}>
                <h2>{mascota.nombre}</h2>
                <p>{mascota.especie}</p>
                <p>{mascota.fecha_nacimiento.slice(0,10)}</p>
            </div>
        ))
    }

    return (
        <div>
            <Pagina titulo="Buscar Mascota" ancho="max-w-3xl" rolLabel={rol} volverA={-1}>
                <form
                    onSubmit={(e: React.SubmitEvent<HTMLFormElement>) => {
                        e.preventDefault();
                        getCliente(); getMascotas()
                    }}
                >
                    <p className="mb-1 text-sm font-bold text-black">Introduzca el número y tipo de documento del cliente</p>
                    <div className="flex flex-col gap-3 md:flex-row">
                        <select
                            name="clienteTipoDocumento"
                            aria-label="Tipo de documento"
                            value={valoresDocumento.clienteTipoDocumento}
                            onChange={handleDocumentos}
                            className={`${CAMPO} md:w-40`}
                        >
                            <option value="">Tipo</option>
                            {TIPO_DOCUMENTOS.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                        <input
                            name="clienteNumDocumento"
                            type="text"
                            aria-label="Número de documento"
                            placeholder="Número de documento"
                            value={valoresDocumento.clienteNumDocumento}
                            onChange={handleDocumentos}
                            className={`${CAMPO} flex-1`}
                        />
                        <button type="submit" className="rounded-2xl bg-[#4C00C8] px-6 py-2.5 text-sm font-medium text-white shadow-md transition hover:bg-[#3b009c]">
                            Buscar cliente
                        </button>
                    </div>
                </form>

                {noCliente !== ""
                    ? <p className="text-sm font-medium text-red-500">{noCliente}</p>
                    : cliente !== undefined && renderListaMascotas()
                }
            </Pagina>
        </div>
    )
};

export default BuscarMascota;