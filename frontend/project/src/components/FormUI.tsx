import React from "react";
import { Link, useNavigate } from "react-router-dom";

// Estilos reutilizables (mismo look que Input.tsx)
export const CAMPO =
    "w-full px-4 py-2.5 bg-[#F8F9FA] border border-gray-400 rounded-2xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition";

export const BOTON_SECUNDARIO =
    "w-full rounded-xl border-2 border-[#4C00C8] bg-white px-6 py-3.5 text-base font-medium text-[#4C00C8] transition hover:bg-purple-50";

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

// ---------- Textarea con etiqueta ----------
interface TextAreaFieldProps {
    name: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    rows?: number;
}

export const TextAreaField = ({ name, label, value, onChange, rows = 4 }: TextAreaFieldProps) => (
    <div className="mb-4 flex w-full flex-col text-left">
        <label htmlFor={name} className="mb-1 block text-left text-sm font-medium text-gray-800">
            {label}
        </label>
        <textarea id={name} name={name} rows={rows} value={value} onChange={onChange} className={`${CAMPO} resize-none`} />
    </div>
);

// ---------- Tarjeta de acción (barra de color a la izquierda + botón) ----------
interface TarjetaAccionProps {
    titulo: string;
    texto: string;
    boton: string;
    color: string;      // color de la barra lateral y del botón (hex)
    ruta?: string;      // destino al hacer clic
    disabled?: boolean; // si la pantalla de destino todavía no existe
}

export const TarjetaAccion = ({ titulo, texto, boton, color, ruta, disabled = false }: TarjetaAccionProps) => (
    <div className="flex overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-lg">
        <div className="w-3 shrink-0" style={{ backgroundColor: color }} />
        <div className="flex-1 p-5">
            <h3 className="border-b border-gray-400 pb-2 text-xl font-bold !text-black">{titulo}</h3>
            <div className="mt-3 flex items-end justify-between gap-4">
                <p className="max-w-xs text-xs leading-relaxed text-gray-800">{texto}</p>
                {disabled || !ruta ? (
                    <span
                        title="Próximamente"
                        className="shrink-0 cursor-not-allowed rounded-lg border-2 bg-white px-4 py-2 text-sm font-medium opacity-50"
                        style={{ borderColor: color, color }}
                    >
                        {boton}
                    </span>
                ) : (
                    <Link
                        to={ruta}
                        className="shrink-0 rounded-lg border-2 bg-white px-4 py-2 text-sm font-medium transition"
                        style={{ borderColor: color, color }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = color; e.currentTarget.style.color = "white"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "white"; e.currentTarget.style.color = color; }}
                    >
                        {boton}
                    </Link>
                )}
            </div>
        </div>
    </div>
);

// ---------- Estados de carga / error ----------
export const Cargando = () => (
    <h1 className="animate-pulse py-10 text-center text-xl font-semibold !text-purple-700">CARGANDO...</h1>
);

export const MensajeError = ({ texto }: { texto: string }) => (
    <p className="text-sm font-medium text-red-500">{texto}</p>
);

// ---------- Fila de lista con flecha ----------
interface FilaListaProps {
    titulo: string;
    lineas?: [string, string][]; // pares [etiqueta, valor]
    onClick: () => void;
}

export const FilaLista = ({ titulo, lineas = [], onClick }: FilaListaProps) => (
    <div
        onClick={onClick}
        className="flex cursor-pointer items-center justify-between border-b border-gray-300 px-1 py-3 transition last:border-b-0 hover:bg-purple-50"
    >
        <div className="text-left">
            <p className="text-lg font-semibold text-gray-600">{titulo}</p>
            {lineas.map(([etiqueta, valor]) => (
                <p key={etiqueta} className="text-sm text-gray-900">
                    <span className="font-bold">{etiqueta}:</span> {valor}
                </p>
            ))}
        </div>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12h16" />
            <path d="M14 6l6 6-6 6" />
        </svg>
    </div>
);

// ---------- Buscador por tipo y número de documento ----------
interface BuscadorDocumentoProps {
    tipo: string;
    numero: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onSubmit: () => void;
    opciones: readonly string[];
}

export const BuscadorDocumento = ({ tipo, numero, onChange, onSubmit, opciones }: BuscadorDocumentoProps) => (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
        <p className="mb-1 text-sm font-bold text-black">Introduzca el número y tipo de documento del cliente</p>
        <div className="flex flex-col gap-3 md:flex-row">
            <select name="clienteTipoDocumento" aria-label="Tipo de documento" value={tipo} onChange={onChange} className={`${CAMPO} md:w-40`}>
                <option value="">Tipo</option>
                {opciones.map(t => (
                    <option key={t} value={t}>{t}</option>
                ))}
            </select>
            <input
                name="clienteNumDocumento"
                type="text"
                aria-label="Número de documento"
                placeholder="Número de documento"
                value={numero}
                onChange={onChange}
                className={`${CAMPO} flex-1`}
            />
            <button type="submit" className="rounded-2xl bg-[#4C00C8] px-6 py-2.5 text-sm font-medium text-white shadow-md transition hover:bg-[#3b009c]">
                Buscar cliente
            </button>
        </div>
    </form>
);

// ---------- Panel de inicio (recepción / veterinario) ----------
// Icono de calendario con el mes y el día de hoy; lleva a la página del calendario
const CalendarioIcono = () => {
    const hoy = new Date();
    const mes = hoy.toLocaleDateString("es-CO", { month: "long" });
    const mesCapitalizado = mes.charAt(0).toUpperCase() + mes.slice(1);

    return (
        <Link
            to="/calendarioPage"
            aria-label="Abrir calendario"
            className="block w-36 shrink-0 overflow-hidden rounded-xl border-2 border-gray-300 bg-white text-center shadow transition hover:shadow-lg"
        >
            <div className="h-4 bg-[#4C14B8]" />
            <div className="pt-2 text-lg !text-gray-600">{mesCapitalizado}</div>
            <div className="pb-3 text-6xl font-light !text-gray-700">{hoy.getDate()}</div>
        </Link>
    );
};

export const SeccionCalendario = () => (
    <section className="bg-white shadow-md">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-8 md:flex-row md:px-10">
            <div className="flex w-full justify-center md:w-auto">
                <CalendarioIcono />
            </div>
            <div className="hidden h-28 w-px bg-gray-400 md:block" />
            <div className="text-left">
                <h2 className="text-xl font-bold !text-black">Calendario</h2>
                <h3 className="mt-1 max-w-sm text-2xl font-bold leading-tight !text-gray-500">
                    Accede al calendario para ver las próximas citas
                </h3>
                <p className="mt-2 max-w-2xl text-sm text-gray-800">
                    Haz click en el ícono para acceder al calendario, donde podrás ver las próximas
                    citas programadas, así como acceder a su menú, donde podrás editarlas o cancelarlas.
                </p>
            </div>
        </div>
    </section>
);

interface PanelProps {
    rolLabel: string;
    subtitulo?: string;
    onExit: () => void;
    children: React.ReactNode;
}

export const Panel = ({ rolLabel, subtitulo, onExit, children }: PanelProps) => (
    <div className="min-h-screen w-full bg-[#EEF1FA]">
        <PageHeader titulo="Bienvenido/a" rolLabel={rolLabel} subtitulo={subtitulo} onExit={onExit} />
        <SeccionCalendario />
        <main className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-6 py-14 md:grid-cols-2 md:px-10">{children}</main>
    </div>
);