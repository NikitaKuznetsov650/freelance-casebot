import { v4 } from 'uuid';
import { checkout } from '../services/yoomoney.service';
import { ICreatePayment } from '@a2seven/yoo-checkout';
import { Request, Response } from 'express';
import { insertYooMoneyPayment, updateYooMoneyPaymentStatus } from '../models/db.yoomoney.model';
import logger from '../../assets/logger/logger';
import axios from 'axios';
import * as uuid from 'uuid'
import dotenv from 'dotenv'
import descriptionDb from "../../assets/db/descriptionsDb.json"
import { getCurrentUserBalance, updateUserBalance } from '../models/db.users.model';
import { exchange } from '../services/exchange';

dotenv.config()

export async function createRubPayment(req: Request, res: Response): Promise<any> {
    const { amount, userId, email } = req.body;

    try {

        const payload: ICreatePayment = await checkout.createPayment({
            amount: {
                value: amount,
                currency: "RUB"
            },
            confirmation: {
                type: "redirect",
                return_url: "https://t.me/e_vito_bot"
            },
            receipt: {
                customer: {
                    email: email
                },
                items: [
                    {
                        description: descriptionDb.yooMoney + amount,
                        quantity: "1",
                        amount: {
                            value: amount,
                            currency: "RUB"
                        },
                        vat_code: 1
                    }
                ]
            },
            payment_method_data: {
                type: "bank_card"
            },
        });
        
        const paymentResponse = await checkout.createPayment(payload, v4());
        console.log(paymentResponse);
        await insertYooMoneyPayment(paymentResponse, userId);
        res.status(200).json(paymentResponse); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function getPayment(req: Request, res: Response): Promise<any>{
    try {
        const {paymentId, userId} = req.body

        const getPaymentResponse = await checkout.getPayment(paymentId)

        const userBalance = await getCurrentUserBalance(userId)
        if (getPaymentResponse.id !== "succeded" && !getPaymentResponse.paid){
            await updateYooMoneyPaymentStatus(getPaymentResponse.status, userId)
            return res.json(getPaymentResponse)
        }

        await updateYooMoneyPaymentStatus(getPaymentResponse.status, userId)
        const exchangeResult: number = await exchange("rub", "usd")
        await updateUserBalance(userId, Number(userBalance) + Number(getPaymentResponse.amount.value) * exchangeResult)
        console.log(getPaymentResponse)
        res.json(getPaymentResponse)
    } catch (error) {
        logger.error(error)
    }

}

export async function rubPayout(req: Request, res: Response) {

    const {amount, phone, bankId, userId} = req.body
  try {

    const response = await axios.post(
      'https://api.yookassa.ru/v3/payouts',
      {
        amount: {
          value: amount,
          currency: "RUB"
        },
        payout_destination_data: {
          type: "sbp",
          phone: phone,
          bank_id: bankId
        },
        description: "Вывод",
        metadata: {
          order_id: "37"
        }
      },
      {
        headers: {
          'Idempotence-Key': uuid.v4(),
          'Content-Type': 'application/json'
        },
        auth: {
          username: String(process.env.TEST_SHOP_ID),
          password: String(process.env.TEST_SECRET_KEY)
        }
      }
    );
    const currentBalance: number = await getCurrentUserBalance(userId)
    await updateUserBalance(userId, currentBalance - amount)
    res.json({payoutData: response})
    console.log('Payout successful:', response.data);
  } catch (error) {
    res.status(500).json(error)
    console.error('Error making payout:', error);
  }
}

export async function getRubPayoutList() {
  const items = (await checkout.getPaymentList()).items;

  const convertUsd = await exchange("rub", "usd");

  const totalAmount = items.reduce((sum, item) => 
    sum + parseFloat(item.amount.value) * convertUsd, 
  0);

  return totalAmount;
}
