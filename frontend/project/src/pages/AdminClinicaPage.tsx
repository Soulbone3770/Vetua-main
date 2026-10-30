import useGetUser from "../hooks/useGetUser.ts";
import RegisterUserByAdminClinica from "../components/RegisterUserByAdminClinica.tsx";
import useForm from "../hooks/useForm.ts";
import type {RolesType} from "../types/Roles.ts";
import React, {useState} from "react";
import type {DataType} from "../types/DataType.ts";
import Logout from "../hooks/Logout.ts";
import useAuth from "../hooks/useAuth.ts";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/FormUI.tsx";

const API_URL = import.meta.env.VITE_API_URL;

interface TarjetaAdminProps {
    titulo: string;
    texto: string;
    boton: string;
    color: string; // color de la barra superior y del botón
    onClick: () => void;
    disabled?: boolean;
}

const TarjetaAdmin = ({ titulo, texto, boton, color, onClick, disabled = false }: TarjetaAdminProps) => (
    <div className="mx-auto w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-md">
        <div className="h-5" style={{ backgroundColor: color }} />
        <div className="px-6 pb-6 pt-4">
            <h3 className="border-b border-gray-700 pb-2 text-center text-xl font-bold !text-black">{titulo}</h3>
            <div className="mt-4 flex items-center justify-between gap-4">
                <p className="max-w-xs text-xs leading-relaxed text-gray-800">{texto}</p>
                <button
                    type="button"
                    onClick={onClick}
                    disabled={disabled}
                    title={disabled ? "Próximamente" : undefined}
                    className="shrink-0 rounded-lg border-2 bg-white px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
                    style={{ borderColor: color, color }}
                    onMouseEnter={(e) => { if (disabled) return; e.currentTarget.style.backgroundColor = color; e.currentTarget.style.color = "white"; }}
                    onMouseLeave={(e) => { if (disabled) return; e.currentTarget.style.backgroundColor = "white"; e.currentTarget.style.color = color; }}
                >
                    {boton}
                </button>
            </div>
        </div>
    </div>
);

const AdminClinicaPage = () => {

    const navigate = useNavigate();

    //El valor usuario simplemente son los datos del usuario guardados en el contexto de la sesión, diferente a user
    const { usuario } = useAuth();
    const { user, loading } = useGetUser();

    const { logoutProcess } = Logout();

    const clId = usuario?.clinicaId;

    const { valores: valoresUsuario, handleOnChange: handleOnChangeUsuario, resetForm: resetFormUsuario } = useForm({"username": "", "password": "", "rol": "" as RolesType, "clinicaId": clId ?? 0});

    const[mensaje, setMensaje] = useState("");
    const[mostrarRegistro, setMostrarRegistro] = useState(false);

    const cerrarRegistro = () => {
        setMostrarRegistro(false);
        setMensaje("");
    };

    const registerUserProcess = async(e: React.SubmitEvent<HTMLFormElement>) => {

        e.preventDefault();
        setMensaje("");

        const res: Response = await fetch(`${API_URL}/users/api/register`, {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({...valoresUsuario, clinicaId: clId})
        });

        const data: DataType = await res.json();

        if(data.mensaje){
            setMensaje(data.mensaje);
            return
        }

        if(!data.ok){
            alert(data.error);
            return
        } else if(data.exito){
            alert(data.exito);
            resetFormUsuario();
            cerrarRegistro();
        }

    }

    if(loading) return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <h1 className="animate-pulse text-xl font-semibold !text-purple-700">CARGANDO...</h1>
        </div>
    );

    if(!user) return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <h1 className="text-xl font-semibold !text-red-600">Hubo un problema al obtener el usuario</h1>
        </div>
    );

    return (
        <div className="min-h-screen w-full bg-[#EEF1FA]">
            <PageHeader
                titulo="Bienvenido/a"
                rolLabel="Admin clínica"
                onExit={() => logoutProcess()}
                subtitulo={`${user.username} - ${user.nombreClinica}`}
            />

            {/* Banda blanca con título */}
            <section className="bg-white shadow-md">
                <div className="mx-auto max-w-5xl px-6 py-8 text-left md:px-10">
                    <h2 className="text-xl font-bold !text-black">Panel de administración de la clínica</h2>
                    <p className="mt-1 max-w-xl text-sm text-gray-800">
                        Aquí podrás realizar acciones administrativas en tu clínica, específicamente la gestión de usuarios de la misma.
                    </p>
                </div>
            </section>

            {/* Tarjetas */}
            <main className="mx-auto flex max-w-5xl flex-col gap-14 px-6 py-14 md:px-10">
                <TarjetaAdmin
                    titulo="Registrar usuario en tu clínica"
                    texto="Haz click en el botón para ingresar al menú de registro de un nuevo usuario. En el que podrás ingresar las credenciales necesarias para el registro del mismo, así como su rol en la institución."
                    boton="Registra usuario"
                    color="#4C00C8"
                    onClick={() => setMostrarRegistro(true)}
                />
                <TarjetaAdmin
                    titulo="Ver lista de usuarios"
                    texto="Haz click en el botón para acceder a la lista de usuarios, en esta podrás buscar un usuario mediante su nombre de usuario, además, podrás acceder a la página del usuario, esto te permitirá gestionar su información."
                    boton="Ver lista"
                    color="#8B3A3A"
                    onClick={() => navigate("/adminClinicaPage/usuarios")}
                />
                <TarjetaAdmin
                    titulo="Estadísticas de la clínica"
                    texto="Haz click en el botón para ver las estadísticas de tu clínica, como el total de mascotas registradas y el total de citas."
                    boton="Ver estadísticas"
                    color="#3B5BB5"
                    onClick={() => navigate("/adminClinicaPage/estadisticas")}
                />
            </main>

            {/* Ventana de registro de usuario */}
            {mostrarRegistro && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onClick={cerrarRegistro}
                >
                    <div
                        className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="h-5 bg-[#4C00C8]" />
                        <div className="p-6">
                            <div className="mb-5 flex items-end justify-between border-b border-gray-700 pb-2">
                                <h2 className="text-xl font-bold !text-black">Registrar usuario</h2>
                                <button
                                    type="button"
                                    onClick={cerrarRegistro}
                                    className="text-2xl leading-none text-gray-500 hover:text-gray-800"
                                    aria-label="Cerrar"
                                >
                                    ×
                                </button>
                            </div>
                            <RegisterUserByAdminClinica
                                onSubmit={registerUserProcess}
                                valores={valoresUsuario}
                                handleOnChange={handleOnChangeUsuario}
                                mensaje={mensaje}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
};

export default AdminClinicaPage;