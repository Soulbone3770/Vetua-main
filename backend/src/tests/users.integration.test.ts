import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import app from "../app.js";
import db from "../utils/db.js";
import envGetter from "../utils/envGetter.js";

const { SECRET_KEY } = envGetter();

const usernameTest = "test_usuario_integracion";
const usernameVeterinario = "test_veterinario_integracion";
const usernameRecepcionista = "test_recepcionista_integracion";
const passwordTest = "PasswordTest123";

let clinicaId: number;
let clinicaNombre: string;
let veterinarioId: number;
let token: string;

describe("Integración - Users", () => {

    beforeAll(async () => {

        // Obtener una clínica existente
        const [clinicas] = await db.query<RowDataPacket[]>(
            "SELECT id, nombre FROM clinicas LIMIT 1"
        );

        expect(clinicas.length).toBeGreaterThan(0);

        if(clinicas[0] === undefined){
            throw new Error("No existe la clinica error");
        }

        clinicaId = clinicas[0].id;
        clinicaNombre = clinicas[0].nombre;

        const passwordHash = await bcrypt.hash(passwordTest, 10);

        // Crear veterinario para las pruebas
        const [veterinario] = await db.query<ResultSetHeader>(
            `INSERT INTO clinica_users
            (username, password, rol, clinicaId)
            VALUES (?, ?, ?, ?)`,
            [
                usernameVeterinario,
                passwordHash,
                "veterinario",
                clinicaId
            ]
        );

        veterinarioId = veterinario.insertId;

        // Crear recepcionista para las pruebas
        await db.query<ResultSetHeader>(
            `INSERT INTO clinica_users
            (username, password, rol, clinicaId)
            VALUES (?, ?, ?, ?)`,
            [
                usernameRecepcionista,
                passwordHash,
                "recepcionista",
                clinicaId
            ]
        );

        // Generar token para las pruebas autenticadas
        token = jwt.sign(
            {
                userId: veterinarioId,
                rol: "veterinario"
            },
            SECRET_KEY,
            { expiresIn: "1h" }
        );
    });

    afterAll(async () => {

        await db.query(
            `DELETE FROM clinica_users
            WHERE username IN (?, ?, ?)`,
            [
                usernameTest,
                usernameVeterinario,
                usernameRecepcionista
            ]
        );

        // No cerrar aquí el pool si otros archivos de pruebas
        // también utilizan la misma conexión.
    });

    // PI-US01: Registrar usuario correctamente
    it("PI-US01 - Debe registrar un usuario correctamente", async () => {

        const response = await request(app)
            .post("/users/api/register")
            .send({
                username: usernameTest,
                password: passwordTest,
                rol: "recepcionista",
                clinicaId
            });

        expect(response.status).toBe(200);

        const [usuarios] = await db.query<RowDataPacket[]>(
            "SELECT * FROM clinica_users WHERE username = ? AND clinicaId = ?",
            [usernameTest, clinicaId]
        );

        expect(usuarios.length).toBe(1);

        if(usuarios[0] === undefined){
            throw new Error("No existe el usuario error");
        }

        const passwordValida = await bcrypt.compare(
            passwordTest,
            usuarios[0].password
        );

        expect(passwordValida).toBe(true);
    });

    // PI-US02: Evitar registrar usuarios duplicados
    it("PI-US02 - No debe permitir registrar un usuario duplicado", async () => {

        const response = await request(app)
            .post("/users/api/register")
            .send({
                username: usernameTest,
                password: passwordTest,
                rol: "recepcionista",
                clinicaId
            });

        expect(response.status).toBe(200);

        const [usuarios] = await db.query<RowDataPacket[]>(
            "SELECT * FROM clinica_users WHERE username = ? AND clinicaId = ?",
            [usernameTest, clinicaId]
        );

        expect(usuarios.length).toBe(1);
    });

    // PI-US03: Iniciar sesión correctamente
    it("PI-US03 - Debe permitir iniciar sesión con credenciales correctas", async () => {

        const response = await request(app)
            .post("/users/api/login")
            .send({
                username: usernameTest,
                password: passwordTest,
                rol: "recepcionista",
                clinicaNombre
            });

        expect(response.status).toBe(200);
        expect(response.body.ok).toBe(true);
        expect(response.body.rol).toBe("recepcionista");
        expect(response.body.exito).toBe("Ha iniciado sesion correctamente");
        expect(response.headers["set-cookie"]).toBeDefined();
    });


    // PI-US04: Rechazar contraseña incorrecta
    it("PI-US04 - No debe permitir iniciar sesión con una contraseña incorrecta", async () => {

        const response = await request(app)
            .post("/users/api/login")
            .send({
                username: usernameTest,
                password: "PasswordIncorrecta",
                rol: "recepcionista",
                clinicaNombre
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("mensaje");
        expect(response.body.mensaje).toBe("la contraseña es incorrecta");
        expect(response.headers["set-cookie"]).toBeUndefined();
    });

    // PI-US05: Obtener usuario autenticado
    it("PI-US05 - Debe obtener los datos del usuario autenticado", async () => {

        const response = await request(app)
            .get("/users/api/getUser")
            .set("Cookie", `token=${token}`);

        expect(response.status).toBe(200);
        expect(response.body.ok).toBe(true);
        expect(response.body).toHaveProperty("userClinica");
        expect(response.body.userClinica).not.toHaveProperty("password");
        expect(response.body.userClinica.id).toBe(veterinarioId);
    });

    // PI-US06: Verificar autenticación
    it("PI-US06 - Debe verificar que el usuario está autenticado", async () => {

        const response = await request(app)
            .get("/users/api/authCheck")
            .set("Cookie", `token=${token}`);

        expect(response.status).toBe(200);
        expect(response.body.autenticado).toBe(true);
        expect(response.body.userClinica).not.toHaveProperty("password");
    });

    // PI-US07: Cerrar sesión
    it("PI-US07 - Debe cerrar sesión correctamente", async () => {

        const response = await request(app)
            .post("/users/api/logout")
            .set("Cookie", `token=${token}`);

        expect(response.status).toBe(200);
        expect(response.body.ok).toBe(true);
        expect(response.body.exito).toBe("Has cerrado sesión correctamente");
        expect(response.headers["set-cookie"]).toBeDefined();
    });

    // PI-US08: Obtener veterinarios disponibles
    it("PI-US08 - Debe obtener los veterinarios disponibles de una clínica", async () => {

        const response = await request(app)
            .get(`/users/api/getVeterinarios?clId=${clinicaId}`)
            .set("Cookie", `token=${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("veterinarios");

        const veterinarioEncontrado = response.body.veterinarios.find(
            (v: { id: number }) => v.id === veterinarioId
        );

        expect(veterinarioEncontrado).toBeDefined();
        expect(veterinarioEncontrado).not.toHaveProperty("password");
    });

    // PI-US09: Obtener usuarios de la clínica
    it("PI-US09 - Debe obtener los usuarios disponibles de la clínica", async () => {

        const response = await request(app)
            .get("/users/api/getUsuariosClinica")
            .set("Cookie", `token=${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("usuarios");

        expect(Array.isArray(response.body.usuarios)).toBe(true);

        const veterinarioEncontrado = response.body.usuarios.find(
            (v: { id: number }) => v.id === veterinarioId
        );

        expect(veterinarioEncontrado).toBeDefined();
        expect(veterinarioEncontrado).not.toHaveProperty("password");
    });

});