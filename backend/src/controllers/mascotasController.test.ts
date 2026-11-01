
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { Request, Response } from "express";

import {
    insertMascota,
    selectMascotaByNombreAndPropietario,
    selectMasctaByPropietario,
    selectMascotaById,
    updateMascota,
    deleteMascotaById
} from "../models/mascotasModel.js";

import { selectClienteByDocumento } from "../models/clientesModel.js";

import {
    registerMascota,
    getMascota,
    getMascotaByParams,
    changeMascotaInformacion,
    deleteMascota
} from "./mascotasController.js";

vi.mock("../models/mascotasModel.js", () => ({
    insertMascota: vi.fn(),
    selectMascotaByNombreAndPropietario: vi.fn(),
    selectMasctaByPropietario: vi.fn(),
    selectMascotaById: vi.fn(),
    updateMascota: vi.fn(),
    deleteMascotaById: vi.fn()
}));

vi.mock("../models/clientesModel.js", () => ({
    selectClienteByDocumento: vi.fn()
}));

const crearResponse = () => ({
    json: vi.fn(),
    status: vi.fn().mockReturnThis()
}) as unknown as Response;

const propietario = {
    id: 1,
    nombres: "Juan",
    apellidos: "Perez"
} as any;

const mascota = {
    id: 1,
    nombre: "Max",
    especie: "Perro",
    raza: "Labrador",
    sexo: "Macho",
    peso: 20,
    propietarioId: 1,
    clinicaId: 1
} as any;

const datosMascota = {
    nombre: "Max",
    especie: "Perro",
    raza: "Labrador",
    sexo: "Macho",
    fecha_nacimiento: "2022-05-10",
    peso: 20,
    foto_url: "foto.jpg",
    propietarioNumDocumento: "123456",
    propietarioTipoDocumento: "CC",
    clinicaId: 1
};

beforeEach(() => {
    vi.clearAllMocks();
});

afterEach(() => {
    vi.restoreAllMocks();
});

describe("registerMascota", () => {

    it("PU-M01 - Debe registrar una mascota correctamente", async () => {
        vi.mocked(selectClienteByDocumento).mockResolvedValue(propietario);
        vi.mocked(selectMascotaByNombreAndPropietario).mockResolvedValue(undefined);
        vi.mocked(insertMascota).mockResolvedValue(undefined);

        const req = { body: datosMascota } as unknown as Request;
        const res = crearResponse();

        await registerMascota(req, res);

        expect(insertMascota).toHaveBeenCalledWith(
            "Max", "Perro", "Labrador", "Macho",
            "2022-05-10", 20, "foto.jpg", 1, 1
        );

        expect(res.json).toHaveBeenCalledWith({
            ok: true,
            exito: "Mascota registrada correctamente al propietario seleccionado"
        });
    });

    it("PU-M02 - Debe rechazar el registro si el propietario no existe", async () => {
        vi.mocked(selectClienteByDocumento).mockResolvedValue(undefined);

        const req = { body: datosMascota } as unknown as Request;
        const res = crearResponse();

        await registerMascota(req, res);

        expect(res.json).toHaveBeenCalledWith({
            mensaje: "El propietario con el número de documento seleccionado no existe"
        });

        expect(insertMascota).not.toHaveBeenCalled();
    });

    it("PU-M03 - Debe rechazar una mascota con nombre repetido para el mismo propietario", async () => {
        vi.mocked(selectClienteByDocumento).mockResolvedValue(propietario);
        vi.mocked(selectMascotaByNombreAndPropietario).mockResolvedValue(mascota);

        const req = { body: datosMascota } as unknown as Request;
        const res = crearResponse();

        await registerMascota(req, res);

        expect(res.json).toHaveBeenCalledWith({
            mensaje: "El propietario ya cuenta con una mascota con ese nombre"
        });

        expect(insertMascota).not.toHaveBeenCalled();
    });

    it("PU-M04 - Debe responder con error 500 si falla el registro", async () => {
        vi.mocked(selectClienteByDocumento).mockRejectedValue(new Error("Error DB"));
        vi.spyOn(console, "error").mockImplementation(() => {});

        const req = { body: datosMascota } as unknown as Request;
        const res = crearResponse();

        await registerMascota(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            ok: false,
            error: "Error DB"
        });
    });
});

describe("getMascota", () => {

    it("PU-M05 - Debe exigir el número y tipo de documento", async () => {
        const req = { query: {} } as unknown as Request;
        const res = crearResponse();

        await getMascota(req, res);

        expect(res.json).toHaveBeenCalledWith({
            mensaje: "Se debe especificar el número y tipo de documento del propietario"
        });
    });

    it("PU-M06 - Debe responder si el propietario no existe", async () => {
        vi.mocked(selectClienteByDocumento).mockResolvedValue(undefined);

        const req = {
            query: {
                clienteNumDocumento: "123456",
                clienteTipoDocumento: "CC"
            }
        } as unknown as Request;

        const res = crearResponse();

        await getMascota(req, res);

        expect(res.json).toHaveBeenCalledWith({
            mensaje: "No se encontro el cliente seleccionado"
        });
    });

    it("PU-M07 - Debe responder si el propietario no tiene mascotas", async () => {
        vi.mocked(selectClienteByDocumento).mockResolvedValue(propietario);
        vi.mocked(selectMasctaByPropietario).mockResolvedValue([]);

        const req = {
            query: {
                clienteNumDocumento: "123456",
                clienteTipoDocumento: "CC"
            }
        } as unknown as Request;

        const res = crearResponse();

        await getMascota(req, res);

        expect(res.json).toHaveBeenCalledWith({
            mensaje: "El propietario no tiene mascotas registradas"
        });
    });

    it("PU-M08 - Debe devolver las mascotas del propietario", async () => {
        vi.mocked(selectClienteByDocumento).mockResolvedValue(propietario);
        vi.mocked(selectMasctaByPropietario).mockResolvedValue([mascota]);

        const req = {
            query: {
                clienteNumDocumento: "123456",
                clienteTipoDocumento: "CC"
            }
        } as unknown as Request;

        const res = crearResponse();

        await getMascota(req, res);

        expect(res.json).toHaveBeenCalledWith({
            ok: true,
            mascotas: [mascota]
        });
    });

    it("PU-M09 - Debe responder con error 500 si falla la consulta", async () => {
        vi.mocked(selectClienteByDocumento).mockRejectedValue(new Error("Error DB"));
        vi.spyOn(console, "error").mockImplementation(() => {});

        const req = {
            query: {
                clienteNumDocumento: "123456",
                clienteTipoDocumento: "CC"
            }
        } as unknown as Request;

        const res = crearResponse();

        await getMascota(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            ok: false,
            error: "Error DB"
        });
    });
});

describe("getMascotaByParams", () => {

    it("PU-M10 - Debe devolver una mascota por su ID", async () => {
        vi.mocked(selectMascotaById).mockResolvedValue(mascota);

        const req = { params: { id: "1" } } as unknown as Request;
        const res = crearResponse();

        await getMascotaByParams(req, res);

        expect(selectMascotaById).toHaveBeenCalledWith(1);
        expect(res.json).toHaveBeenCalledWith({
            ok: true,
            mascota
        });
    });

    it("PU-M11 - Debe responder si no encuentra la mascota", async () => {
        vi.mocked(selectMascotaById).mockResolvedValue(undefined);

        const req = { params: { id: "99" } } as unknown as Request;
        const res = crearResponse();

        await getMascotaByParams(req, res);

        expect(res.json).toHaveBeenCalledWith({
            mensaje: "No se encontro la mascota"
        });
    });

    it("PU-M12 - Debe responder con error 500 si falla la consulta", async () => {
        vi.mocked(selectMascotaById).mockRejectedValue(new Error("Error DB"));
        vi.spyOn(console, "error").mockImplementation(() => {});

        const req = { params: { id: "1" } } as unknown as Request;
        const res = crearResponse();

        await getMascotaByParams(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            ok: false,
            error: "Error DB"
        });
    });
});

describe("changeMascotaInformacion", () => {

    it("PU-M13 - Debe actualizar la información de una mascota", async () => {
        vi.mocked(updateMascota).mockResolvedValue(undefined);

        const req = {
            body: {
                nombre: "Max",
                especie: "Perro",
                raza: "Labrador",
                sexo: "Macho",
                peso: 22,
                id: 1
            }
        } as unknown as Request;

        const res = crearResponse();

        await changeMascotaInformacion(req, res);

        expect(updateMascota).toHaveBeenCalledWith(
            "Max", "Perro", "Labrador", "Macho", 22, 1
        );

        expect(res.json).toHaveBeenCalledWith({
            ok: true,
            exito: "Informacion de la mascota actualizada correctamente"
        });
    });

    it("PU-M14 - Debe responder con error 500 si falla la actualización", async () => {
        vi.mocked(updateMascota).mockRejectedValue(new Error("Error DB"));
        vi.spyOn(console, "error").mockImplementation(() => {});

        const req = {
            body: {
                nombre: "Max",
                especie: "Perro",
                raza: "Labrador",
                sexo: "Macho",
                peso: 22,
                id: 1
            }
        } as unknown as Request;

        const res = crearResponse();

        await changeMascotaInformacion(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            ok: false,
            error: "Error DB"
        });
    });
});

describe("deleteMascota", () => {

    it("PU-M15 - Debe eliminar una mascota correctamente", async () => {
        vi.mocked(deleteMascotaById).mockResolvedValue(undefined);

        const req = { params: { id: "1" } } as unknown as Request;
        const res = crearResponse();

        await deleteMascota(req, res);

        expect(deleteMascotaById).toHaveBeenCalledWith(1);
        expect(res.json).toHaveBeenCalledWith({
            ok: true,
            exito: "Mascota borrada correctamente"
        });
    });

    it("PU-M16 - Debe responder con error 500 si falla la eliminación", async () => {
        vi.mocked(deleteMascotaById).mockRejectedValue(new Error("Error DB"));
        vi.spyOn(console, "error").mockImplementation(() => {});

        const req = { params: { id: "1" } } as unknown as Request;
        const res = crearResponse();

        await deleteMascota(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            ok: false,
            error: "Error DB"
        });
    });

    it("PU-M17 - Debe rechazar un ID inválido", async () => {
        const req = { params: { id: "abc" } } as unknown as Request;
        const res = crearResponse();

        await expect(deleteMascota(req, res))
            .rejects.toThrow("ERR_IDMASCOTA_TO_NUM");

        expect(deleteMascotaById).not.toHaveBeenCalled();
    });
});
