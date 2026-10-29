import 'dotenv/config';

const envGetter = () => {

    const getEnv = (valor: string) => {
        const resultado: string | undefined = process.env[valor];

        if(!resultado){
            throw new Error(`El valor ${valor} no existe`);
        }

        return resultado;
    };

    const DB_HOST: string = getEnv("DB_HOST");
    const DB_USER: string = getEnv("DB_USER");
    const DB_PASSWORD: string = getEnv("DB_PASSWORD");
    const DB_DATABASE: string = getEnv("DB_DATABASE");
    const PORT: string = getEnv("PORT");
    const SECRET_KEY: string = getEnv("JWT_SECRET_KEY");

    return { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE, PORT, SECRET_KEY };

};

export default envGetter;