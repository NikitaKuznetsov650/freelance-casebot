import { Response } from "express";
import { pool } from "../services/connection.service";
import logger from "../../assets/logger/logger";
import { stripe } from "../services/stripe.service";

export async function insertStripePayment(response: any, userId: string) {
    console.log(response.id, response.amount, response.status, userId);

    return new Promise((resolve, reject) => {
        const query = "INSERT INTO payments (id, amount, status, userId) VALUES (?, ?, ?, ?)";

        pool.query(query, [response.id, response.amount, response.status, userId], (error, results) => {
            if (error) {
                console.error("Error inserting into database", error);
                return reject(error)
            }

            resolve(results);
        });
    });
}

export async function updateStripePaymentsStatus(paymentId: string, status: string, res?: Response) {
    return new Promise((resolve, reject) => {
        const query = "UPDATE payments SET status = ? WHERE id = ?";

        pool.query(query, [status, paymentId], (error, results) => {
            if (error) {
                console.log(error);
                return res?.status(500).send(error);
            }

            res?.json(results);
            resolve(results);
        });
    });
}