import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthProvider from "./components/AuthProvider.tsx";
import ProtectedRoute from './components/ProtectedRoute.tsx';

import Login from './pages/Login.tsx';
import AdminPage from "./pages/AdminPage.tsx";
import NoAutorizado from "./pages/NoAutorizado.tsx";
import RecepcionistaPage from "./pages/RecepcionistaPage.tsx";
import RecRegistrarCliente from "./pages/RecRegistrarCliente.tsx";
import RecRegistrarMascota from "./pages/RecRegistrarMascota.tsx";
import RecBuscarCliente from "./pages/RecBuscarCliente.tsx";
import RecPaginaCliente from "./pages/RecPaginaCliente.tsx";
import RecAgendarCita from "./pages/RecAgendarCita.tsx";
import AdminClinicaPage from "./pages/AdminClinicaPage.tsx";
import VeterinarioPage from './pages/VeterinarioPage.tsx';
import VeterinarioRegistrarConsulta from './pages/VeterinarioRegistrarConsulta.tsx';
import VeterinarioBuscarConsultas from "./pages/VeterinarioBuscarConsultas.tsx";
import VeterinarioConsultaPage from "./pages/VeterinarioConsultaPage.tsx";
import VeterinarioCrearReceta from "./pages/VeterinarioCrearReceta.tsx";
import CalendarioPage from "./pages/CalendarioPage.tsx";
import RecBuscarCitas from "./pages/RecBuscarCitas.tsx";
import RecCitaPage from "./pages/RecCitaPage.tsx";
import VeterinarioVacunacionesPage from "./pages/VeterinarioVacunacionesPage.tsx";
import BuscarMascota from "./pages/BuscarMascota.tsx";
import MascotaPage from "./pages/MascotaPage.tsx";
import AdminClinicaEstadisticasPage from "./pages/AdminClinicaEstadisticasPage.tsx";

function App() {

    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/noAutorizado" element={<NoAutorizado />} />
                    
                    {/* Admin Sistema */}
                    <Route path='/adminPage' element={
                        <ProtectedRoute rolesPermitidos={["adminSistema"]}>
                            <AdminPage />
                        </ProtectedRoute>
                    } />

                    {/* Admin Clínica */}
                    <Route path="/adminClinicaPage" element={
                        <ProtectedRoute rolesPermitidos={["adminClinica"]}>
                            <AdminClinicaPage />
                        </ProtectedRoute>
                    } />

                    {/* Recepcionista & Admin Clínica */}
                    <Route path="/recepcionistaPage" element={
                        <ProtectedRoute rolesPermitidos={["recepcionista", "adminClinica"]}>
                            <RecepcionistaPage />
                        </ProtectedRoute>
                    } />
                    
                    {/* Rutas de Recepción (Soportan formato corto y anidado) */}
                    <Route path="/recRegistrarCliente" element={
                        <ProtectedRoute rolesPermitidos={["recepcionista", "adminClinica"]}>
                            <RecRegistrarCliente />
                        </ProtectedRoute>
                    } />
                    <Route path="/recepcionistaPage/recRegistrarCliente" element={
                        <ProtectedRoute rolesPermitidos={["recepcionista", "adminClinica"]}>
                            <RecRegistrarCliente />
                        </ProtectedRoute>
                    } />

                    <Route path="/recRegistrarMascota" element={
                        <ProtectedRoute rolesPermitidos={["recepcionista", "adminClinica"]}>
                            <RecRegistrarMascota />
                        </ProtectedRoute>
                    } />
                    <Route path="/recepcionistaPage/recRegistrarMascota" element={
                        <ProtectedRoute rolesPermitidos={["recepcionista", "adminClinica"]}>
                            <RecRegistrarMascota />
                        </ProtectedRoute>
                    } />

                    <Route path="/recBuscarCliente" element={
                        <ProtectedRoute rolesPermitidos={["recepcionista", "adminClinica"]}>
                            <RecBuscarCliente />
                        </ProtectedRoute>
                    } />
                    <Route path="/recepcionistaPage/recBuscarCliente" element={
                        <ProtectedRoute rolesPermitidos={["recepcionista", "adminClinica"]}>
                            <RecBuscarCliente />
                        </ProtectedRoute>
                    } />

                    <Route path="/recAgendarCita" element={
                        <ProtectedRoute rolesPermitidos={["recepcionista", "adminClinica"]}>
                            <RecAgendarCita />
                        </ProtectedRoute>
                    } />
                    <Route path="/recepcionistaPage/recAgendarCita" element={
                        <ProtectedRoute rolesPermitidos={["recepcionista", "adminClinica"]}>
                            <RecAgendarCita />
                        </ProtectedRoute>
                    } />

                    <Route path="/recPaginaCliente/:clienteId" element={
                        <ProtectedRoute rolesPermitidos={["recepcionista", "adminClinica", "veterinario"]}>
                            <RecPaginaCliente />
                        </ProtectedRoute>
                    } />
                    <Route path={"/recBuscarCitas"} element={
                        <ProtectedRoute rolesPermitidos={["recepcionista", "adminClinica", "veterinario"]}>
                            <RecBuscarCitas />
                        </ProtectedRoute>
                    }/>
                    <Route path={"/recCitaPage/:id"} element={
                        <ProtectedRoute rolesPermitidos={["recepcionista", "adminClinica", "veterinario"]}>
                            <RecCitaPage />
                        </ProtectedRoute>
                    } />
                    {/* Veterinario */}
                    <Route path="/veterinarioPage" element={
                        <ProtectedRoute rolesPermitidos={["veterinario", "adminClinica"]}>
                            <VeterinarioPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/veterinarioPage/veterinarioRegistrarConsulta" element={
                        <ProtectedRoute rolesPermitidos={["veterinario", "adminClinica"]}>
                            <VeterinarioRegistrarConsulta />
                        </ProtectedRoute>
                    } />
                    <Route path="/veterinarioPage/veterinarioBuscarCliente" element={
                        <ProtectedRoute rolesPermitidos={["veterinario", "adminClinica"]}>
                            <RecBuscarCliente />
                        </ProtectedRoute>
                    } />
                    <Route path="/veterinarioPage/veterinarioBuscarConsulta" element={
                        <ProtectedRoute rolesPermitidos={["veterinario", "adminClinica"]}>
                            <VeterinarioBuscarConsultas />
                        </ProtectedRoute>
                    } />
                    <Route path="/veterinarioPage/veterinarioConsultaPage/:consultaId/:veterinarioId" element={
                        <ProtectedRoute>
                            <VeterinarioConsultaPage />
                        </ProtectedRoute>
                    } />

                    {/* Crear Receta (Formato corto y anidado) */}
                    <Route path="/veterinarioCrearReceta" element={
                        <ProtectedRoute rolesPermitidos={["veterinario", "adminClinica"]}>
                            <VeterinarioCrearReceta />
                        </ProtectedRoute>
                    } />
                    <Route path="/veterinarioPage/veterinarioCrearReceta" element={
                        <ProtectedRoute rolesPermitidos={["veterinario", "adminClinica"]}>
                            <VeterinarioCrearReceta />
                        </ProtectedRoute>
                    } />

                    {/* Calendario general */}
                    <Route path="/calendarioPage" element={
                        <ProtectedRoute rolesPermitidos={["veterinario", "recepcionista", "adminClinica"]}>
                            <CalendarioPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/veterinaroVacunacionesPage" element={
                        <ProtectedRoute rolesPermitidos={["veterinario", "adminClinica"]}>
                            <VeterinarioVacunacionesPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/buscarMascota" element={
                        <ProtectedRoute rolesPermitidos={["veterinario", "recepcionista", "adminClinica"]}>
                            <BuscarMascota />
                        </ProtectedRoute>
                     } />
                    <Route path="/mascotaPage/:id" element={
                        <ProtectedRoute rolesPermitidos={["veterinario", "recepcionista", "adminClinica"]} >
                            <MascotaPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/adminClinicaEstadisticasPage" element={
                        <ProtectedRoute rolesPermitidos={["adminClinica"]}>
                            <AdminClinicaEstadisticasPage />
                        </ProtectedRoute>
                    } />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;