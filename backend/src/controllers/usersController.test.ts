
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response } from "express";

const {
    selectUserByUsername,
    insertUser,
    selectUserByUsernameAndRol,
    selectUserById,
    selectVeterinariosDisponibles,
    selectClinicaByName,
    hash,
    compare,
    sign
} = vi.hoisted(() => ({
    selectUserByUsername: vi.fn(),
    insertUser: vi.fn(),
    selectUserByUsernameAndRol: vi.fn(),
    selectUserById: vi.fn(),
    selectVeterinariosDisponibles: vi.fn(),
    selectClinicaByName: vi.fn(),
    hash: vi.fn(),
    compare: vi.fn(),
    sign: vi.fn()
}));

vi.mock("../models/usersModel.js", () => ({
    selectUserByUsername,
    insertUser,
    selectUserByUsernameAndRol,
    selectUserById,
    selectVeterinariosDisponibles
}));

vi.mock("../models/clinicasModel.js", () => ({
    selectClinicaByName
}));

vi.mock("bcrypt", () => ({
    default: { hash, compare }
}));

vi.mock("jsonwebtoken", () => ({
    default: { sign }
}));

vi.mock("../utils/envGetter.js", () => ({
    default: () => ({ SECRET_KEY: "test_secret" })
}));

import {
    registerUsers,
    loginUsers,
    autentication,
    logoutUsers,
    getUser,
    getVeterinarios,
    getUsuariosClinica
} from "./usersController.js";

const crearReqRes = (body = {}, query = {}, userId?: number) => {
    const req = {
        body,
        query,
        userId
    } as unknown as Request;

    const res = {
        json: vi.fn().mockReturnThis(),
        status: vi.fn().mockReturnThis(),
        send: vi.fn().mockReturnThis(),
        cookie: vi.fn().mockReturnThis(),
        clearCookie: vi.fn().mockReturnThis()
    } as unknown as Response;

    return { req, res };
};

describe("Unitarias - Usuarios", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    // REGISTER USERS

    it("PU-US01 - Debe registrar un usuario correctamente", async () => {
        selectUserByUsername.mockResolvedValue(undefined);
        hash.mockResolvedValue("password_hash");
        insertUser.mockResolvedValue(undefined);

        const { req, res } = crearReqRes({
            username: "usuario1",
            password: "123456",
            rol: "veterinario",
            clinicaId: 1
        });

        await registerUsers(req, res);

        expect(hash).toHaveBeenCalledWith("123456", 10);
        expect(insertUser).toHaveBeenCalledWith(
            "usuario1",
            "password_hash",
            "veterinario",
            1
        );
        expect(res.json).toHaveBeenCalledWith({
            ok: true,
            exito: "Usuario registrado correctamente"
        });
    });

    it("PU-US02 - No debe registrar un usuario con nombre ya existente", async () => {
        selectUserByUsername.mockResolvedValue({ id: 1 });

        const { req, res } = crearReqRes({
            username: "usuario1",
            password: "123456",
            rol: "veterinario",
            clinicaId: 1
        });

        await registerUsers(req, res);

        expect(insertUser).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            mensaje: "El nombre de usuario ya esta registrado en esta clinica"
        });
    });

    it("PU-US03 - Debe manejar errores al registrar un usuario", async () => {
        selectUserByUsername.mockRejectedValue(new Error("Error DB"));

        const { req, res } = crearReqRes({
            username: "usuario1",
            password: "123456",
            rol: "veterinario",
            clinicaId: 1
        });

        await registerUsers(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            ok: false,
            error: "Error DB"
        });
    });

    // LOGIN USERS

    it("PU-US04 - No debe iniciar sesión con una clínica inexistente", async () => {
        selectClinicaByName.mockResolvedValue(undefined);

        const { req, res } = crearReqRes({
            username: "usuario1",
            password: "123456",
            rol: "veterinario",
            clinicaNombre: "Clinica inexistente"
        });

        await loginUsers(req, res);

        expect(selectUserByUsernameAndRol).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            mensaje: "El nombre de la clinica es incorrecto"
        });
    });

    it("PU-US05 - No debe iniciar sesión con un usuario inexistente", async () => {
        selectClinicaByName.mockResolvedValue({ id: 1 });
        selectUserByUsernameAndRol.mockResolvedValue(undefined);

        const { req, res } = crearReqRes({
            username: "usuario1",
            password: "123456",
            rol: "veterinario",
            clinicaNombre: "Clinica prueba"
        });

        await loginUsers(req, res);

        expect(compare).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            mensaje: "El nombre de usuario no existe en la clinica seleccionada"
        });
    });

    it("PU-US06 - No debe iniciar sesión con una contraseña incorrecta", async () => {
        selectClinicaByName.mockResolvedValue({ id: 1 });
        selectUserByUsernameAndRol.mockResolvedValue({
            id: 1,
            username: "usuario1",
            password: "hash",
            rol: "veterinario"
        });
        compare.mockResolvedValue(false);

        const { req, res } = crearReqRes({
            username: "usuario1",
            password: "incorrecta",
            rol: "veterinario",
            clinicaNombre: "Clinica prueba"
        });

        await loginUsers(req, res);

        expect(compare).toHaveBeenCalledWith("incorrecta", "hash");
        expect(sign).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            mensaje: "la contraseña es incorrecta"
        });
    });

    it("PU-US07 - Debe iniciar sesión correctamente", async () => {
        selectClinicaByName.mockResolvedValue({ id: 1 });
        selectUserByUsernameAndRol.mockResolvedValue({
            id: 5,
            username: "usuario1",
            password: "hash",
            rol: "veterinario"
        });
        compare.mockResolvedValue(true);
        sign.mockReturnValue("token_test");

        const { req, res } = crearReqRes({
            username: "usuario1",
            password: "123456",
            rol: "veterinario",
            clinicaNombre: "Clinica prueba",
            recuerdame: false
        });

        await loginUsers(req, res);

        expect(sign).toHaveBeenCalledWith(
            { userId: 5, rol: "veterinario" },
            "test_secret",
            { expiresIn: "1h" }
        );
        expect(res.cookie).toHaveBeenCalledWith(
            "token",
            "token_test",
            { httpOnly: true }
        );
        expect(res.json).toHaveBeenCalledWith({
            ok: true,
            rol: "veterinario",
            exito: "Ha iniciado sesion correctamente"
        });
    });

    it("PU-US08 - Debe configurar una sesión de 30 días al activar recuerdame", async () => {
        selectClinicaByName.mockResolvedValue({ id: 1 });
        selectUserByUsernameAndRol.mockResolvedValue({
            id: 5,
            password: "hash",
            rol: "adminClinica"
        });
        compare.mockResolvedValue(true);
        sign.mockReturnValue("token_test");

        const { req, res } = crearReqRes({
            username: "usuario1",
            password: "123456",
            rol: "adminClinica",
            clinicaNombre: "Clinica prueba",
            recuerdame: true
        });

        await loginUsers(req, res);

        expect(sign).toHaveBeenCalledWith(
            { userId: 5, rol: "adminClinica" },
            "test_secret",
            { expiresIn: "730h" }
        );

        expect(res.cookie).toHaveBeenCalledWith(
            "token",
            "token_test",
            {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 30
            }
        );
    });

    it("PU-US09 - Debe manejar errores durante el inicio de sesión", async () => {
        selectClinicaByName.mockRejectedValue(new Error("Error DB"));

        const { req, res } = crearReqRes({
            username: "usuario1",
            password: "123456",
            rol: "veterinario",
            clinicaNombre: "Clinica prueba"
        });

        await loginUsers(req, res);

        expect(res.json).toHaveBeenCalledWith({
            ok: false,
            error: "Error DB"
        });
    });

    // AUTHENTICATION

    it("PU-US10 - Debe indicar que no está autenticado si el usuario no existe", async () => {
        selectUserById.mockResolvedValue(undefined);

        const { req, res } = crearReqRes({}, {}, 1);

        await autentication(req, res);

        expect(res.json).toHaveBeenCalledWith({
            autenticado: false
        });
    });

    it("PU-US11 - Debe devolver los datos del usuario sin contraseña", async () => {
        selectUserById.mockResolvedValue({
            id: 1,
            username: "usuario1",
            password: "hash",
            rol: "veterinario",
            clinicaId: 1,
            nombreClinica: "Clinica prueba"
        });

        const { req, res } = crearReqRes({}, {}, 1);

        await autentication(req, res);

        expect(res.json).toHaveBeenCalledWith({
            autenticado: true,
            userClinica: {
                id: 1,
                username: "usuario1",
                rol: "veterinario",
                clinicaId: 1,
                nombreClinica: "Clinica prueba"
            }
        });
    });

    // LOGOUT

    it("PU-US12 - Debe cerrar sesión correctamente", () => {
        const { req, res } = crearReqRes();

        logoutUsers(req, res);

        expect(res.clearCookie).toHaveBeenCalledWith(
            "token",
            { httpOnly: true }
        );
        expect(res.json).toHaveBeenCalledWith({
            ok: true,
            exito: "Has cerrado sesión correctamente"
        });
    });

    // GET USER

    it("PU-US13 - Debe indicar que falta el ID del usuario", async () => {
        const { req, res } = crearReqRes();

        await getUser(req, res);

        expect(selectUserById).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            mensaje: "ERROR, NO EXISTE EL ID DEL USUARIO EN LA COOKIE DE SESION"
        });
    });

    it("PU-US14 - Debe indicar que el usuario no existe", async () => {
        selectUserById.mockResolvedValue(undefined);

        const { req, res } = crearReqRes({}, {}, 1);

        await getUser(req, res);

        expect(res.json).toHaveBeenCalledWith({
            mensaje: "Error, no existe el usuario"
        });
    });

    it("PU-US15 - Debe devolver los datos del usuario sin contraseña", async () => {
        selectUserById.mockResolvedValue({
            id: 1,
            username: "usuario1",
            password: "hash",
            rol: "veterinario",
            clinicaId: 1
        });

        const { req, res } = crearReqRes({}, {}, 1);

        await getUser(req, res);

        expect(res.json).toHaveBeenCalledWith({
            ok: true,
            userClinica: {
                id: 1,
                username: "usuario1",
                rol: "veterinario",
                clinicaId: 1
            }
        });
    });

    it("PU-US16 - Debe manejar errores al obtener un usuario", async () => {
        selectUserById.mockRejectedValue(new Error("Error DB"));

        const { req, res } = crearReqRes({}, {}, 1);

        await getUser(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            ok: false,
            error: "Error DB"
        });
    });

    // GET VETERINARIOS

    it("PU-US17 - Debe indicar que falta el ID de la clínica", async () => {
        const { req, res } = crearReqRes();

        await getVeterinarios(req, res);

        expect(selectVeterinariosDisponibles).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            mensaje: "Hubo un error al obtener el id de la clinica"
        });
    });

    it("PU-US18 - Debe indicar que no hay veterinarios disponibles", async () => {
        selectVeterinariosDisponibles.mockResolvedValue([]);

        const { req, res } = crearReqRes({}, { clId: "1" });

        await getVeterinarios(req, res);

        expect(res.json).toHaveBeenCalledWith({
            mensaje: "No hay veterinarios"
        });
    });

    it("PU-US19 - Debe devolver los veterinarios sin sus contraseñas", async () => {
        selectVeterinariosDisponibles.mockResolvedValue([
            {
                id: 1,
                username: "veterinario1",
                password: "hash",
                rol: "veterinario",
                clinicaId: 1
            }
        ]);

        const { req, res } = crearReqRes({}, { clId: "1" });

        await getVeterinarios(req, res);

        expect(res.json).toHaveBeenCalledWith({
            ok: true,
            veterinarios: [
                {
                    id: 1,
                    username: "veterinario1",
                    rol: "veterinario",
                    clinicaId: 1
                }
            ]
        });
    });

    it("PU-US20 - Debe manejar errores al consultar veterinarios", async () => {
        selectVeterinariosDisponibles.mockRejectedValue(new Error("Error DB"));

        const { req, res } = crearReqRes({}, { clId: "1" });

        await getVeterinarios(req, res);

        expect(res.json).toHaveBeenCalledWith({
            ok: false,
            error: "Error DB"
        });
    });

    // GET USUARIOS CLINICA

    it("PU-US21 - Debe indicar que falta el ID del usuario", async () => {
        const { req, res } = crearReqRes();

        await getUsuariosClinica(req, res);

        expect(selectUserById).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            mensaje: "ERROR, NO EXISTE EL ID DEL USUARIO EN LA COOKIE DE SESION"
        });
    });

    it("PU-US22 - Debe indicar que el usuario no tiene una clínica asociada", async () => {
        selectUserById.mockResolvedValue({
            id: 1,
            username: "usuario1",
            password: "hash",
            rol: "adminClinica",
            clinicaId: null
        });

        const { req, res } = crearReqRes({}, {}, 1);

        await getUsuariosClinica(req, res);

        expect(selectVeterinariosDisponibles).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            mensaje: "Error, no se encontró la clínica asociada al usuario"
        });
    });

    it("PU-US23 - Debe devolver los usuarios de la clínica sin contraseñas", async () => {
        selectUserById.mockResolvedValue({
            id: 1,
            username: "admin",
            password: "hash",
            rol: "adminClinica",
            clinicaId: 1
        });

        selectVeterinariosDisponibles.mockResolvedValue([
            {
                id: 2,
                username: "veterinario1",
                password: "hash",
                rol: "veterinario",
                clinicaId: 1
            }
        ]);

        const { req, res } = crearReqRes({}, {}, 1);

        await getUsuariosClinica(req, res);

        expect(res.json).toHaveBeenCalledWith({
            ok: true,
            usuarios: [
                {
                    id: 2,
                    username: "veterinario1",
                    rol: "veterinario",
                    clinicaId: 1
                }
            ]
        });
    });

    it("PU-US24 - Debe devolver una lista vacía cuando no hay usuarios", async () => {
        selectUserById.mockResolvedValue({
            id: 1,
            username: "admin",
            password: "hash",
            rol: "adminClinica",
            clinicaId: 1
        });

        selectVeterinariosDisponibles.mockResolvedValue(undefined);

        const { req, res } = crearReqRes({}, {}, 1);

        await getUsuariosClinica(req, res);

        expect(res.json).toHaveBeenCalledWith({
            ok: true,
            usuarios: []
        });
    });

    it("PU-US25 - Debe manejar errores al consultar usuarios de la clínica", async () => {
        selectUserById.mockRejectedValue(new Error("Error DB"));

        const { req, res } = crearReqRes({}, {}, 1);

        await getUsuariosClinica(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            ok: false,
            error: "Error DB"
        });
    });

});
