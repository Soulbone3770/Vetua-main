import dotenv from "dotenv";

dotenv.config({
    path: ".env.test",
    override: true
});

if (process.env.DB_DATABASE !== "vetua_test") {
    throw new Error(
        "Las pruebas deben ejecutarse exclusivamente sobre vetua_test"
    );
}