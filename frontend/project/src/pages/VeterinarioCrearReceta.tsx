
import useGetUser from "../hooks/useGetUser.ts";
import Logout from "../hooks/Logout.ts";
import { PageHeader } from "../components/FormUI.tsx";

const VeterinarioCrearReceta = () => {
    const { user, loading } = useGetUser();
    const { logoutProcess } = Logout();

    if (loading) return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <h1 className="animate-pulse text-xl font-semibold !text-purple-700">CARGANDO...</h1>
        </div>
    );

    if (!user) return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <h1 className="text-xl font-semibold !text-red-600">Hubo un problema al obtener el usuario</h1>
        </div>
    );

    return (
        <div className="min-h-screen w-full bg-[#EEF1FA]">
            <PageHeader
                titulo="Crear Receta"
                rolLabel="Veterinario"
                onExit={() => logoutProcess()}
                subtitulo={`${user.username} - ${user.nombreClinica}`}
            />

            <main className="mx-auto max-w-4xl px-6 py-10">
                <div className="rounded-xl bg-white p-6 shadow-md">
                    <h2 className="border-b border-gray-200 pb-2 text-xl font-bold !text-black">
                        Nueva Receta Médica
                    </h2>
                    <p className="mt-4 text-sm text-gray-700">
                        Aquí puedes implementar el formulario para registrar y emitir la receta del paciente.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default VeterinarioCrearReceta;