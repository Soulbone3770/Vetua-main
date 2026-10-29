import useGetUser from "../hooks/useGetUser.ts";
import Logout from "../hooks/Logout.ts";
import Calenario from "../components/Calenario.tsx";
import { Link } from "react-router-dom";

interface TarjetaProps {
    titulo: string;
    texto: string;
    boton: string;
    ruta: string;
    color: string; // color de la barra lateral y del botón
}

const Tarjeta = ({ titulo, texto, boton, ruta, color }: TarjetaProps) => (
    <div className="flex overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-lg">
        <div className="w-3 shrink-0" style={{ backgroundColor: color }} />
        <div className="flex-1 p-5">
            <h3 className="border-b border-gray-400 pb-2 text-xl font-bold text-black">
                {titulo}
            </h3>
            <div className="mt-3 flex items-end justify-between gap-4">
                <p className="max-w-xs text-xs leading-relaxed text-gray-800">{texto}</p>
                <Link
                    to={ruta}
                    className="shrink-0 rounded-lg border-2 bg-white px-4 py-2 text-sm font-medium transition"
                    style={{ borderColor: color, color }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = color;
                        e.currentTarget.style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "white";
                        e.currentTarget.style.color = color;
                    }}
                >
                    {boton}
                </Link>
            </div>
        </div>
    </div>
);

const RecepcionistaPage = () => {
    const { user, loading } = useGetUser();
    const { logoutProcess } = Logout();

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <h1 className="text-xl font-semibold text-purple-700 animate-pulse">CARGANDO...</h1>
        </div>
    );

    if (!user) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <h1 className="text-xl font-semibold text-red-600">ERROR AL OBTENER LOS DATOS DEL USUARIO</h1>
        </div>
    );

    return (
        <div className="min-h-screen w-full bg-[#EEF1FA]">
            {/* Encabezado morado */}
            <header className="relative w-full overflow-hidden bg-gradient-to-r from-[#3B0A9E] via-[#4C14B8] to-[#3B0A9E] text-white">
                <div className="pointer-events-none absolute -right-10 top-0 h-full w-1/3 skew-x-[-30deg] bg-white/5" />
                <div className="relative mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-8 md:px-10">
                    <button
                        type="button"
                        onClick={() => logoutProcess()}
                        className="flex items-center gap-4 text-white"
                        aria-label="Cerrar sesión"
                        title="Cerrar sesión"
                    >
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 4v16" />
                            <path d="M19 5l-9 7 9 7V5z" />
                        </svg>
                        <span className="text-3xl font-bold tracking-wide md:text-4xl">BIENVENIDO/A</span>
                    </button>

                    <div className="text-right">
                        <span className="block text-lg font-medium capitalize md:text-xl">{user.rol}</span>
                        <span className="mt-1 block h-1.5 w-full rounded bg-white/30" />
                        <span className="mt-1 block text-xs text-purple-200">
                            {user.username} - {user.nombreClinica}
                        </span>
                    </div>
                </div>
            </header>

            {/* Sección calendario */}
            <section className="bg-white shadow-md">
                <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-8 md:flex-row md:px-10">
                    <div className="flex w-full justify-center md:w-auto">
                        <Calenario />
                    </div>

                    <div className="hidden h-28 w-px bg-gray-400 md:block" />

                    <div className="text-left">
                        <h2 className="text-xl font-bold text-black">Calendario</h2>
                        <h3 className="mt-1 max-w-sm text-2xl font-bold leading-tight text-gray-500">
                            Accede al calendario para ver las próximas citas
                        </h3>
                        <p className="mt-2 max-w-2xl text-sm text-gray-800">
                            Haz click en el ícono para acceder al calendario, donde podrás ver las próximas
                            citas programadas, así como acceder a su menú, donde podrás editarlas o cancelarlas.
                        </p>
                    </div>
                </div>
            </section>

            {/* Tarjetas de acciones */}
            <main className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-6 py-14 md:grid-cols-2 md:px-10">
                <Tarjeta
                    titulo="Registrar paciente"
                    texto="Haz click en el botón para ingresar al menú de registro de un nuevo cliente. En el que podrás ingresar la información personal de este. Una vez ingresada podrás buscarlo en el apartado de búsqueda de clientes."
                    boton="Registrar cliente"
                    ruta="/recRegistrarCliente"
                    color="#4C00C8"
                />
                <Tarjeta
                    titulo="Registrar mascota"
                    texto="Haz click en el botón para ingresar al menú de registro de una nueva mascota, en el que podrás ingresar la información correspondiente de esta. Una vez ingresada, podrás buscarla en el apartado de búsqueda de mascota."
                    boton="Registra mascota"
                    ruta="/recRegistrarMascota"
                    color="#8B3A3A"
                />
                <Tarjeta
                    titulo="Buscar cliente"
                    texto="Haz click en el botón para buscar a un cliente por su nombre o número de identificación, además podrás realizar cambios en la información del cliente a petición de este."
                    boton="Buscar cliente"
                    ruta="/recBuscarCliente"
                    color="#3B5BB5"
                />
                <Tarjeta
                    titulo="Agendar cita"
                    texto="Haz click en el botón para agendar una nueva cita, esta aparecerá en el calendario y la podrás modificar o cancelar accediendo al apartado a la página de la cita desde el calendario."
                    boton="Agendar cita"
                    ruta="/recAgendarCita"
                    color="#7B4FC9"
                />
                <Tarjeta
                    titulo="Buscar citas"
                    texto="uuwu"
                    boton="Buscar citas"
                    ruta="/recBuscarCitas"
                    color="#7B4FC9"
                />
                <Tarjeta
                    titulo="Buscar mascotas"
                    texto="uuwu"
                    boton="Buscar mascotas"
                    ruta="/buscarMascota"
                    color="#7B4FC9"
                />
            </main>
        </div>
    );
};

export default RecepcionistaPage;