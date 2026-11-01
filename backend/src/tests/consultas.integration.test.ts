
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import app from "../app.js";
import db from "../utils/db.js";
import envGetter from "../utils/envGetter.js";

const { SECRET_KEY } = envGetter();

const token = jwt.sign(
    { userId: 1, rol: "adminClinica" },
    SECRET_KEY
);

const documento = "TESTCONSULTAS987654";
const usernameVeterinario = "veterinario_test_consultas";
const cookie = `token=${token}`;

let clienteId: number;
let mascotaId: number;
let veterinarioId: number;
let clinicaId: number;
let consultaId: number;

describe("Integración - Consultas", () => {

    beforeAll(async () => {
        const [clinicas] = await db.query<RowDataPacket[]>(
            "SELECT id FROM clinicas LIMIT 1"
        );

        if (!clinicas[0]) {
            throw new Error("NO CLINICA SELECCIONADA");
        }

        clinicaId = clinicas[0].id;

        const [cliente] = await db.query<ResultSetHeader>(
            `INSERT INTO clientes (
                nombres, apellidos, fecha_nacimiento, tipo_documento,
                num_documento, sexo, telefono, correo, direccion,
                ciudad, departamento
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                "Cliente", "Prueba", "2000-01-01", "CC",
                documento, "Masculino", "3001234567",
                "consultas.test@vetua.test", "Direccion test",
                "Bogota", "Cundinamarca"
            ]
        );

        clienteId = cliente.insertId;

        const [mascota] = await db.query<ResultSetHeader>(
            `INSERT INTO mascotas (
                nombre, especie, raza, sexo, fecha_nacimiento,
                propietarioId, clinicaId
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                "MascotaTestConsultas", "Perro", "Criollo",
                "Macho", "2022-01-01", clienteId, clinicaId
            ]
        );

        mascotaId = mascota.insertId;

        const [veterinario] = await db.query<ResultSetHeader>(
            `INSERT INTO clinica_users (
                username, password, rol, clinicaId
            ) VALUES (?, ?, ?, ?)`,
            [
                usernameVeterinario, "password_test",
                "veterinario", clinicaId
            ]
        );

        veterinarioId = veterinario.insertId;
    });

    afterAll(async () => {
        try {
            if (consultaId) {
                await db.query(
                    "DELETE FROM consultas WHERE id = ?",
                    [consultaId]
                );
            }

            if (mascotaId) {
                await db.query(
                    "DELETE FROM mascotas WHERE id = ?",
                    [mascotaId]
                );
            }

            if (clienteId) {
                await db.query(
                    "DELETE FROM clientes WHERE id = ?",
                    [clienteId]
                );
            }

            if (veterinarioId) {
                await db.query(
                    "DELETE FROM clinica_users WHERE id = ?",
                    [veterinarioId]
                );
            }
        } finally {
            await db.end();
        }
    });

    it("PI-CO14 - Debe registrar una consulta correctamente", async () => {
        const response = await request(app)
            .post("/consultas/api/registerConsulta")
            .set("Cookie", cookie)
            .send({
                fecha_hora: "2027-05-15 10:00:00",
                motivo_consulta: "Consulta general",
                peso_en_consulta: 12.5,
                temperatura: 38.5,
                frecuencia_cardiaca: 100,
                sintomas: "Falta de apetito",
                diagnostico: "Infeccion leve",
                tratamiento_indicado: "Tratamiento de prueba",
                observaciones: "Control posterior",
                costo: 50000,
                nombre_mascota: "MascotaTestConsultas",
                cliente_tipo_documento: "CC",
                cliente_num_documento: documento,
                id_veterinario: veterinarioId,
                id_clinica: clinicaId
            });

        expect(response.status).toBe(200);
        expect(response.body.ok).toBe(true);

        const [consultas] = await db.query<RowDataPacket[]>(
            "SELECT * FROM consultas WHERE id_mascota = ?",
            [mascotaId]
        );

        expect(consultas.length).toBe(1);

        if(consultas[0] === undefined){
            throw new Error("Erorr la consulta no existe");
        }

        consultaId = consultas[0].id;
    });

    it("PI-CO15 - Debe consultar las consultas de un veterinario", async () => {
        const response = await request(app)
            .get("/consultas/api/getConsultas")
            .query({ veterinarioId });

        expect(response.status).toBe(200);
        expect(response.body.ok).toBe(true);
        expect(response.body.consultas.length).toBeGreaterThan(0);
    });

    it("PI-CO16 - Debe consultar una consulta por veterinario y clínica", async () => {
        const response = await request(app)
            .get("/consultas/api/getConsultasByQuery")
            .query({
                veterinarioId,
                clinicaId
            });

        expect(response.status).toBe(200);
        expect(response.body.ok).toBe(true);
        expect(response.body.consulta.id).toBe(consultaId);
    });

    it("PI-CO17 - Debe consultar una consulta por su ID y veterinario", async () => {
        const response = await request(app)
            .get(
                `/consultas/api/getConsultaByParams/${consultaId}/${veterinarioId}`
            );

        expect(response.status).toBe(200);
        expect(response.body.ok).toBe(true);
        expect(response.body.consulta.id).toBe(consultaId);
    });

    it("PI-CO18 - Debe rechazar el registro cuando faltan campos obligatorios", async () => {
        const response = await request(app)
            .post("/consultas/api/registerConsulta")
            .set("Cookie", cookie)
            .send({
                motivo_consulta: "Consulta incompleta"
            });

        expect(response.status).toBe(400);
    });

    it("PI-CO19 - Debe responder cuando el veterinario no tiene consultas", async () => {
        const response = await request(app)
            .get("/consultas/api/getConsultas")
            .query({ veterinarioId: 999999 });

        expect(response.status).toBe(200);
        expect(response.body.vacio).toBe(true);
    });

    it("PI-CO20 - Debe responder cuando no existe una consulta para la clínica y veterinario", async () => {
        const response = await request(app)
            .get("/consultas/api/getConsultasByQuery")
            .query({
                veterinarioId: 999999,
                clinicaId: 999999
            });

        expect(response.status).toBe(200);
        expect(response.body.vacio).toBe(true);
    });

    it("PI-CO21 - Debe rechazar la consulta cuando el ID no pertenece al veterinario", async () => {
        const response = await request(app)
            .get(`/consultas/api/getConsultaByParams/${consultaId}/999999`);

        expect(response.status).toBe(400);
        expect(response.body.mensaje).toBeDefined();
    });

});
