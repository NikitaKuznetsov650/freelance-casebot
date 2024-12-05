import mysql from 'mysql2'
import dotenv from 'dotenv'

dotenv.config({path: "../modules/.env"})

export const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "casebot",
    port: 3306,
});


pool.getConnection((err, connection) => {
    if (err) {
        return console.error('Error connecting to MariaDB:', err);
    }
    console.info("Connected to MariaDB");
    connection.release();
});