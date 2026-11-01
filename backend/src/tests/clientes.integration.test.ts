import { describe, it, expect, afterAll } from "vitest";
import request from "supertest";
import app from "../app.js";
import db from "../utils/db.js";

describe("Integración - Módulo clientes", () => {

    const documentoPrueba = "TEST987654321";

    it("PI-01: Registrar un cliente correctamente", async () => {

        const response = await request(app)
            .post("/clientes/api/register")
            .send({
                nombres: "Carlos",
                apellidos: "Prueba",
                fecha_nacimiento: "2000-05-15",
                tipo_documento: "CC",
                num_documento: documentoPrueba,
                sexo: "Masculino",
                telefono: "3001234567",
                correo: "carlosprueba@test.com",
                direccion: "Calle de prueba",
                ciudad: "Bogotá",
                departamento: "Cundinamarca"
            });

        expect(response.status).toBe(200);
        expect(response.body.ok).toBe(true);
        expect(response.body.exito).toBe(
            "Usuario registrado exitosamente"
        );

        const [rows] = await db.query(
            "SELECT * FROM clientes WHERE num_documento = ?",
            [documentoPrueba]
        );

        expect(rows).toHaveLength(1);
    });

    afterAll(async () => {
        await db.query(
            "DELETE FROM clientes WHERE num_documento IN (?, ?, ?)",
            [
                "TEST987654321",
                "TEST987654323",
                "TEST987654324"
            ]
        );

        await db.end();
    });

    it("PI-02: Rechazar el registro de un documento duplicado", async () => {

        const cliente = {
            nombres: "Carlos",
            apellidos: "Prueba",
            fecha_nacimiento: "2000-05-15",
            tipo_documento: "CC",
            num_documento: "TEST987654323",
            sexo: "Masculino",
            telefono: "3001234567",
            correo: "carlosprueba@test.com",
            direccion: "Calle de prueba",
            ciudad: "Bogotá",
            departamento: "Cundinamarca"
        };

        // Limpiar posibles registros anteriores
        await db.query(
            "DELETE FROM clientes WHERE num_documento = ?",
            [cliente.num_documento]
        );

        // Primer registro
        const primerRegistro = await request(app)
            .post("/clientes/api/register")
            .send(cliente);

        expect(primerRegistro.body.ok).toBe(true);

        // Segundo registro
        const segundoRegistro = await request(app)
            .post("/clientes/api/register")
            .send(cliente);

        expect(segundoRegistro.body.mensaje).toBe(
            "El numero de documento ya se encuentra registrado en el sistema"
        );

        // Verificar que solo existe uno
        const [rows]: any = await db.query(
            "SELECT * FROM clientes WHERE num_documento = ?",
            [cliente.num_documento]
        );

        expect(rows).toHaveLength(1);
    });

    it("PI-03: Rechazar el registro cuando falta un campo obligatorio", async () => {

        const response = await request(app)
            .post("/clientes/api/register")
            .send({
                nombres: "Carlos",
                // Falta apellidos
                fecha_nacimiento: "2000-05-15",
                tipo_documento: "CC",
                num_documento: "TEST987654322",
                sexo: "Masculino",
                telefono: "3001234567",
                correo: "carlosprueba@test.com",
                direccion: "Calle de prueba",
                ciudad: "Bogotá",
                departamento: "Cundinamarca"
            });

        expect(response.status).toBe(400);

        expect(response.body).toEqual({
            mensaje: "Todos los campos son necesarioss"
        });

    });

    it("PI-04: Eliminar un cliente existente", async () => {

        const documento = "TEST987654324";

        // Crear el cliente que vamos a eliminar
        await request(app)
            .post("/clientes/api/register")
            .send({
                nombres: "Pedro",
                apellidos: "Prueba",
                fecha_nacimiento: "2000-05-15",
                tipo_documento: "CC",
                num_documento: documento,
                sexo: "Masculino",
                telefono: "3001234567",
                correo: "pedroprueba@test.com",
                direccion: "Calle de prueba",
                ciudad: "Bogotá",
                departamento: "Cundinamarca"
            });

        // Buscar el ID del cliente
        const [clientes]: any = await db.query(
            "SELECT id FROM clientes WHERE num_documento = ?",
            [documento]
        );

        expect(clientes).toHaveLength(1);

        const id = clientes[0].id;

        // Eliminar el cliente
        const response = await request(app)
            .delete(`/clientes/api/deleteCliente/${id}`);

        expect(response.status).toBe(200);
        expect(response.body.ok).toBe(true);

        // Verificar que ya no existe
        const [resultado]: any = await db.query(
            "SELECT * FROM clientes WHERE id = ?",
            [id]
        );

        expect(resultado).toHaveLength(0);
    });

});
