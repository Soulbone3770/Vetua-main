import mysql, {type Pool} from 'mysql2/promise';
import envGetter from "./envGetter.js";

const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE } = envGetter();

const db: Pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    connectionLimit: 10
});

export default db;