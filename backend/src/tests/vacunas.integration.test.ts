
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

import app from "../app.js";
import db from "../utils/db.js";

let mascotaId: number;
let vacunaId: number;
let propietarioId: number;

const documentoPrueba = "TESTVACUNA987654";
const nombreVacuna = "VacunaTest987654";

const fechaActual = "2026-10-30 12:00:00";

const fechaFutura = "2099-12-30 12:00:00";
const fechaPasada = "2000-01-01 12:00:00";

const crearDatosVacunacion = (proxima_dosis: string) => ({
    fecha_aplicacion: fechaActual,
    proxima_dosis,
    mascota_id: mascotaId,
    vacuna_id: vacunaId
});

beforeAll(async () => {

    // Buscar una clínica existente
    const [clinicas] = await db.query<RowDataPacket[]>(
        "SELECT id FROM clinicas LIMIT 1"
    );

    if (!clinicas[0]) {
        throw new Error("No existe ninguna clínica en vetua_test");
    }

    const clinicaId = clinicas[0].id;

    // Crear propietario
    const [clienteResult] = await db.query<ResultSetHeader>(
        `INSERT INTO clientes
        (nombres, apellidos, fecha_nacimiento, tipo_documento,
        num_documento, sexo, telefono, correo, direccion,
        ciudad, departamento)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            "Cliente",
            "Prueba Vacunas",
            "2000-01-01",
            "CC",
            documentoPrueba,
            "Masculino",
            "3001234567",
            "vacunas@vetua.test",
            "Direccion prueba",
            "Bogota",
            "Cundinamarca"
        ]
    );

    propietarioId = clienteResult.insertId;

    // Crear mascota
    const [mascotaResult] = await db.query<ResultSetHeader>(
        `INSERT INTO mascotas
        (nombre, especie, raza, sexo, fecha_nacimiento,
        peso, foto_url, propietarioId, clinicaId)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            "MascotaTestVacunas",
            "Perro",
            "Criollo",
            "Macho",
            "2020-01-01",
            15,
            "",
            propietarioId,
            clinicaId
        ]
    );

    mascotaId = mascotaResult.insertId;

    // Crear vacuna
    const [vacunaResult] = await db.query<ResultSetHeader>(
        `INSERT INTO vacunas (nombre, dosis, frecuencia, descripcion)
        VALUES (?, ?, ?, ?)`,
        [
            nombreVacuna,
            "1 ml",
            "Anual",
            "Vacuna exclusiva para pruebas"
        ]
    );

    vacunaId = vacunaResult.insertId;
});

afterAll(async () => {

    if (mascotaId) {
        await db.query(
            "DELETE FROM vacunaciones WHERE mascota_id = ?",
            [mascotaId]
        );

        await db.query(
            "DELETE FROM mascotas WHERE id = ?",
            [mascotaId]
        );
    }

    if (propietarioId) {
        await db.query(
            "DELETE FROM clientes WHERE id = ?",
            [propietarioId]
        );
    }

    if (vacunaId) {
        await db.query(
            "DELETE FROM vacunas WHERE id = ?",
            [vacunaId]
        );
    }

    await db.end();
});

describe("Integración del módulo de vacunas", () => {

    it("PI-V01 - Debe obtener el listado de vacunas", async () => {

        const response = await request(app)
            .get("/vacunas/api/getVacunas");

        expect(response.status).toBe(200);
        expect(response.body.ok).toBe(true);
        expect(Array.isArray(response.body.vacunas)).toBe(true);

        expect(
            response.body.vacunas.some(
                (vacuna: { id: number }) => vacuna.id === vacunaId
            )
        ).toBe(true);
    });

    it("PI-V02 - Debe registrar una vacunación correctamente", async () => {

        const response = await request(app)
            .post("/vacunas/api/createVacunacion")
            .send(crearDatosVacunacion(fechaFutura));

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            ok: true,
            exito: "Vacunacion creada correctamente"
        });

        const [registros] = await db.query<RowDataPacket[]>(
            `SELECT * FROM vacunaciones
            WHERE mascota_id = ? AND vacuna_id = ?`,
            [mascotaId, vacunaId]
        );

        expect(registros.length).toBe(1);
    });

    it("PI-V03 - Debe impedir registrar nuevamente una vacuna antes de la próxima dosis", async () => {

        const response = await request(app)
            .post("/vacunas/api/createVacunacion")
            .send(crearDatosVacunacion(fechaFutura));

        expect(response.status).toBe(200);

        expect(response.body).toEqual({
            mensaje: "Esta mascota ya tiene esta vacuna y no ha pasado la fecha para la ultima dosis"
        });

        const [registros] = await db.query<RowDataPacket[]>(
            `SELECT * FROM vacunaciones
            WHERE mascota_id = ? AND vacuna_id = ?`,
            [mascotaId, vacunaId]
        );

        expect(registros.length).toBe(1);
    });

    it("PI-V04 - Debe permitir registrar nuevamente la vacuna cuando ya pasó la próxima dosis", async () => {

        await db.query(
            `UPDATE vacunaciones
            SET proxima_dosis = ?
            WHERE mascota_id = ? AND vacuna_id = ?`,
            [fechaPasada, mascotaId, vacunaId]
        );

        const response = await request(app)
            .post("/vacunas/api/createVacunacion")
            .send(crearDatosVacunacion(fechaFutura));

        expect(response.status).toBe(200);

        expect(response.body).toEqual({
            ok: true,
            exito: "Vacunacion creada correctamente"
        });

        const [registros] = await db.query<RowDataPacket[]>(
            `SELECT * FROM vacunaciones
            WHERE mascota_id = ? AND vacuna_id = ?`,
            [mascotaId, vacunaId]
        );

        expect(registros.length).toBe(2);
    });

    it("PI-V05 - Debe rechazar una solicitud sin campos obligatorios", async () => {

        const response = await request(app)
            .post("/vacunas/api/createVacunacion")
            .send({
                fecha_aplicacion: fechaActual,
                mascota_id: mascotaId
            });

        expect(response.status).toBe(400);
    });

});
