import express from 'express';
import {createVacunacion, getVacunas} from "../controllers/vacunasController.js";
import checkFields from "../utils/checkFields.js";

const router = express.Router();

router.post("/api/createVacunacion", checkFields(["fecha_aplicacion", "proxima_dosis", "mascota_id", "vacuna_id"]), createVacunacion);
router.get("/api/getVacunas", getVacunas);

export default router;