import { describe, it, expect, vi } from "vitest";
import type { Request, Response, NextFunction } from "express";

import checkFields from "./checkFields.js";

describe("Middleware checkFields", () => {

    it("PU-01: permite continuar cuando todos los campos existen", () => {

        const req = {
            body: {
                nombres: "Carlos",
                correo: "carlos@gmail.com"
            }
        } as Request;

        const res: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis()
        };

        const next = vi.fn() as NextFunction;

        const middleware = checkFields(["nombres", "correo"]);

        middleware(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();

    });

    it("PU-02: rechaza la petición cuando falta el nombre", () => {

        const req = {
            body: {
                correo: "carlos@gmail.com"
            }
        } as Request;

        const res: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis()
        };

        const next = vi.fn() as NextFunction;

        const middleware = checkFields(["nombres", "correo"]);

        middleware(req, res, next);

        expect(res.json).toHaveBeenCalledWith({
            mensaje: "Todos los campos son necesarioss"
        });

        expect(next).not.toHaveBeenCalled();

    });

    it("PU-03: rechaza la petición cuando falta el correo", () => {

        const req = {
            body: {
                nombres: "Carlos"
            }
        } as Request;

        const res: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis()
        };

        const next = vi.fn() as NextFunction;

        const middleware = checkFields(["nombres", "correo"]);

        middleware(req, res, next);

        expect(res.json).toHaveBeenCalled();

        expect(next).not.toHaveBeenCalled();

    });

});