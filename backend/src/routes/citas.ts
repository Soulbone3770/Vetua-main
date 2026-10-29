import express, {type Router} from "express";
import {agendarCita, getCitas, getCitasManana, getAllCitas, getCitaByParamsId, changeEstadoCita, reprogramarCita} from "../controllers/citasController.js";
import authCheck from "../utils/authCheck.js";
import checkFields from "../utils/checkFields.js";

const router: Router = express.Router();

router.post("/api/agendarCita",checkFields(["fecha_hora", "clienteTipoDocumento", "clienteNumDocumento", "motivo", "estado", "notas", "nombreMascota", "clinicaId"]), authCheck, agendarCita);
router.get("/api/getCitas", authCheck, getCitas);
router.get("/api/getCitasManana", getCitasManana);
router.get("/api/getAllCitas", getAllCitas);
router.get("/api/getCitaByParams/:id", getCitaByParamsId);
router.put("/api/changeEstadoCita", changeEstadoCita);
router.put("/api/reprogramarCita", reprogramarCita);

export default router;