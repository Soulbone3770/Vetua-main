export type UsuarioType = {
    id: number;
    username: string;
    rol: string;
};

export type UsuariosDataType = {
    ok?: boolean;
    error?: string;
    mensaje?: string;
    usuarios?: UsuarioType[];
};