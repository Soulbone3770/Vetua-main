
import { describe, it, expect, beforeEach, vi } from "vitest";
import type { Request, Response } from "express";

vi.mock("../models/consultasModel.js", () => ({
    insertConsulta: vi.fn(),
    selectConsultaByVeterinarios: vi.fn(),
    selectConsultasByVetId: vi.fn(),
    selectConsultaByIdAndVetId: vi.fn()
}));

vi.mock("../models/clientesModel.js", () => ({
    selectClienteByDocumento: vi.fn()
}));

vi.mock("../models/mascotasModel.js", () => ({
    selectIdMascotaByNombreAndPropietario: vi.fn()
}));

import {
    insertConsulta,
    selectConsultaByVeterinarios,
    selectConsultasByVetId,
    selectConsultaByIdAndVetId
} from "../models/consultasModel.js";

import { selectClienteByDocumento } from "../models/clientesModel.js";

import { selectIdMascotaByNombreAndPropietario } from "../models/mascotasModel.js";

import {
    registerConsulta,
    getConsultas,
    getConsultaByQuery,
    getConsultaByIdParams
} from "./consultasController.js";

const datosConsulta = {
    fecha_hora: "2026-10-31 10:00:00",
    motivo_consulta: "Revision general",
    peso_en_consulta: 12.5,
    temperatura: 38.5,
    frecuencia_cardiaca: 100,
    sintomas: "Ninguno",
    diagnostico: "Buen estado de salud",
    tratamiento_indicado: "Ninguno",
    observaciones: "Control rutinario",
    costo: 50000,
    nombre_mascota: "Firulais",
    cliente_tipo_documento: "CC",
    cliente_num_documento: "123456789",
    id_veterinario: 5,
    id_clinica: 2
};

const crearRequest = (datos: {
    body?: object;
    query?: object;
    params?: object;
} = {}) => ({
    body: datos.body ?? {},
    query: datos.query ?? {},
    params: datos.params ?? {}
} as unknown as Request);

const crearResponse = () => ({
    json: vi.fn(),
    status: vi.fn().mockReturnThis()
});

beforeEach(() => {
    vi.clearAllMocks();
});

// ==========================================
// REGISTER CONSULTA
// ==========================================

describe("registerConsulta", () => {

    it("PU-CO01 - Debe registrar una consulta correctamente", async () => {

        vi.mocked(selectClienteByDocumento).mockResolvedValue({
            id: 10
        } as any);

        vi.mocked(selectIdMascotaByNombreAndPropietario).mockResolvedValue({
            id: 20
        } as any);

        vi.mocked(insertConsulta).mockResolvedValue(undefined);

        const req = crearRequest({
            body: datosConsulta
        });

        const res = crearResponse();

        await registerConsulta(req, res as unknown as Response);

        expect(selectClienteByDocumento).toHaveBeenCalledWith(
            datosConsulta.cliente_num_documento,
            datosConsulta.cliente_tipo_documento
        );

        expect(selectIdMascotaByNombreAndPropietario).toHaveBeenCalledWith(
            datosConsulta.nombre_mascota,
            10
        );

        expect(insertConsulta).toHaveBeenCalledWith(
            datosConsulta.fecha_hora,
            datosConsulta.motivo_consulta,
            datosConsulta.peso_en_consulta,
            datosConsulta.temperatura,
            datosConsulta.frecuencia_cardiaca,
            datosConsulta.sintomas,
            datosConsulta.diagnostico,
            datosConsulta.tratamiento_indicado,
            datosConsulta.observaciones,
            datosConsulta.costo,
            20,
            datosConsulta.id_veterinario,
            10,
            datosConsulta.id_clinica
        );

        expect(res.json).toHaveBeenCalledWith({
            ok: true,
            exito: "Registro medico exitoso"
        });
    });

    it("PU-CO02 - No debe registrar una consulta si el cliente no existe", async () => {

        vi.mocked(selectClienteByDocumento).mockResolvedValue(undefined);

        const req = crearRequest({
            body: datosConsulta
        });

        const res = crearResponse();

        await registerConsulta(req, res as unknown as Response);

        expect(res.json).toHaveBeenCalledWith({
            ok: false,
            error: "Error, el cliente seleccionado no existe"
        });

        expect(selectIdMascotaByNombreAndPropietario).not.toHaveBeenCalled();
        expect(insertConsulta).not.toHaveBeenCalled();
    });

    it("PU-CO03 - No debe registrar una consulta si la mascota no existe", async () => {

        vi.mocked(selectClienteByDocumento).mockResolvedValue({
            id: 10
        } as any);

        vi.mocked(selectIdMascotaByNombreAndPropietario).mockResolvedValue(undefined);

        const req = crearRequest({
            body: datosConsulta
        });

        const res = crearResponse();

        await registerConsulta(req, res as unknown as Response);

        expect(res.json).toHaveBeenCalledWith({
            ok: false,
            error: "Error, la mascota seleccionada no existe"
        });

        expect(insertConsulta).not.toHaveBeenCalled();
    });

    it("PU-CO04 - Debe manejar errores durante el registro de una consulta", async () => {

        vi.mocked(selectClienteByDocumento).mockRejectedValue(
            new Error("Error de base de datos")
        );

        const req = crearRequest({
            body: datosConsulta
        });

        const res = crearResponse();

        await registerConsulta(req, res as unknown as Response);

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({
            ok: false,
            error: "Error de base de datos"
        });
    });

});

// ==========================================
// GET CONSULTAS
// ==========================================

describe("getConsultas", () => {

    it("PU-CO05 - Debe obtener las consultas de un veterinario", async () => {

        const consultas = [
            { id: 1, diagnostico: "Diagnostico 1" },
            { id: 2, diagnostico: "Diagnostico 2" }
        ];

        vi.mocked(selectConsultasByVetId).mockResolvedValue(consultas as any);

        const req = crearRequest({
            query: {
                veterinarioId: "5"
            }
        });

        const res = crearResponse();

        await getConsultas(req, res as unknown as Response);

        expect(selectConsultasByVetId).toHaveBeenCalledWith(5);

        expect(res.json).toHaveBeenCalledWith({
            ok: true,
            consultas
        });
    });

    it("PU-CO06 - Debe informar cuando no existen consultas", async () => {

        vi.mocked(selectConsultasByVetId).mockResolvedValue([]);

        const req = crearRequest({
            query: {
                veterinarioId: "5"
            }
        });

        const res = crearResponse();

        await getConsultas(req, res as unknown as Response);

        expect(res.json).toHaveBeenCalledWith({
            vacio: true,
            mensaje: "No hay consultas registradas"
        });
    });

    it("PU-CO07 - Debe manejar errores al obtener las consultas", async () => {

        vi.mocked(selectConsultasByVetId).mockRejectedValue(
            new Error("Error de consulta")
        );

        const req = crearRequest({
            query: {
                veterinarioId: "5"
            }
        });

        const res = crearResponse();

        await getConsultas(req, res as unknown as Response);

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({
            ok: false,
            error: "Error de consulta"
        });
    });

});

// ==========================================
// GET CONSULTA BY QUERY
// ==========================================

describe("getConsultaByQuery", () => {

    it("PU-CO08 - Debe obtener una consulta por veterinario y clínica", async () => {

        const consulta = {
            id: 1,
            diagnostico: "Buen estado de salud"
        };

        vi.mocked(selectConsultaByVeterinarios).mockResolvedValue(consulta as any);

        const req = crearRequest({
            query: {
                veterinarioId: "5",
                clinicaId: "2"
            }
        });

        const res = crearResponse();

        await getConsultaByQuery(req, res as unknown as Response);

        expect(selectConsultaByVeterinarios).toHaveBeenCalledWith(5, 2);

        expect(res.json).toHaveBeenCalledWith({
            ok: true,
            consulta
        });
    });

    it("PU-CO09 - Debe informar cuando no existe la consulta solicitada", async () => {

        vi.mocked(selectConsultaByVeterinarios).mockResolvedValue(undefined);

        const req = crearRequest({
            query: {
                veterinarioId: "5",
                clinicaId: "2"
            }
        });

        const res = crearResponse();

        await getConsultaByQuery(req, res as unknown as Response);

        expect(res.json).toHaveBeenCalledWith({
            vacio: true,
            mensaje: "No existe la consulta solicitada"
        });
    });

    it("PU-CO10 - Debe manejar errores al buscar una consulta por veterinario y clínica", async () => {

        vi.mocked(selectConsultaByVeterinarios).mockRejectedValue(
            new Error("Error de búsqueda")
        );

        const req = crearRequest({
            query: {
                veterinarioId: "5",
                clinicaId: "2"
            }
        });

        const res = crearResponse();

        await getConsultaByQuery(req, res as unknown as Response);

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({
            ok: false,
            error: "Error de búsqueda"
        });
    });

});

// ==========================================
// GET CONSULTA BY ID AND VET ID
// ==========================================

describe("getConsultaByIdParams", () => {

    it("PU-CO11 - Debe obtener una consulta por su ID y veterinario", async () => {

        const consulta = {
            id: 1,
            diagnostico: "Buen estado de salud"
        };

        vi.mocked(selectConsultaByIdAndVetId).mockResolvedValue(consulta as any);

        const req = crearRequest({
            params: {
                consultaId: "1",
                veterinarioId: "5"
            }
        });

        const res = crearResponse();

        await getConsultaByIdParams(req, res as unknown as Response);

        expect(selectConsultaByIdAndVetId).toHaveBeenCalledWith(1, 5);

        expect(res.json).toHaveBeenCalledWith({
            ok: true,
            consulta
        });
    });

    it("PU-CO12 - Debe rechazar la búsqueda si la consulta no existe", async () => {

        vi.mocked(selectConsultaByIdAndVetId).mockResolvedValue(undefined);

        const req = crearRequest({
            params: {
                consultaId: "1",
                veterinarioId: "5"
            }
        });

        const res = crearResponse();

        await getConsultaByIdParams(req, res as unknown as Response);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            mensaje: "No se encontro la consulta seleccionada"
        });
    });

    it("PU-CO13 - Debe manejar errores al buscar una consulta por ID", async () => {

        vi.mocked(selectConsultaByIdAndVetId).mockRejectedValue(
            new Error("Error de base de datos")
        );

        const req = crearRequest({
            params: {
                consultaId: "1",
                veterinarioId: "5"
            }
        });

        const res = crearResponse();

        await getConsultaByIdParams(req, res as unknown as Response);

        expect(res.json).toHaveBeenCalledWith({
            ok: false,
            error: "Error de base de datos"
        });
    });

});
