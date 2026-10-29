import express, {} from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import envGetter from "./utils/envGetter.ts";
import clientesRouter from './routes/clientes.ts';
import usersRouter from './routes/users.ts';
import clinicasRouter from './routes/clinicas.ts';
import mascotasRouter from './routes/mascotas.ts';
const app = express();
const { PORT } = envGetter();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(cookieParser());
app.use("/users", usersRouter);
app.use("/clinicas", clinicasRouter);
app.use("/clientes", clientesRouter);
app.use("/mascotas", mascotasRouter);
app.listen(PORT, () => {
    console.log(`Escuchando desde el puerto ${PORT}`);
});
//# sourceMappingURL=server.js.map