import express from 'express';
import type {Router} from "express";
import checkFields from '../utils/checkFields.js';
import { registerClientes, getClientes, getClienteByParams, getClienteByDocumento, updateClienteInformacion, deleteCliente } from '../controllers/clientesController.js';
import authCheck from "../utils/authCheck.js";

const router: Router = express.Router();

router.post("/api/register", checkFields(["nombres", "apellidos", "fecha_nacimiento", "tipo_documento", "num_documento", "sexo", "telefono", "correo", "direccion", "ciudad", "departamento"]), registerClientes);
router.get("/api/getClientes", authCheck, getClientes);
router.get("/api/getClienteByDocumento", authCheck, getClienteByDocumento);
router.get("/api/getClienteByParams/:clienteId", authCheck, getClienteByParams);
router.put("/api/actualizarInformacion", checkFields(["id", "nombres", "apellidos", "telefono", "correo", "direccion", "ciudad", "departamento"]), updateClienteInformacion);
router.delete("/api/deleteCliente/:id", deleteCliente);

export default router;