
import app from "./app.js";
import envGetter from "./utils/envGetter.js";

const { PORT } = envGetter();

app.listen(PORT, () => {
    console.log(`Escuchando desde el puerto ${PORT}`);
});
