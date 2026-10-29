import type {Request, Response} from 'express';
import {
    selectUserByUsername, insertUser, selectUserByUsernameAndRol, selectUserById,
    selectVeterinariosDisponibles
} from '../models/usersModel.js';
import type {UserType, UserClinicaType} from '../types/UserType.js';
import type {ClinicaType} from '../types/ClinicaType.js';
import bcrypt from 'bcrypt';
import {selectClinicaByName} from '../models/clinicasModel.js';
import type {SignOptions} from 'jsonwebtoken';
import pkg from 'jsonwebtoken';
import type {CookieOptionsType} from '../types/CookieOptionsType.js';
import envGetter from '../utils/envGetter.js';

const jwt = pkg;

const {SECRET_KEY} = envGetter();

export const registerUsers = async (req: Request, res: Response) => {
    try {

        const {username, password, rol, clinicaId} = req.body

        const user: UserType | undefined = await selectUserByUsername(username, clinicaId);

        if (user !== undefined) {
            return res.json({
                mensaje: "El nombre de usuario ya esta registrado en esta clinica"
            });
        }

        const hash = await bcrypt.hash(password, 10);

        await insertUser(username, hash, rol, clinicaId);

        res.json({
            ok: true,
            exito: "Usuario registrado correctamente"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            ok: false,
            error: err instanceof Error ? err.message : "Hubo un error al registrar el usuario"
        });

    }
};

export const loginUsers = async (req: Request, res: Response) => {
    try {

        const {username, password, rol, clinicaNombre, recuerdame} = req.body;

        const clinica: ClinicaType | undefined = await selectClinicaByName(clinicaNombre);

        if (clinica === undefined) {
            return res.json({
                mensaje: "El nombre de la clinica es incorrecto"
            });
        }

        const clinicaId = clinica.id;

        const user: UserType | undefined = await selectUserByUsernameAndRol(username, rol, clinicaId);

        if (user === undefined) {
            return res.json({
                mensaje: "El nombre de usuario no existe en la clinica seleccionada"
            });
        }

        const auth = await bcrypt.compare(password, user.password);

        if (!auth) {
            return res.json({
                mensaje: "la contraseña es incorrecta"
            })
        }

        let expiresIn: SignOptions["expiresIn"] = "1h"
        const cookieOptions: CookieOptionsType = {httpOnly: true};

        if (recuerdame === true) {
            expiresIn = "730h";
            cookieOptions.maxAge = 1000 * 60 * 60 * 24 * 30;
        }

        const token = jwt.sign(
            {userId: user.id, rol: user.rol},
            SECRET_KEY,
            {expiresIn}
        );

        res.cookie("token", token, cookieOptions);

        res.json({
            ok: true,
            rol: user.rol,
            exito: "Ha iniciado sesion correctamente"
        });

    } catch (err) {

        console.error(err);

        res.json({
            ok: false,
            error: err instanceof Error ? err.message : "Hubo un error al iniciar sesión"
        });

    }
};

export const autentication = async (req: Request, res: Response) => {

    const usuario: UserClinicaType | undefined = await selectUserById(req.userId as number);

    if (usuario === undefined) {
        return res.json({
            autenticado: false,
        })
    }

    const {password, ...usuarioSinPassword} = usuario;

    res.json({
        autenticado: true,
        userClinica: usuarioSinPassword
    });
};

export const logoutUsers = (req: Request, res: Response) => {
    res.clearCookie("token", {httpOnly: true});
    res.json({
        ok: true,
        exito: "Has cerrado sesión correctamente"
    });
};

export const getUser = async (req: Request, res: Response) => {
    try {

        const id = req.userId;

        if (!id) {
            return res.json({
                mensaje: "ERROR, NO EXISTE EL ID DEL USUARIO EN LA COOKIE DE SESION"
            });
        }

        const userClinica: UserClinicaType | undefined = await selectUserById(id);

        if (userClinica === undefined) {
            return res.json({
                mensaje: "Error, no existe el usuario"
            });
        }

        const {password, ...usuarioSinPassword} = userClinica

        res.json({
            ok: true,
            userClinica: usuarioSinPassword
        })

    } catch (err) {

        console.error(err);

        res.status(500).send({
            ok: false,
            error: err instanceof Error ? err.message : "Hubo un error al obtener el usuario"
        });

    }
};

export const getVeterinarios = async (req: Request, res: Response) => {

    const {clId} = req.query;
    const clinicaId = Number(clId);

    if (!clId) {
        return res.json({
            mensaje: "Hubo un error al obtener el id de la clinica"
        });
    }

    try {

        const veterinarios: UserType[] | undefined = await selectVeterinariosDisponibles(clinicaId);

        if (veterinarios?.length === 0) {
            return res.json({
                mensaje: "No hay veterinarios"
            });
        }

        const veterinariosSinPasswords = veterinarios.map(({password, ...resto}) => resto);

        res.json({
            ok: true,
            veterinarios: veterinariosSinPasswords
        });


    } catch (err) {

        console.error(err);

        return res.json({
            ok: false,
            error: err instanceof Error ? err.message : "Hubo un error al obtener los veterinarios"
        })

    }
};

export const getUsuariosClinica = async (req: Request, res: Response) => {
    try {
        const id = req.userId;

        if (!id) {
            return res.json({
                mensaje: "ERROR, NO EXISTE EL ID DEL USUARIO EN LA COOKIE DE SESION"
            });
        }

        const userClinica: UserClinicaType | undefined = await selectUserById(id);

        if (userClinica === undefined || !userClinica.clinicaId) {
            return res.json({
                mensaje: "Error, no se encontró la clínica asociada al usuario"
            });
        }

        const clinicaId = userClinica.clinicaId;

        const veterinarios: UserType[] | undefined = await selectVeterinariosDisponibles(clinicaId);

        const usuariosSinPasswords = veterinarios ? veterinarios.map(({password, ...resto}) => resto) : [];

        res.json({
            ok: true,
            usuarios: usuariosSinPasswords
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            ok: false,
            error: err instanceof Error ? err.message : "Hubo un error al obtener los usuarios de la clínica"
        });
    }
};