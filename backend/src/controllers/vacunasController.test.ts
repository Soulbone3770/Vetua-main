
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response } from "express";

import {
    insertVacunacion,
    selectVacunas,
    selectVacunacion
} from "../models/vacunasModel.js";

import {
    createVacunacion,
    getVacunas
} from "./vacunasController.js";

vi.mock("../models/vacunasModel.js", () => ({
    insertVacunacion: vi.fn(),
    selectVacunas: vi.fn(),
    selectVacunacion: vi.fn()
}));

const crearResponse = () => ({
    json: vi.fn(),
    status: vi.fn().mockReturnThis()
}) as unknown as Response;

const datosVacunacion = {
    fecha_aplicacion: "2026-10-30",
    proxima_dosis: "2027-10-30",
    mascota_id: 1,
    vacuna_id: 1
};

const vacunacionExistente = {
    id: 1,
    fecha_aplicacion: "2026-01-01",
    proxima_dosis: "2027-10-30",
    mascota_id: 1,
    vacuna_id: 1
} as any;

const vacunas = [
    {
        id: 1,
        nombre: "Rabia",
        dosis: "1 ml",
        frecuencia: "Anual"
    },
    {
        id: 2,
        nombre: "Parvovirus",
        dosis: "1 ml",
        frecuencia: "Anual"
    }
] as any;

beforeEach(() => {
    vi.clearAllMocks();
});

describe("createVacunacion", () => {

    it("PU-V01 - Debe registrar una vacunación correctamente", async () => {
        vi.mocked(selectVacunacion).mockResolvedValue(undefined);
        vi.mocked(insertVacunacion).mockResolvedValue(undefined);

        const req = {
            body: datosVacunacion
        } as unknown as Request;

        const res = crearResponse();

        await createVacunacion(req, res);

        expect(selectVacunacion).toHaveBeenCalledWith(1, 1);

        expect(insertVacunacion).toHaveBeenCalledWith(
            "2026-10-30",
            "2027-10-30",
            1,
            1
        );

        expect(res.json).toHaveBeenCalledWith({
            ok: true,
            exito: "Vacunacion creada correctamente"
        });
    });

    it("PU-V02 - Debe impedir registrar una vacuna cuya próxima dosis aún no ha llegado", async () => {
        vi.mocked(selectVacunacion).mockResolvedValue(vacunacionExistente);

        const req = {
            body: datosVacunacion
        } as unknown as Request;

        const res = crearResponse();

        await createVacunacion(req, res);

        expect(insertVacunacion).not.toHaveBeenCalled();

        expect(res.json).toHaveBeenCalledWith({
            mensaje: "Esta mascota ya tiene esta vacuna y no ha pasado la fecha para la ultima dosis"
        });
    });

    it("PU-V03 - Debe permitir registrar la vacuna cuando ya llegó la fecha de la próxima dosis", async () => {
        vi.mocked(selectVacunacion).mockResolvedValue({
            ...vacunacionExistente,
            proxima_dosis: "2020-01-01"
        });

        vi.mocked(insertVacunacion).mockResolvedValue(undefined);

        const req = {
            body: datosVacunacion
        } as unknown as Request;

        const res = crearResponse();

        await createVacunacion(req, res);

        expect(insertVacunacion).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            ok: true,
            exito: "Vacunacion creada correctamente"
        });
    });

    it("PU-V04 - Debe responder con error 500 si falla la consulta", async () => {
        vi.mocked(selectVacunacion).mockRejectedValue(
            new Error("Error DB")
        );

        vi.spyOn(console, "error").mockImplementation(() => {});

        const req = {
            body: datosVacunacion
        } as unknown as Request;

        const res = crearResponse();

        await createVacunacion(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            ok: false,
            error: "Error DB"
        });
    });
});

describe("getVacunas", () => {

    it("PU-V05 - Debe devolver el listado de vacunas", async () => {
        vi.mocked(selectVacunas).mockResolvedValue(vacunas);

        const req = {} as Request;
        const res = crearResponse();

        await getVacunas(req, res);

        expect(res.json).toHaveBeenCalledWith({
            ok: true,
            vacunas
        });
    });

    it("PU-V06 - Debe informar cuando no existen vacunas", async () => {
        vi.mocked(selectVacunas).mockResolvedValue([]);

        const req = {} as Request;
        const res = crearResponse();

        await getVacunas(req, res);

        expect(res.json).toHaveBeenCalledWith({
            mensaje: "No hay vacunas"
        });
    });

    it("PU-V07 - Debe responder con error 500 si falla la consulta", async () => {
        vi.mocked(selectVacunas).mockRejectedValue(
            new Error("Error DB")
        );

        vi.spyOn(console, "error").mockImplementation(() => {});

        const req = {} as Request;
        const res = crearResponse();

        await getVacunas(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            ok: false,
            error: "Error DB"
        });
    });
});
