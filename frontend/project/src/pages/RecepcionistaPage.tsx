import useGetUser from "../hooks/useGetUser.ts";
import Logout from "../hooks/Logout.ts";
import { Panel, TarjetaAccion, Cargando } from "../components/FormUI.tsx";

const RecepcionistaPage = () => {
    const { user, loading } = useGetUser();
    const { logoutProcess } = Logout();

    if (loading) return <div className="min-h-screen bg-[#EEF1FA]"><Cargando /></div>;

    if (!user) return (
        <div className="flex min-h-screen items-center justify-center bg-[#EEF1FA]">
            <h1 className="text-xl font-semibold !text-red-600">ERROR AL OBTENER LOS DATOS DEL USUARIO</h1>
        </div>
    );

    return (
        <Panel rolLabel="Recepcionista" subtitulo={`${user.username} - ${user.nombreClinica}`} onExit={() => logoutProcess()}>
            <TarjetaAccion
                titulo="Registrar paciente"
                texto="Haz click en el botón para ingresar al menú de registro de un nuevo cliente. En el que podrás ingresar la información personal de este. Una vez ingresada podrás buscarlo en el apartado de búsqueda de clientes."
                boton="Registrar cliente" ruta="/recRegistrarCliente" color="#4C00C8"
            />
            <TarjetaAccion
                titulo="Registrar mascota"
                texto="Haz click en el botón para ingresar al menú de registro de una nueva mascota, en el que podrás ingresar la información correspondiente de esta. Una vez ingresada, podrás buscarla en el apartado de búsqueda de mascota."
                boton="Registra mascota" ruta="/recRegistrarMascota" color="#8B3A3A"
            />
            <TarjetaAccion
                titulo="Buscar cliente"
                texto="Haz click en el botón para buscar a un cliente por su nombre o número de identificación, además podrás realizar cambios en la información del cliente a petición de este."
                boton="Buscar cliente" ruta="/recBuscarCliente" color="#3B5BB5"
            />
            <TarjetaAccion
                titulo="Agendar cita"
                texto="Haz click en el botón para agendar una nueva cita, esta aparecerá en el calendario y la podrás modificar o cancelar accediendo al apartado a la página de la cita desde el calendario."
                boton="Agendar cita" ruta="/recAgendarCita" color="#7B4FC9"
            />
            <TarjetaAccion
                titulo="Buscar mascota"
                texto="Haz click en el botón para buscar las mascotas de un cliente mediante su número de documento. Podrás entrar a la página de la mascota para ver y editar su información."
                boton="Buscar mascota" ruta="/buscarMascota" color="#2F7D6B"
            />
            <TarjetaAccion
                titulo="Consultar citas"
                texto="Haz click en el botón para ver las citas de la clínica, filtrarlas por estado o fecha y entrar a cada una para cambiar su estado o reprogramarla."
                boton="Consultar citas" ruta="/recBuscarCitas" color="#B8742A"
            />
        </Panel>
    );
};

export default RecepcionistaPage;