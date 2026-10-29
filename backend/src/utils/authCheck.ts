import type{ Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type{RolType} from '../types/RolType.js';
import envGetter from './envGetter.js';

const { SECRET_KEY } = envGetter();

interface JwtPayload{
    userId: number;
    rol: RolType;
}

const authCheck = (req: Request, res: Response, next: NextFunction) => {

    const token = req.cookies.token;

    if(!token){
        return res.json({
            autenticado: false
        });
    }

    try{

        const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;

        req.userId = decoded.userId;
        req.userRol = decoded.rol;

        next();

    } catch(err) {

        console.error(err);

        res.status(401).json({
            ok: false,
            error: err instanceof Error ? err.message : "Hubo un problema con la autenticación del token de sesión"
        });

    }
};

export default authCheck;