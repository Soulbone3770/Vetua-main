import Logout from '../hooks/Logout';
import { useNavigate } from 'react-router-dom';
import PanelLayout from '../components/PanelLayout';

const MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio",
    "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

const VeterinarioPage = () => {

    const { logoutProcess } = Logout();
    const navigate = useNavigate();

    const hoy = new Date();

    return (
        <PanelLayout titulo="BIENVENIDO/A" rol="Veterinario" iconoBack="salir" onBack={() => logoutProcess()}>

            <section className="vet-calendario">
                <button
                    type="button"
                    className="vet-calendario-icono"
                    onClick={() => navigate("/calendarioPage")}
                    aria-label="Abrir calendario de citas"
                >
                    <span className="mes">{MESES[hoy.getMonth()]}</span>
                    <span className="dia">{hoy.getDate()}</span>
                </button>
                <div className="vet-calendario-texto">
                    <h2>Calendario</h2>
                    <h3>Accede al calendario para ver las próximas citas</h3>
                    <p>
                        Haz click en el ícono para acceder al calendario, donde podrás ver las próximas citas
                        programadas, así como acceder a su menú, donde podrás editarlas o cancelarlas.
                    </p>
                </div>
            </section>

            <main className="vet-contenido">
                <div className="vet-grid">

                    <article className="vet-tarjeta registrar">
                        <h2>Registrar consultas médicas</h2>
                        <div className="vet-tarjeta-cuerpo">
                            <p>
                                Haz click en el botón para ingresar al menú de registro de una consulta médica.
                                En el que podrás ingresar la información pertinente sobre esta. Una vez ingresada,
                                la podrás ver en el apartado de consultar tus registros de consultas médicas.
                            </p>
                            <button type="button" className="vet-boton"
                                    onClick={() => navigate("/veterinarioPage/veterinarioRegistrarConsulta")}>
                                Registrar consulta
                            </button>
                        </div>
                    </article>

                    <article className="vet-tarjeta consultar">
                        <h2>Consultar registros médicos</h2>
                        <div className="vet-tarjeta-cuerpo">
                            <p>
                                Haz click en el botón para consultar los registros médicos realizados anteriormente.
                                En este apartado podrás buscar los registros médicos realizados por medio del motivo
                                de la consulta.
                            </p>
                            <button type="button" className="vet-boton"
                                    onClick={() => navigate("/veterinarioPage/veterinarioBuscarConsulta")}>
                                Consultar registros
                            </button>
                        </div>
                    </article>

                    <article className="vet-tarjeta cliente">
                        <h2>Buscar cliente</h2>
                        <div className="vet-tarjeta-cuerpo">
                            <p>
                                Haz click en el botón para buscar a un cliente por su nombre o número de
                                identificación, además podrás realizar cambios en la información del cliente
                                a petición de este.
                            </p>
                            <button type="button" className="vet-boton"
                                    onClick={() => navigate("/veterinarioPage/veterinarioBuscarCliente")}>
                                Buscar cliente
                            </button>
                        </div>
                    </article>

                    <article className="vet-tarjeta receta">
                        <h2>Registrar vacuna a una mascota</h2>
                        <div className="vet-tarjeta-cuerpo">
                            <p>
                                Haz click en el botón para consultar los registros médicos realizados anteriormente.
                                En este apartado podrás buscar los registros médicos realizados por medio del motivo
                                de la consulta.
                            </p>
                            <button type="button" className="vet-boton"
                                    onClick={() => navigate("/veterinaroVacunacionesPage")}>
                                Registrar vacuna
                            </button>
                        </div>
                    </article>

                    <article className="vet-tarjeta receta">
                        <h2>Buscar mascota</h2>
                        <div className="vet-tarjeta-cuerpo">
                            <p>
                                Haz click en el botón para consultar los registros médicos realizados anteriormente.
                                En este apartado podrás buscar los registros médicos realizados por medio del motivo
                                de la consulta.
                            </p>
                            <button type="button" className="vet-boton"
                                    onClick={() => navigate("/buscarMascota")}>
                                Buscar mascotas
                            </button>
                        </div>
                    </article>

                </div>
            </main>
        </PanelLayout>
    );
};

export default VeterinarioPage;