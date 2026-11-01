
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response } from "express";

// Simulamos las funciones del modelo.
vi.mock("../models/clientesModel.js", () => ({
    selectClienteByDocumento: vi.fn(),
    insertCliente: vi.fn(),
    selectClienteById: vi.fn(),
    updateClienteById: vi.fn(),
    deleteClienteById: vi.fn()
}));

import {
    selectClienteByDocumento,
    insertCliente,
    selectClienteById,
    updateClienteById,
    deleteClienteById
} from "../models/clientesModel.js";

import {getClienteByParams, registerClientes, updateClienteInformacion, deleteCliente} from "./clientesController.js";

describe("Controlador registerClientes", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    const crearRequest = () => ({
        body: {
            nombres: "Carlos",
            apellidos: "Perez",
            fecha_nacimiento: "2000-05-15",
            tipo_documento: "CC",
            num_documento: "123456789",
            sexo: "M",
            telefono: "3001234567",
            correo: "carlos@gmail.com",
            direccion: "Calle 10",
            ciudad: "Bogota",
            departamento: "Cundinamarca"
        }
    } as Request);

    const crearResponse = () => ({
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
    } as unknown as Response);

    it("PU-04: registra un cliente que no existe", async () => {
        const req = crearRequest();
        const res = crearResponse();

        vi.mocked(selectClienteByDocumento)
            .mockResolvedValue(undefined as never);

        vi.mocked(insertCliente)
            .mockResolvedValue(undefined as never);

        await registerClientes(req, res);

        expect(selectClienteByDocumento).toHaveBeenCalled();
        expect(insertCliente).toHaveBeenCalled();

        expect(res.json).toHaveBeenCalledWith({
            ok: true,
            exito: "Usuario registrado exitosamente"
        });
    });

    it("PU-05: rechaza un cliente que ya existe", async () => {
        const req = crearRequest();
        const res = crearResponse();

        vi.mocked(selectClienteByDocumento)
            .mockResolvedValue({ id: 1 } as never);

        await registerClientes(req, res);

        expect(selectClienteByDocumento).toHaveBeenCalled();
        expect(insertCliente).not.toHaveBeenCalled();

        expect(res.json).toHaveBeenCalled();
    });

    it("PU-06: responde con error 500 si falla la consulta", async () => {
        const req = crearRequest();
        const res = crearResponse();

        vi.mocked(selectClienteByDocumento)
            .mockRejectedValue(new Error("Error de base de datos"));

        await registerClientes(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                ok: false
            })
        );
    });


    it("PU-07: devuelve un cliente cuando existe", async () => {
        const req = {
            params: { clienteId: "1" }
        } as unknown as Request;

        const res = crearResponse();

        const cliente = {
            id: 1,
            nombres: "Carlos",
            apellidos: "Perez"
        };

        vi.mocked(selectClienteById)
            .mockResolvedValue(cliente as never);

        await getClienteByParams(req, res);

        expect(selectClienteById).toHaveBeenCalledWith(1);

        expect(res.json).toHaveBeenCalledWith({
            ok: true,
            cliente
        });
    });

    it("PU-08: devuelve estado 400 cuando el cliente no existe", async () => {
        const req = {
            params: { clienteId: "999" }
        } as unknown as Request;

        const res = crearResponse();

        vi.mocked(selectClienteById)
            .mockResolvedValue(undefined as never);

        await getClienteByParams(req, res);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            mensaje: "Error, el cliente no existe"
        });
    });

    it("PU-09: maneja errores al consultar un cliente", async () => {
        const req = {
            params: { clienteId: "1" }
        } as unknown as Request;

        const res = crearResponse();

        vi.mocked(selectClienteById)
            .mockRejectedValue(new Error("Error de base de datos"));

        await getClienteByParams(req, res);

        expect(res.json).toHaveBeenCalledWith({
            ok: false,
            error: "Error de base de datos"
        });
    });


    it("PU-10: actualiza correctamente la información de un cliente", async () => {
        const req = {
            body: {
                id: 1,
                nombres: "Carlos",
                apellidos: "Perez",
                telefono: "3001234567",
                correo: "carlos@gmail.com",
                direccion: "Calle 10",
                ciudad: "Bogota",
                departamento: "Cundinamarca"
            }
        } as Request;

        const res = crearResponse();

        vi.mocked(updateClienteById)
            .mockResolvedValue(undefined as never);

        await updateClienteInformacion(req, res);

        expect(updateClienteById).toHaveBeenCalledWith(
            1,
            "Carlos",
            "Perez",
            "3001234567",
            "carlos@gmail.com",
            "Calle 10",
            "Bogota",
            "Cundinamarca"
        );

        expect(res.json).toHaveBeenCalledWith({
            ok: true,
            exito: "Usuario actualizado correctamente"
        });
    });

    it("PU-11: maneja errores durante la actualización", async () => {
        const req = {
            body: {
                id: 1,
                nombres: "Carlos",
                apellidos: "Perez",
                telefono: "3001234567",
                correo: "carlos@gmail.com",
                direccion: "Calle 10",
                ciudad: "Bogota",
                departamento: "Cundinamarca"
            }
        } as Request;

        const res = crearResponse();

        vi.mocked(updateClienteById)
            .mockRejectedValue(new Error("Error de base de datos"));

        await updateClienteInformacion(req, res);

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({
            ok: false,
            error: "Error de base de datos"
        });
    });


    it("PU-12: elimina correctamente un cliente", async () => {
        const req = {
            params: { id: "1" }
        } as unknown as Request;

        const res = crearResponse();

        vi.mocked(deleteClienteById)
            .mockResolvedValue(undefined as never);

        await deleteCliente(req, res);

        expect(deleteClienteById).toHaveBeenCalledWith(1);

        expect(res.json).toHaveBeenCalledWith({
            ok: true,
            exito: "Cliente borrado correctamente"
        });
    });

    it("PU-13: maneja errores durante la eliminación", async () => {
        const req = {
            params: { id: "1" }
        } as unknown as Request;

        const res = crearResponse();

        vi.mocked(deleteClienteById)
            .mockRejectedValue(new Error("Error de base de datos"));

        await deleteCliente(req, res);

        expect(deleteClienteById).toHaveBeenCalledWith(1);

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({
            ok: false,
            error: "Error de base de datos"
        });
    });


});
