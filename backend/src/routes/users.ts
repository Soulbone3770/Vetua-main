import express from 'express';
import type { Router } from 'express';
import { registerUsers, loginUsers, autentication, logoutUsers, getUser, getVeterinarios, getUsuariosClinica } from '../controllers/usersController.js';
import checkFields from '../utils/checkFields.js';
import authCheck from '../utils/authCheck.js';


const router: Router = express.Router();

router.post("/api/register", checkFields(["username", "password", "rol", "clinicaId"]), registerUsers);
router.post("/api/login", checkFields(["username", "password", "rol", "clinicaNombre"]), loginUsers);
router.post("/api/logout", authCheck, logoutUsers);
router.get("/api/authCheck", authCheck, autentication);
router.get("/api/getUser", authCheck, getUser);
router.get("/api/getVeterinarios", authCheck, getVeterinarios);
router.get("/api/getUsuariosClinica", authCheck, getUsuariosClinica);
router.get("/api/getUsuariosClinica", authCheck, getUsuariosClinica);

export default router;