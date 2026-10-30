import { Link } from 'react-router-dom';
import {RutasSegunRol} from "../types/RutasSegunRol.ts";
import useAuth from '../hooks/useAuth.ts';

const Index = () => {

    //Import del contexto donde se almacenan los datos de la sesión usando el hook useAuth()
    const { rol } = useAuth();

    return (
        <div id="mainIndex" className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#3B0A9E] via-[#4C14B8] to-[#2A0770] px-6 text-white">
            <div className="pointer-events-none absolute -right-20 top-0 h-full w-1/3 skew-x-[-30deg] bg-white/5" />
            <div className="relative z-10 max-w-xl text-center">
                <span className="text-sm font-light tracking-[0.3em] text-white opacity-90">VETUA</span>
                <h1 className="mt-4 text-4xl font-bold leading-tight !text-white md:text-6xl">
                    Gestiona tus tareas con facilidad
                </h1>
                <p className="mt-4 text-lg font-light !text-white opacity-90">Sistema de gestión veterinaria</p>
                <Link
                    to={RutasSegunRol[rol] ?? "/login"}
                    className="mt-10 inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-3.5 text-base font-medium !text-[#4C00C8] shadow-md transition hover:bg-purple-50"
                >
                    <span>Acceder</span>
                    <span className="text-lg">→</span>
                </Link>
            </div>
        </div>
    );
};

export default Index;