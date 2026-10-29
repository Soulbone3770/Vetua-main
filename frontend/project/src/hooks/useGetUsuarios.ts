import { useEffect, useState } from "react";

export interface UsuarioItem {
  id: number;
  username: string;
  rol: string;
}

const API_URL = import.meta.env.VITE_API_URL;

const useGetUsuarios = () => {
    const [usuarios, setUsuarios] = useState<UsuarioItem[]>([]);
    const [mensaje, setMensaje] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const get = async () => {
            try {
                const res: Response = await fetch(`${API_URL}/users/api/getUsuariosClinica`, {
                    credentials: "include"
                });
                
                const data = await res.json();

                if (data.error) {
                    setMensaje(data.error);
                    return;
                }

                setMensaje(data.mensaje ?? "");
                setUsuarios(data.usuarios ?? []);
            } catch  {
                setMensaje("No se pudo conectar con el servidor");
            } finally {
                setLoading(false);
            }
        };

        get();
    }, []);

    return { usuarios, mensaje, loading };
};

export default useGetUsuarios;