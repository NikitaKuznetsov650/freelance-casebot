import mysql from 'mysql2'
import dotenv from 'dotenv'
import logger from '../../assets/logger/logger';

dotenv.config({path: "../../.env"})

export const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "casebot",
    port: 3306,
});


pool.getConnection((err, connection) => {
    if (err) {
        return logger.error('Error connecting to MariaDB:', err);
    }
    logger.info("Connected to MariaDB");
    connection.release();
});