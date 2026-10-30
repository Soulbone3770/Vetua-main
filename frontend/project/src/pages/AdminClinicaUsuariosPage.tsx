import {useEffect, useMemo, useState} from "react";
import { Pagina, FormCard, Cargando, MensajeError, CAMPO } from "../components/FormUI.tsx";
import { etiquetaRol } from "../utils/rolInfo.ts";

const API_URL = import.meta.env.VITE_API_URL;

interface UsuarioListaType {
    id: number;
    username: string;
    rol: string;
}

interface UsuariosDataType {
    ok?: boolean;
    error?: string;
    mensaje?: string;
    usuarios?: UsuarioListaType[];
}

const AdminClinicaUsuariosPage = () => {

    const[usuarios, setUsuarios] = useState<UsuarioListaType[]>();
    const[mensaje, setMensaje] = useState("");
    const[busqueda, setBusqueda] = useState("");

    useEffect(() => {
        const getUsuarios = async() => {
            try {
                const res: Response = await fetch(`${API_URL}/users/api/getUsuariosClinica`, {
                    credentials: "include"
                });

                const data: UsuariosDataType = await res.json();

                if(data.mensaje){
                    setMensaje(data.mensaje);
                    return
                }

                if(data.error){
                    setMensaje(data.error);
                    return
                }

                setUsuarios(data.usuarios ?? []);
            } catch {
                setMensaje("No se pudo obtener la lista de usuarios.");
            }
        };

        getUsuarios();
    },[]);

    const usuariosFiltrados = useMemo(() => {
        const texto = busqueda.trim().toLowerCase();
        return (usuarios ?? []).filter(u => u.username.toLowerCase().includes(texto));
    }, [usuarios, busqueda]);

    const renderLista = () => {
        if(mensaje !== "") return <MensajeError texto={mensaje} />
        if(!usuarios) return <Cargando />
        if(usuariosFiltrados.length === 0) return <p className="py-4 text-sm text-gray-500">No se encontraron usuarios</p>

        return usuariosFiltrados.map(u => (
            <div key={u.id} className="border-b border-gray-300 px-1 py-3 text-left last:border-b-0">
                <p className="text-lg font-semibold text-gray-600">{u.username}</p>
                <p className="text-sm text-gray-900"><span className="font-bold">Rol:</span> {etiquetaRol(u.rol)}</p>
            </div>
        ));
    };

    return (
        <Pagina titulo="Usuarios" ancho="max-w-3xl" rolLabel="Admin clínica" volverA="/adminClinicaPage">
            <div className="text-left">
                <label htmlFor="busqueda" className="mb-1 block text-sm font-bold text-black">
                    Introduzca el nombre de usuario
                </label>
                <input
                    id="busqueda"
                    type="text"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className={CAMPO}
                />
            </div>

            <FormCard titulo="Usuarios">
                <div className="min-h-64">
                    {renderLista()}
                </div>
            </FormCard>
        </Pagina>
    );
};

export default AdminClinicaUsuariosPage;