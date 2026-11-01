
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

import app from "../app.js";
import db from "../utils/db.js";
import envGetter from "../utils/envGetter.js";

const { SECRET_KEY } = envGetter();

interface ClinicaRow extends RowDataPacket {
    id: number;
}

let propietarioId: number;
let clinicaId: number;

const documentoPrueba = "TESTMASCOTA987654";

const token = jwt.sign(
    { userId: 1, rol: "adminClinica" },
    SECRET_KEY
);

const crearMascotaEnBD = async (nombre: string) => {
    const [resultado] = await db.query<ResultSetHeader>(
        `INSERT INTO mascotas
        (nombre, especie, raza, sexo, fecha_nacimiento, peso, foto_url, propietarioId, clinicaId)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            nombre, "Perro", "Labrador", "Macho",
            "2022-05-10", 20, "foto.jpg", propietarioId, clinicaId
        ]
    );

    return resultado.insertId;
};

beforeAll(async () => {
    // Limpiar cualquier dato anterior de esta prueba.
    await db.query(
        "DELETE FROM clientes WHERE num_documento = ?",
        [documentoPrueba]
    );

    // Obtener una clínica existente.
    const [clinicas] = await db.query<ClinicaRow[]>(
        "SELECT id FROM clinicas LIMIT 1"
    );

    if (clinicas.length === 0) {
        throw new Error("No existe ninguna clínica en vetua_test");
    }

    if (!clinicas[0]) {
        throw new Error("NO SE ENCONRO LA CLINICA");
    }

    clinicaId = clinicas[0].id;

    // Crear propietario de prueba.
    const [resultado] = await db.query<ResultSetHeader>(
        `INSERT INTO clientes
        (nombres, apellidos, fecha_nacimiento, tipo_documento,
        num_documento, sexo, telefono, correo, direccion, ciudad, departamento)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            "Cliente", "Prueba", "1990-01-01", "CC",
            documentoPrueba, "Masculino", "3001234567",
            "prueba@vetua.test", "Direccion de prueba",
            "Bogota", "Cundinamarca"
        ]
    );

    propietarioId = resultado.insertId;
});

afterAll(async () => {
    if (propietarioId) {
        await db.query(
            "DELETE FROM mascotas WHERE propietarioId = ?",
            [propietarioId]
        );

        await db.query(
            "DELETE FROM clientes WHERE id = ?",
            [propietarioId]
        );
    }

    await db.end();
});

describe("Integración de mascotas", () => {

    it("PI-M01 - Debe registrar una mascota correctamente", async () => {
        const response = await request(app)
            .post("/mascotas/api/register")
            .send({
                nombre: "Max",
                especie: "Perro",
                raza: "Labrador",
                sexo: "Macho",
                fecha_nacimiento: "2022-05-10",
                peso: 20,
                foto_url: "foto.jpg",
                propietarioNumDocumento: documentoPrueba,
                propietarioTipoDocumento: "CC",
                clinicaId
            });

        expect(response.status).toBe(200);
        expect(response.body.ok).toBe(true);

        const [mascotas] = await db.query<RowDataPacket[]>(
            "SELECT * FROM mascotas WHERE nombre = ? AND propietarioId = ?",
            ["Max", propietarioId]
        );

        expect(mascotas.length).toBe(1);
    });

    it("PI-M02 - No debe permitir nombres repetidos para un propietario", async () => {
        await crearMascotaEnBD("Luna");

        const response = await request(app)
            .post("/mascotas/api/register")
            .send({
                nombre: "Luna",
                especie: "Gato",
                raza: "Siames",
                sexo: "Hembra",
                fecha_nacimiento: "2023-01-01",
                peso: 4,
                foto_url: "foto.jpg",
                propietarioNumDocumento: documentoPrueba,
                propietarioTipoDocumento: "CC",
                clinicaId
            });

        expect(response.status).toBe(200);
        expect(response.body.mensaje).toBe(
            "El propietario ya cuenta con una mascota con ese nombre"
        );
    });

    it("PI-M03 - Debe obtener las mascotas de un propietario autenticado", async () => {
        const response = await request(app)
            .get("/mascotas/api/getMascota")
            .query({
                clienteNumDocumento: documentoPrueba,
                clienteTipoDocumento: "CC"
            })
            .set("Cookie", `token=${token}`);

        expect(response.status).toBe(200);
        expect(response.body.ok).toBe(true);
        expect(response.body.mascotas.length).toBeGreaterThan(0);
    });

    it("PI-M04 - Debe obtener una mascota por su ID", async () => {
        const id = await crearMascotaEnBD("Rocky");

        const response = await request(app)
            .get(`/mascotas/api/getMascotaByParams/${id}`);

        expect(response.status).toBe(200);
        expect(response.body.ok).toBe(true);
        expect(response.body.mascota.id).toBe(id);
    });


    it("PI-M05 - Debe actualizar la información de una mascota", async () => {
        const id = await crearMascotaEnBD("Toby");

        const response = await request(app)
            .put("/mascotas/api/changeMascotaInformacion")
            .send({
                nombre: "TobyActualizado",
                especie: "Perro",
                raza: "Golden",
                sexo: "Macho",
                peso: 25,
                id
            });

        expect(response.status).toBe(200);
        expect(response.body.ok).toBe(true);

        const [mascotas] = await db.query<RowDataPacket[]>(
            "SELECT * FROM mascotas WHERE id = ?",
            [id]
        );

        const mascotaActualizada = mascotas[0];

        expect(mascotaActualizada).toBeDefined();

        if (!mascotaActualizada) {
            throw new Error("No se encontró la mascota actualizada");
        }

        expect(mascotaActualizada.nombre).toBe("TobyActualizado");
        expect(Number(mascotaActualizada.peso)).toBe(25);
    });


    it("PI-M06 - Debe eliminar una mascota correctamente", async () => {
        const id = await crearMascotaEnBD("RockyEliminar");

        const response = await request(app)
            .delete(`/mascotas/api/deleteMascota/${id}`);

        expect(response.status).toBe(200);
        expect(response.body.ok).toBe(true);

        const [mascotas] = await db.query<RowDataPacket[]>(
            "SELECT * FROM mascotas WHERE id = ?",
            [id]
        );

        expect(mascotas.length).toBe(0);
    });
});
