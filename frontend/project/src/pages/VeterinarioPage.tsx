import Logout from "../hooks/Logout.ts";
import useAuth from "../hooks/useAuth.ts";
import { Panel, TarjetaAccion } from "../components/FormUI.tsx";

const VeterinarioPage = () => {
    const { logoutProcess } = Logout();
    const { usuario } = useAuth();

    return (
        <Panel rolLabel="Veterinario" subtitulo={usuario?.username} onExit={() => logoutProcess()}>
            <TarjetaAccion
                titulo="Registrar consultas médicas"
                texto="Haz click en el botón para ingresar al menú de registro de una consulta médica. En el que podrás ingresar la información pertinente sobre esta. Una vez ingresada, la podrás ver en el apartado de consultar tus registros de consultas médicas."
                boton="Registrar consulta" ruta="/veterinarioPage/veterinarioRegistrarConsulta" color="#4C00C8"
            />
            <TarjetaAccion
                titulo="Consultar registros médicos"
                texto="Haz click en el botón para consultar los registros médicos realizados anteriormente, en este apartado podrás buscar los registros médicos que has realizado y ver el detalle de cada uno."
                boton="Consultar registros" ruta="/veterinarioPage/veterinarioBuscarConsulta" color="#8B3A3A"
            />
            <TarjetaAccion
                titulo="Buscar cliente"
                texto="Haz click en el botón para buscar a un cliente por su nombre o número de identificación, además podrás realizar cambios en la información del cliente a petición de este."
                boton="Buscar cliente" ruta="/veterinarioPage/veterinarioBuscarCliente" color="#3B5BB5"
            />
            <TarjetaAccion
                titulo="Registrar vacuna"
                texto="Haz click en el botón para registrar la aplicación de una vacuna a la mascota de un cliente, con la fecha de aplicación y la fecha de la próxima dosis."
                boton="Registrar vacuna" ruta="/veterinarioPage/veterinarioVacunaciones" color="#2F7D6B"
            />
            <TarjetaAccion
                titulo="Buscar mascota"
                texto="Haz click en el botón para buscar las mascotas de un cliente mediante su número de documento. Podrás entrar a la página de la mascota para ver y editar su información."
                boton="Buscar mascota" ruta="/buscarMascota" color="#B8742A"
            />
        </Panel>
    );
};

export default VeterinarioPage;