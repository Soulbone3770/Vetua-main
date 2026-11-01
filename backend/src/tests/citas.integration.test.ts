
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

const documento = "TESTCITAS987654";
const usernameVeterinario = "veterinario_test_citas";

let clienteId: number;
let mascotaId: number;
let veterinarioId: number;
let clinicaId: number;
let citaId: number;

const cookie = `token=${token}`;

describe("Integración - Citas", () => {

    beforeAll(async () => {
        const [clinicas] = await db.query<RowDataPacket[]>(
            "SELECT id FROM clinicas LIMIT 1"
        );

        if(clinicas[0] === undefined){
            throw new Error("NO CLINICA SELECIONADA")
        }

        expect(clinicas.length).toBeGreaterThan(0);
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
                "citas.test@vetua.test", "Direccion test",
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
                "MascotaTestCitas", "Perro", "Criollo",
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
            await db.query(
                "DELETE FROM citas WHERE propietario_num_documento = ?",
                [documento]
            );

            if (mascotaId) {
                await db.query("DELETE FROM mascotas WHERE id = ?", [mascotaId]);
            }

            if (clienteId) {
                await db.query("DELETE FROM clientes WHERE id = ?", [clienteId]);
            }

            if (veterinarioId) {
                await db.query("DELETE FROM clinica_users WHERE id = ?", [veterinarioId]);
            }
        } finally {
            await db.end();
        }
    });

    it("PI-CT01 - Debe agendar una cita correctamente", async () => {
        const response = await request(app)
            .post("/citas/api/agendarCita")
            .set("Cookie", cookie)
            .send({
                fecha_hora: "2027-05-15 10:00:00",
                clienteTipoDocumento: "CC",
                clienteNumDocumento: documento,
                motivo: "Consulta general",
                estado: "Pendiente",
                notas: "Primera consulta",
                nombreMascota: "MascotaTestCitas",
                nombreVeterinario: usernameVeterinario,
                clinicaId
            });

        expect(response.status).toBe(200);
        expect(response.body.ok).toBe(true);

        const [citas] = await db.query<RowDataPacket[]>(
            "SELECT * FROM citas WHERE propietario_num_documento = ?",
            [documento]
        );

        if(citas[0] === undefined){
            throw new Error("NO CITA SELECIONADA")
        }

        expect(citas.length).toBe(1);
        citaId = citas[0].id;
    });

    it("PI-CT02 - Debe consultar las citas de un cliente", async () => {
        const response = await request(app)
            .get("/citas/api/getCitas")
            .set("Cookie", cookie)
            .query({
                clienteTipoDocumento: "CC",
                clienteNumDocumento: documento
            });

        expect(response.status).toBe(200);
        expect(response.body.ok).toBe(true);
        expect(response.body.hayCitas).toBe(true);
    });

    it("PI-CT03 - Debe consultar todas las citas", async () => {
        const response = await request(app)
            .get("/citas/api/getAllCitas");

        expect(response.status).toBe(200);
        expect(response.body.ok).toBe(true);
        expect(response.body.citas.length).toBeGreaterThan(0);
    });

    it("PI-CT04 - Debe consultar una cita por su ID", async () => {
        const response = await request(app)
            .get(`/citas/api/getCitaByParams/${citaId}`);

        expect(response.status).toBe(200);
        expect(response.body.ok).toBe(true);
        expect(response.body.cita.id).toBe(citaId);
    });

    it("PI-CT05 - Debe cambiar el estado de una cita", async () => {
        const response = await request(app)
            .put("/citas/api/changeEstadoCita")
            .send({
                id: citaId,
                estado: "Completada"
            });

        expect(response.status).toBe(200);
        expect(response.body.ok).toBe(true);

        const [citas] = await db.query<RowDataPacket[]>(
            "SELECT estado FROM citas WHERE id = ?",
            [citaId]
        );

        if(citas[0] === undefined){
            throw new Error("NO CITA SELECIONADA")
        }

        expect(citas[0].estado).toBe("Completada");
    });

    it("PI-CT06 - Debe reprogramar una cita", async () => {
        const nuevaFecha = "2027-06-20 14:30:00";

        const response = await request(app)
            .put("/citas/api/reprogramarCita")
            .send({
                id: citaId,
                fecha_hora: nuevaFecha
            });

        expect(response.status).toBe(200);
        expect(response.body.ok).toBe(true);

        const [citas] = await db.query<RowDataPacket[]>(
            "SELECT fecha_hora FROM citas WHERE id = ?",
            [citaId]
        );

        if(citas[0] === undefined){
            throw new Error("NO CITA SELECIONADA")
        }

        expect(new Date(citas[0].fecha_hora).toISOString())
            .toContain("2027-06-20");
    });

    it("PI-CT07 - Debe rechazar el registro cuando faltan campos obligatorios", async () => {
        const response = await request(app)
            .post("/citas/api/agendarCita")
            .set("Cookie", cookie)
            .send({
                clienteTipoDocumento: "CC",
                clienteNumDocumento: documento
            });

        expect(response.status).toBe(400);
    });

    it("PI-CT08 - Debe consultar las citas de mañana", async () => {
        await db.query(
            `UPDATE citas
             SET fecha_hora = DATE_ADD(CURDATE(), INTERVAL 1 DAY)
             WHERE id = ?`,
            [citaId]
        );

        const response = await request(app)
            .get("/citas/api/getCitasManana");

        expect(response.status).toBe(200);
        expect(response.body.ok).toBe(true);
        expect(response.body.citas.length).toBeGreaterThan(0);
    });

});
