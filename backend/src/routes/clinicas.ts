import express, {type Router} from 'express';
import {registerClinica, getEstadisticas} from "../controllers/clinicasController.js";
import checkFields from "../utils/checkFields.js";

const router: Router = express.Router();

router.post("/api/register", checkFields(["nombre", "nit", "telefono", "correo", "direccion", "ciudad", "departamento", "estado", "logo_url"]), registerClinica);
router.get("/api/getEstadisticas/:id", getEstadisticas);

export default router;