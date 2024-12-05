import {Stripe} from "stripe";
import dotenv from "dotenv"

dotenv.config()

export const stripe = new Stripe(String(process.env.TEST_STRIPE_KEY));
