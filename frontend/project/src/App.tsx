import './App.css';
import type { ComponentProps, ReactNode } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthProvider from "./components/AuthProvider.tsx";
import ProtectedRoute from './components/ProtectedRoute.tsx';

import Index from './pages/Index.tsx';
import Login from './pages/Login.tsx';
import NoAutorizado from "./pages/NoAutorizado.tsx";
import CalendarioPage from "./pages/CalendarioPage.tsx";

import AdminPage from "./pages/AdminPage.tsx";
import AdminClinicaPage from "./pages/AdminClinicaPage.tsx";
import AdminClinicaEstadisticasPage from "./pages/AdminClinicaEstadisticasPage.tsx";
import AdminClinicaUsuariosPage from "./pages/AdminClinicaUsuariosPage.tsx";

import RecepcionistaPage from "./pages/RecepcionistaPage.tsx";
import RecRegistrarCliente from "./pages/RecRegistrarCliente.tsx";
import RecRegistrarMascota from "./pages/RecRegistrarMascota.tsx";
import RecBuscarCliente from "./pages/RecBuscarCliente.tsx";
import RecPaginaCliente from "./pages/RecPaginaCliente.tsx";
import RecAgendarCita from "./pages/RecAgendarCita.tsx";
import RecBuscarCitas from "./pages/RecBuscarCitas.tsx";
import RecCitaPage from "./pages/RecCitaPage.tsx";
import BuscarMascota from "./pages/BuscarMascota.tsx";
import MascotaPage from "./pages/MascotaPage.tsx";

import VeterinarioPage from './pages/VeterinarioPage.tsx';
import VeterinarioRegistrarConsulta from './pages/VeterinarioRegistrarConsulta.tsx';
import VeterinarioBuscarConsultas from "./pages/VeterinarioBuscarConsultas.tsx";
import VeterinarioConsultaPage from "./pages/VeterinarioConsultaPage.tsx";
import VeterinarioVacunacionesPage from "./pages/VeterinarioVacunacionesPage.tsx";
import VeterinarioCrearReceta from "./pages/VeterinarioCrearReceta.tsx";

type Roles = ComponentProps<typeof ProtectedRoute>["rolesPermitidos"];

const REC: Roles = ["recepcionista", "adminClinica"];
const VET: Roles = ["veterinario"];
const TODOS: Roles = ["recepcionista", "adminClinica", "veterinario"];

// Atajo: ruta protegida por rol
const P = ({ roles, children }: { roles?: Roles; children: ReactNode }) => (
    <ProtectedRoute rolesPermitidos={roles}>{children}</ProtectedRoute>
);

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/noAutorizado" element={<NoAutorizado />} />

                    {/* Admin del sistema */}
                    <Route path="/adminPage" element={<P roles={["adminSistema"]}><AdminPage /></P>} />

                    {/* Admin de la clínica */}
                    <Route path="/adminClinicaPage" element={<P roles={["adminClinica"]}><AdminClinicaPage /></P>} />
                    <Route path="/adminClinicaPage/estadisticas" element={<P roles={["adminClinica"]}><AdminClinicaEstadisticasPage /></P>} />
                    <Route path="/adminClinicaPage/usuarios" element={<P roles={["adminClinica"]}><AdminClinicaUsuariosPage /></P>} />

                    {/* Recepcionista y admin de la clínica */}
                    <Route path="/recepcionistaPage" element={<P roles={REC}><RecepcionistaPage /></P>} />
                    <Route path="/recRegistrarCliente" element={<P roles={REC}><RecRegistrarCliente /></P>} />
                    <Route path="/recepcionistaPage/recRegistrarCliente" element={<P roles={REC}><RecRegistrarCliente /></P>} />
                    <Route path="/recRegistrarMascota" element={<P roles={REC}><RecRegistrarMascota /></P>} />
                    <Route path="/recepcionistaPage/recRegistrarMascota" element={<P roles={REC}><RecRegistrarMascota /></P>} />
                    <Route path="/recBuscarCliente" element={<P roles={REC}><RecBuscarCliente /></P>} />
                    <Route path="/recepcionistaPage/recBuscarCliente" element={<P roles={REC}><RecBuscarCliente /></P>} />
                    <Route path="/recAgendarCita" element={<P roles={REC}><RecAgendarCita /></P>} />
                    <Route path="/recepcionistaPage/recAgendarCita" element={<P roles={REC}><RecAgendarCita /></P>} />
                    <Route path="/recBuscarCitas" element={<P roles={REC}><RecBuscarCitas /></P>} />
                    <Route path="/recCitaPage/:id" element={<P roles={REC}><RecCitaPage /></P>} />

                    {/* Compartidas entre recepción y veterinario */}
                    <Route path="/recPaginaCliente/:clienteId" element={<P roles={TODOS}><RecPaginaCliente /></P>} />
                    <Route path="/buscarMascota" element={<P roles={TODOS}><BuscarMascota /></P>} />
                    <Route path="/mascotaPage/:id" element={<P roles={TODOS}><MascotaPage /></P>} />
                    <Route path="/calendarioPage" element={<P roles={TODOS}><CalendarioPage /></P>} />

                    {/* Veterinario */}
                    <Route path="/veterinarioPage" element={<P roles={VET}><VeterinarioPage /></P>} />
                    <Route path="/veterinarioPage/veterinarioRegistrarConsulta" element={<P roles={VET}><VeterinarioRegistrarConsulta /></P>} />
                    <Route path="/veterinarioPage/veterinarioBuscarCliente" element={<P roles={VET}><RecBuscarCliente /></P>} />
                    <Route path="/veterinarioPage/veterinarioBuscarConsulta" element={<P roles={VET}><VeterinarioBuscarConsultas /></P>} />
                    <Route path="/veterinarioPage/veterinarioConsultaPage/:consultaId/:veterinarioId" element={<P roles={VET}><VeterinarioConsultaPage /></P>} />
                    <Route path="/veterinarioPage/veterinarioVacunaciones" element={<P roles={VET}><VeterinarioVacunacionesPage /></P>} />
                    <Route path="/veterinarioPage/veterinarioCrearReceta" element={<P roles={VET}><VeterinarioCrearReceta /></P>} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;