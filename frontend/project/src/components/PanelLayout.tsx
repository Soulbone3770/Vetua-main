import type { ReactNode } from "react";
import "../styles/veterinario.css";

type PanelLayoutProps = {
    titulo: string;
    rol: string;
    onBack: () => void;
    iconoBack?: "volver" | "salir";
    children: ReactNode;
};

const PanelLayout = ({ titulo, rol, onBack, iconoBack = "volver", children }: PanelLayoutProps) => {
    return (
        <div className="vet-app">
            <header className="vet-header">
                <div className="vet-header-izq">
                    <button
                        type="button"
                        className="vet-icono-btn"
                        onClick={onBack}
                        aria-label={iconoBack === "salir" ? "Cerrar sesión" : "Volver"}
                        title={iconoBack === "salir" ? "Cerrar sesión" : "Volver"}
                    >
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <line x1="4" y1="5" x2="4" y2="19" />
                            <polyline points="19 5 9 12 19 19" />
                        </svg>
                    </button>
                    <h1>{titulo}</h1>
                </div>
                <div className="vet-pestana">{rol}</div>
            </header>
            {children}
        </div>
    );
};

export default PanelLayout;