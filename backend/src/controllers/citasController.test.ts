
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response } from "express";

import {
    selectIdClienteByDocumento
} from "../models/clientesModel.js";

import {
    selectIdMascotaByNombreAndPropietario
} from "../models/mascotasModel.js";

import {
    selectIdVeterinarioByNombreAndClinicaId
} from "../models/usersModel.js";

import {
    selectCitasCliente,
    selectAllCitasManana,
    selectAllCitas,
    selectCitaById,
    updateEstadoCita,
    updateFechaCita,
    insertCita
} from "../models/citasModel.js";

import {
    agendarCita,
    getCitas,
    getCitasManana,
    getAllCitas,
    getCitaByParamsId,
    changeEstadoCita,
    reprogramarCita
} from "./citasController.js";

vi.mock("../models/clientesModel.js", () => ({
    selectIdClienteByDocumento: vi.fn()
}));

vi.mock("../models/mascotasModel.js", () => ({
    selectIdMascotaByNombreAndPropietario: vi.fn()
}));

vi.mock("../models/usersModel.js", () => ({
    selectIdVeterinarioByNombreAndClinicaId: vi.fn()
}));

vi.mock("../models/citasModel.js", () => ({
    selectCitasCliente: vi.fn(),
    selectAllCitasManana: vi.fn(),
    selectAllCitas: vi.fn(),
    selectCitaById: vi.fn(),
    updateEstadoCita: vi.fn(),
    updateFechaCita: vi.fn(),
    insertCita: vi.fn()
}));

const crearResponse = () => ({
    json: vi.fn(),
    send: vi.fn(),
    status: vi.fn().mockReturnThis()
}) as unknown as Response;

const datosCita = {
    fecha_hora: "2026-11-15 10:00:00",
    clienteTipoDocumento: "CC",
    clienteNumDocumento: "123456789",
    motivo: "Vacunación",
    estado: "Pendiente",
    notas: "Primera consulta",
    nombreMascota: "Toby",
    nombreVeterinario: "Carlos",
    clinicaId: 1
};

const propietario = {
    id: 1
} as any;

const mascota = {
    id: 2
} as any;

const veterinario = {
    id: 3
} as any;

const cita = {
    id: 1,
    fecha_hora: "2026-11-15 10:00:00",
    motivo: "Vacunación",
    estado: "Pendiente",
    notas: "Primera consulta",
    mascotaId: 2,
    clinicaId: 1,
    veterinarioId: 3
} as any;

beforeEach(() => {
    vi.clearAllMocks();
});

describe("agendarCita", () => {

    it("PU-CT01 - Debe agendar una cita correctamente", async () => {
        vi.mocked(selectIdClienteByDocumento).mockResolvedValue(propietario);
        vi.mocked(selectIdMascotaByNombreAndPropietario).mockResolvedValue(mascota);
        vi.mocked(selectIdVeterinarioByNombreAndClinicaId).mockResolvedValue(veterinario);
        vi.mocked(insertCita).mockResolvedValue(undefined);

        const req = { body: datosCita } as unknown as Request;
        const res = crearResponse();

        await agendarCita(req, res);

        expect(insertCita).toHaveBeenCalledWith(
            datosCita.fecha_hora,
            "CC",
            "123456789",
            "Vacunación",
            "Pendiente",
            "Primera consulta",
            2,
            1,
            3
        );

        expect(res.json).toHaveBeenCalledWith({
            ok: true,
            exito: "Se ha programado la cita correctamente!"
        });
    });

    it("PU-CT02 - Debe rechazar la cita si no encuentra al propietario", async () => {
        vi.mocked(selectIdClienteByDocumento).mockResolvedValue(undefined);

        const req = { body: datosCita } as unknown as Request;
        const res = crearResponse();

        await agendarCita(req, res);

        expect(insertCita).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            mensaje: "No se encontro el propietario por su número de documento"
        });
    });

    it("PU-CT03 - Debe rechazar la cita si no encuentra la mascota", async () => {
        vi.mocked(selectIdClienteByDocumento).mockResolvedValue(propietario);
        vi.mocked(selectIdMascotaByNombreAndPropietario).mockResolvedValue(undefined);

        const req = { body: datosCita } as unknown as Request;
        const res = crearResponse();

        await agendarCita(req, res);

        expect(insertCita).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            mensaje: "No se encontro la mascota"
        });
    });

    it("PU-CT04 - Debe rechazar la cita si no encuentra al veterinario", async () => {
        vi.mocked(selectIdClienteByDocumento).mockResolvedValue(propietario);
        vi.mocked(selectIdMascotaByNombreAndPropietario).mockResolvedValue(mascota);
        vi.mocked(selectIdVeterinarioByNombreAndClinicaId).mockResolvedValue(undefined);

        const req = { body: datosCita } as unknown as Request;
        const res = crearResponse();

        await agendarCita(req, res);

        expect(insertCita).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            mensaje: "No se encontro el veterinario"
        });
    });

    it("PU-CT05 - Debe responder con error 500 si falla el registro", async () => {
        vi.mocked(selectIdClienteByDocumento).mockResolvedValue(propietario);
        vi.mocked(selectIdMascotaByNombreAndPropietario).mockResolvedValue(mascota);
        vi.mocked(selectIdVeterinarioByNombreAndClinicaId).mockResolvedValue(veterinario);
        vi.mocked(insertCita).mockRejectedValue(new Error("Error DB"));

        vi.spyOn(console, "error").mockImplementation(() => {});

        const req = { body: datosCita } as unknown as Request;
        const res = crearResponse();

        await agendarCita(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            ok: false,
            error: "Error DB"
        });
    });
});

describe("getCitas", () => {

    it("PU-CT06 - Debe exigir los documentos del cliente", async () => {
        const req = { query: {} } as unknown as Request;
        const res = crearResponse();

        await getCitas(req, res);

        expect(res.json).toHaveBeenCalledWith({
            mensaje: "Se debe especificar el tipo y numero de documento del cliente"
        });
    });

    it("PU-CT07 - Debe informar cuando el cliente ya tiene citas", async () => {
        vi.mocked(selectCitasCliente).mockResolvedValue([cita]);

        const req = {
            query: {
                clienteTipoDocumento: "CC",
                clienteNumDocumento: "123456789"
            }
        } as unknown as Request;

        const res = crearResponse();

        await getCitas(req, res);

        expect(res.json).toHaveBeenCalledWith({
            ok: true,
            hayCitas: true,
            notificacion: "Atención, el cliente ya tiene 1 cita/s agendadas, presione continuar si desea agendar otra, cancelar si no"
        });
    });

    it("PU-CT08 - Debe informar cuando el cliente no tiene citas", async () => {
        vi.mocked(selectCitasCliente).mockResolvedValue([]);

        const req = {
            query: {
                clienteTipoDocumento: "CC",
                clienteNumDocumento: "123456789"
            }
        } as unknown as Request;

        const res = crearResponse();

        await getCitas(req, res);

        expect(res.json).toHaveBeenCalledWith({
            ok: true,
            hayCitas: false
        });
    });

    it("PU-CT09 - Debe manejar errores al consultar citas del cliente", async () => {
        vi.mocked(selectCitasCliente).mockRejectedValue(new Error("Error DB"));
        vi.spyOn(console, "error").mockImplementation(() => {});

        const req = {
            query: {
                clienteTipoDocumento: "CC",
                clienteNumDocumento: "123456789"
            }
        } as unknown as Request;

        const res = crearResponse();

        await getCitas(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            ok: false,
            error: "Error DB"
        });
    });
});

describe("getCitasManana", () => {

    it("PU-CT10 - Debe devolver las citas de mañana", async () => {
        vi.mocked(selectAllCitasManana).mockResolvedValue([cita]);

        const req = {} as Request;
        const res = crearResponse();

        await getCitasManana(req, res);

        expect(res.json).toHaveBeenCalledWith({
            ok: true,
            citas: [cita]
        });
    });

    it("PU-CT11 - Debe informar cuando no hay citas para mañana", async () => {
        vi.mocked(selectAllCitasManana).mockResolvedValue([]);

        const req = {} as Request;
        const res = crearResponse();

        await getCitasManana(req, res);

        expect(res.json).toHaveBeenCalledWith({
            mensaje: "No hay citas programadas para mañana"
        });
    });

    it("PU-CT12 - Debe manejar errores al consultar las citas de mañana", async () => {
        vi.mocked(selectAllCitasManana).mockRejectedValue(new Error("Error DB"));
        vi.spyOn(console, "error").mockImplementation(() => {});

        const req = {} as Request;
        const res = crearResponse();

        await getCitasManana(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            ok: false,
            error: "Error DB"
        });
    });
});

describe("getAllCitas", () => {

    it("PU-CT13 - Debe devolver todas las citas", async () => {
        vi.mocked(selectAllCitas).mockResolvedValue([cita]);

        const req = {} as Request;
        const res = crearResponse();

        await getAllCitas(req, res);

        expect(res.json).toHaveBeenCalledWith({
            ok: true,
            citas: [cita]
        });
    });

    it("PU-CT14 - Debe informar cuando no existen citas", async () => {
        vi.mocked(selectAllCitas).mockResolvedValue([]);

        const req = {} as Request;
        const res = crearResponse();

        await getAllCitas(req, res);

        expect(res.json).toHaveBeenCalledWith({
            mensaje: "No hay citas registradas"
        });
    });

    it("PU-CT15 - Debe manejar errores al consultar todas las citas", async () => {
        vi.mocked(selectAllCitas).mockRejectedValue(new Error("Error DB"));
        vi.spyOn(console, "error").mockImplementation(() => {});

        const req = {} as Request;
        const res = crearResponse();

        await getAllCitas(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            ok: false,
            error: "Error DB"
        });
    });
});

describe("getCitaByParamsId", () => {

    it("PU-CT16 - Debe devolver una cita por su ID", async () => {
        vi.mocked(selectCitaById).mockResolvedValue(cita);

        const req = { params: { id: "1" } } as unknown as Request;
        const res = crearResponse();

        await getCitaByParamsId(req, res);

        expect(selectCitaById).toHaveBeenCalledWith(1);
        expect(res.json).toHaveBeenCalledWith({
            ok: true,
            cita
        });
    });

    it("PU-CT17 - Debe informar cuando no encuentra la cita", async () => {
        vi.mocked(selectCitaById).mockResolvedValue(undefined);

        const req = { params: { id: "1" } } as unknown as Request;
        const res = crearResponse();

        await getCitaByParamsId(req, res);

        expect(res.json).toHaveBeenCalledWith({
            mensaje: "No se encontro la cita seleccionada"
        });
    });

    it("PU-CT18 - Debe manejar errores al consultar una cita", async () => {
        vi.mocked(selectCitaById).mockRejectedValue(new Error("Error DB"));
        vi.spyOn(console, "error").mockImplementation(() => {});

        const req = { params: { id: "1" } } as unknown as Request;
        const res = crearResponse();

        await getCitaByParamsId(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            ok: false,
            error: "Error DB"
        });
    });

    it("PU-CT19 - Debe rechazar un ID inválido", async () => {
        const req = { params: { id: "abc" } } as unknown as Request;
        const res = crearResponse();

        await expect(getCitaByParamsId(req, res))
            .rejects.toThrow("ERR_IDCITA_TO_NUM");

        expect(selectCitaById).not.toHaveBeenCalled();
    });
});

describe("changeEstadoCita", () => {

    it("PU-CT20 - Debe actualizar el estado de una cita", async () => {
        vi.mocked(updateEstadoCita).mockResolvedValue(undefined);

        const req = {
            body: { id: 1, estado: "Completada" }
        } as unknown as Request;

        const res = crearResponse();

        await changeEstadoCita(req, res);

        expect(updateEstadoCita).toHaveBeenCalledWith(1, "Completada");
        expect(res.json).toHaveBeenCalledWith({
            ok: true,
            exito: "Estado de la cita actualizado"
        });
    });

    it("PU-CT21 - Debe manejar errores al actualizar el estado", async () => {
        vi.mocked(updateEstadoCita).mockRejectedValue(new Error("Error DB"));
        vi.spyOn(console, "error").mockImplementation(() => {});

        const req = {
            body: { id: 1, estado: "Completada" }
        } as unknown as Request;

        const res = crearResponse();

        await changeEstadoCita(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            ok: false,
            error: "Error DB"
        });
    });

    it("PU-CT22 - Debe rechazar un ID inválido al actualizar el estado", async () => {
        const req = {
            body: { id: "abc", estado: "Completada" }
        } as unknown as Request;

        const res = crearResponse();

        await expect(changeEstadoCita(req, res))
            .rejects.toThrow("ERR_IDCITA_TO_NUM");

        expect(updateEstadoCita).not.toHaveBeenCalled();
    });
});

describe("reprogramarCita", () => {

    it("PU-CT23 - Debe reprogramar una cita correctamente", async () => {
        vi.mocked(updateFechaCita).mockResolvedValue(undefined);

        const req = {
            body: {
                id: 1,
                fecha_hora: "2026-12-01 10:00:00"
            }
        } as unknown as Request;

        const res = crearResponse();

        await reprogramarCita(req, res);

        expect(updateFechaCita).toHaveBeenCalledWith(
            1,
            "2026-12-01 10:00:00"
        );

        expect(res.json).toHaveBeenCalledWith({
            ok: true,
            exito: "Cita reprogramada exitosamente"
        });
    });

    it("PU-CT24 - Debe manejar errores al reprogramar una cita", async () => {
        vi.mocked(updateFechaCita).mockRejectedValue(new Error("Error DB"));
        vi.spyOn(console, "error").mockImplementation(() => {});

        const req = {
            body: {
                id: 1,
                fecha_hora: "2026-12-01 10:00:00"
            }
        } as unknown as Request;

        const res = crearResponse();

        await reprogramarCita(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            ok: false,
            error: "Error DB"
        });
    });

    it("PU-CT25 - Debe rechazar un ID inválido al reprogramar", async () => {
        const req = {
            body: {
                id: "abc",
                fecha_hora: "2026-12-01 10:00:00"
            }
        } as unknown as Request;

        const res = crearResponse();

        await expect(reprogramarCita(req, res))
            .rejects.toThrow("ERR_IDCITA_TO_NUM");

        expect(updateFechaCita).not.toHaveBeenCalled();
    });
});
