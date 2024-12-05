import { Request, response, Response } from "express";
import { stripe } from "../services/stripe.service";
import { insertStripePayment, updateStripePaymentsStatus } from "../models/db.stripe.model";
import logger from "../../assets/logger/logger";
import { getCurrentUserBalance, updateUserBalance } from "../models/db.users.model";
import { exchange } from "../services/exchange";


export async function createStripeCheckoutSession(req: Request, res: Response): Promise<any> {
    const { amount, currency, userId, email } = req.body;

    try {
        const response = await stripe.paymentIntents.create({
            amount: amount,
            currency: currency,
            automatic_payment_methods: {
                enabled: true
            },
            receipt_email: email
        });

        const userBalance: number = await getCurrentUserBalance(userId);
        console.log(response)
        const exchangeResult = await exchange(currency, "USD")

        await insertStripePayment(response, userId);
        await updateUserBalance((userBalance + response.amount) * exchangeResult, userId)
        res.json(response)
    } catch (error) {
        console.error(error);
        return res.status(500).send(error)
    }
}

export async function updateStripeCheckoutSession(req: Request, res: Response): Promise<any>{
    const {paymentId, email} = req.body

    const response = await stripe.paymentIntents.update(paymentId, {
        receipt_email: email
    })

    res.json(response)
    console.info(response)
}

export async function updateStripePaymentStatus(req: Request, res: Response){
    const {paymentId, status} = req.body

    await updateStripePaymentsStatus(paymentId, status)
}

export async function createStripePayoutSession(req: Request, res: Response){
    const {amount, currency, destination, userId} = req.body

    try {
        const response = await stripe.payouts.create({
            amount: amount,
            currency: currency,
            destination: destination
        })

        const userBalance: number = await getCurrentUserBalance(userId)
        await updateUserBalance(userBalance - response.amount, userId)
        logger.info(response)
        res.json(response)
    } catch (error) {
        console.error(error)
    }
}

export async function getStripePayouts(res?: Response): Promise<any>{
    
    return res?.json(await stripe.payouts.list())
}
