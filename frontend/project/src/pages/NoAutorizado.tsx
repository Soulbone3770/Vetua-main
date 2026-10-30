import { Link } from "react-router-dom";
import { PageHeader } from "../components/FormUI.tsx";

const NoAutorizado = () => {

    return (
        <div className="min-h-screen w-full bg-[#EEF1FA]">
            <PageHeader titulo="Acceso denegado" rolLabel="Vetua" volverA="/" />
            <main className="mx-auto max-w-xl px-6 py-16">
                <div className="overflow-hidden rounded-xl bg-white shadow-md">
                    <div className="h-5 bg-[#8B3A3A]" />
                    <div className="p-8 text-center">
                        <h2 className="text-xl font-bold !text-black">No está autorizado</h2>
                        <p className="mt-3 text-sm text-gray-800">No tiene permiso para entrar a esta página.</p>
                        <Link to="/" className="mt-6 inline-block rounded-xl bg-[#4C00C8] px-8 py-3 text-sm font-medium !text-white shadow-md transition hover:bg-[#3b009c]">
                            Volver al inicio
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    )
};

export default NoAutorizado;