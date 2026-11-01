
import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import clientesRouter from "./routes/clientes.js";
import usersRouter from "./routes/users.js";
import clinicasRouter from "./routes/clinicas.js";
import mascotasRouter from "./routes/mascotas.js";
import citasRouter from "./routes/citas.js";
import consultasRouter from "./routes/consultas.js";
import vacunasRouter from "./routes/vacunas.js";

const app: Express = express();

app.use(express.json());

app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:8080"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(cookieParser());

app.use("/users", usersRouter);
app.use("/clinicas", clinicasRouter);
app.use("/clientes", clientesRouter);
app.use("/mascotas", mascotasRouter);
app.use("/citas", citasRouter);
app.use("/consultas", consultasRouter);
app.use("/vacunas", vacunasRouter);

export default app;
