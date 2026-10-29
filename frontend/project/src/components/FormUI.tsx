import React from "react";
import { useNavigate } from "react-router-dom";

// Estilos reutilizables (mismo look que Input.tsx)
export const CAMPO =
    "w-full px-4 py-2.5 bg-[#F8F9FA] border border-gray-400 rounded-2xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition";

export const BOTON_PRINCIPAL =
    "w-full rounded-xl bg-[#4C00C8] px-6 py-3.5 text-base font-medium text-white shadow-md transition hover:bg-[#3b009c]";

// ---------- Encabezado morado ----------
interface PageHeaderProps {
    titulo: string;
    rolLabel?: string;
    volverA?: string | number; // ruta, o -1 para volver a la página anterior
    onExit?: () => void;       // si se pasa, el icono ejecuta esto en vez de navegar (ej. cerrar sesión)
    subtitulo?: string;        // texto pequeño bajo el rol (ej. usuario - clínica)
}

export const PageHeader = ({ titulo, rolLabel = "Recepcionista", volverA = "/recepcionistaPage", onExit, subtitulo }: PageHeaderProps) => {
    const navigate = useNavigate();
    return (
        <header className="relative w-full overflow-hidden bg-gradient-to-r from-[#3B0A9E] via-[#4C14B8] to-[#3B0A9E] text-white">
            <div className="pointer-events-none absolute -right-10 top-0 h-full w-1/3 skew-x-[-30deg] bg-white/5" />
            <div className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-8 md:px-10">
                <button
                    type="button"
                    onClick={() => { if (onExit) { onExit(); } else if (typeof volverA === "number") { navigate(volverA); } else { navigate(volverA); } }}
                    className="flex items-center gap-4 text-white"
                    aria-label="Volver"
                    title="Volver"
                >
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 4v16" />
                        <path d="M19 5l-9 7 9 7V5z" />
                    </svg>
                    <span className="text-3xl font-bold uppercase tracking-wide md:text-4xl">{titulo}</span>
                </button>
                <div className="text-right">
                    <span className="block text-lg font-medium md:text-xl">{rolLabel}</span>
                    <span className="mt-1 block h-1.5 w-full rounded bg-white/30" />
                    {subtitulo && <span className="mt-1 block text-xs text-purple-200">{subtitulo}</span>}
                </div>
            </div>
        </header>
    );
};

// ---------- Contenedor de página ----------
interface PaginaProps {
    titulo: string;
    ancho?: string; // clase de max-width, ej: "max-w-5xl"
    rolLabel?: string;
    volverA?: string | number;
    children: React.ReactNode;
}

export const Pagina = ({ titulo, ancho = "max-w-5xl", rolLabel, volverA, children }: PaginaProps) => (
    <div className="min-h-screen w-full bg-[#EEF1FA]">
        <PageHeader titulo={titulo} rolLabel={rolLabel} volverA={volverA} />
        <main className={`mx-auto w-full ${ancho} space-y-6 px-6 py-10`}>{children}</main>
    </div>
);

// ---------- Tarjeta blanca con título ----------
interface FormCardProps {
    titulo: string;
    derecha?: string;
    children: React.ReactNode;
}

export const FormCard = ({ titulo, derecha, children }: FormCardProps) => (
    <section className="rounded-xl bg-white p-6 shadow-md">
        <div className="mb-5 flex items-end justify-between border-b border-gray-800 pb-2">
            <h2 className="text-xl font-bold !text-black">{titulo}</h2>
            {derecha && <span className="text-sm text-gray-800">{derecha}</span>}
        </div>
        {children}
    </section>
);

// ---------- Select con etiqueta ----------
interface SelectFieldProps {
    name: string;
    label: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    children: React.ReactNode;
}

export const SelectField = ({ name, label, value, onChange, children }: SelectFieldProps) => (
    <div className="mb-4 flex w-full flex-col text-left">
        <label htmlFor={name} className="mb-1 block text-left text-sm font-medium text-gray-800">
            {label}
        </label>
        <select id={name} name={name} value={value} onChange={onChange} className={CAMPO}>
            {children}
        </select>
    </div>
);

// ---------- Checkbox de autorización ----------
interface AutorizoProps {
    name?: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Autorizo = ({ name = "autorizo", checked, onChange }: AutorizoProps) => (
    <label className="flex cursor-pointer items-start gap-3 text-sm text-gray-800">
        <input
            type="checkbox"
            name={name}
            checked={checked}
            onChange={onChange}
            className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-purple-600"
        />
        <span>Autorizo el tratamiento de mis datos personales de acuerdo con la política de tratamiento de la clínica</span>
    </label>
);

// Dato de solo lectura con el mismo aspecto que un campo
export const Dato = ({ label, valor }: { label: string; valor: unknown }) => (
    <div className="mb-4 flex w-full flex-col text-left">
        <span className="mb-1 block text-sm font-medium text-gray-800">{label}</span>
        <div className="min-h-[42px] w-full rounded-2xl border border-gray-300 bg-[#F8F9FA] px-4 py-2.5 text-sm text-gray-900">
            {valor === undefined || valor === null || valor === "" ? "—" : String(valor)}
        </div>
    </div>
);