import express, {type Router} from "express";
import { registerMascota, getMascota, getMascotaByParams, changeMascotaInformacion, deleteMascota } from "../controllers/mascotasController.js";
import checkFields from "../utils/checkFields.js";
import authCheck from "../utils/authCheck.js";

const router: Router = express.Router();

router.post("/api/register", checkFields(["nombre", "especie", "raza", "sexo", "fecha_nacimiento", "peso", "foto_url", "propietarioNumDocumento", "propietarioTipoDocumento", "clinicaId"]), registerMascota);
router.get("/api/getMascota", authCheck, getMascota);
router.get("/api/getMascotaByParams/:id", getMascotaByParams);
router.put("/api/changeMascotaInformacion", checkFields(["nombre", "especie", "raza", "sexo", "peso", "id"]), changeMascotaInformacion);
router.delete("/api/deleteMascota/:id", deleteMascota);

export default router;