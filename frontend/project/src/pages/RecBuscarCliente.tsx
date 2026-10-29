import useGetClientes from "../hooks/useGetClientes.ts";
import useBarraBusqueda from "../hooks/useBarraBusqueda.tsx";
import {useNavigate} from "react-router-dom";
import type {ClienteType} from "../types/ClienteType.ts";
import { Pagina, FormCard } from "../components/FormUI.tsx";
import useAuth from "../hooks/useAuth.ts";

export const RecBuscarCliente = () => {

    //TOCA HACER UNA PAGINA DE CLIENTE AL HACER CLICK, ESTA PAGINA DEBE PERMITIRLE AL RECEPCIONISTA EDITAR LOS DATOS
    const navigate = useNavigate();
    const { rol } = useAuth();

    const { clientes, mensaje, loading } = useGetClientes();

    const { array, renderBarra } = useBarraBusqueda<ClienteType>({criterioBusqueda: "num_documento", arrayBusqueda: clientes});

    const renderClientes = () => {
        if(array.length === 0){
            return <p className="py-4 text-sm text-gray-500">No hay clientes</p>
        }

        return array.map(cliente => {
            return (
                <div
                    key={cliente.id}
                    onClick={() => navigate(`/recPaginaCliente/${cliente.id}`)}
                    className="flex cursor-pointer items-center justify-between border-b border-gray-300 px-1 py-3 transition last:border-b-0 hover:bg-purple-50"
                >
                    <div className="text-left">
                        <p className="text-lg font-semibold text-gray-600">{cliente.nombres}</p>
                        <p className="text-sm text-gray-900">
                            <span className="font-bold">Número de documento:</span> {cliente.num_documento}
                        </p>
                    </div>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 12h16" />
                        <path d="M14 6l6 6-6 6" />
                    </svg>
                </div>
            )
        })
    };

    if(loading) return (
        <div className="flex min-h-screen items-center justify-center bg-[#EEF1FA]">
            <h1 className="animate-pulse text-xl font-semibold text-purple-700">CARGANDO...</h1>
        </div>
    );

    return (
        <Pagina titulo="Buscar cliente" ancho="max-w-3xl" volverA={-1} rolLabel={rol}>
            <div className="text-left text-sm font-bold text-black">
                {renderBarra()}
            </div>

            <FormCard titulo="Usuarios">
                <div id="usuarios" className="min-h-64">
                    {mensaje !== ""
                        ? <p className="text-sm text-red-500">{mensaje}</p>
                        : renderClientes()
                    }
                </div>
            </FormCard>
        </Pagina>
    );
};

export default RecBuscarCliente;