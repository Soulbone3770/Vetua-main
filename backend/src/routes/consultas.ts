import express, {type Router} from "express";
import {registerConsulta, getConsultaByQuery, getConsultas, getConsultaByIdParams} from "../controllers/consultasController.js";
import checkFields from "../utils/checkFields.js";

const router: Router = express.Router();

router.post("/api/registerConsulta", checkFields(["fecha_hora", "motivo_consulta", "peso_en_consulta", "temperatura", "frecuencia_cardiaca",
    "sintomas", "diagnostico", "tratamiento_indicado", "observaciones", "costo", "nombre_mascota", "id_veterinario", "id_clinica", "cliente_tipo_documento", "cliente_num_documento"]),  registerConsulta);
router.get("/api/getConsultasByQuery", getConsultaByQuery);
router.get("/api/getConsultas", getConsultas);
router.get("/api/getConsultaByParams/:consultaId/:veterinarioId", getConsultaByIdParams);

export default router;