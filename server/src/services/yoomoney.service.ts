import { YooCheckout } from "@a2seven/yoo-checkout";
import dotenv from 'dotenv'

dotenv.config()
console.log(`rub: ${process.env.TEST_SHOP_ID}\n${process.env.TEST_SECRET_KEY}`)

export const checkout = new YooCheckout({
    shopId: String(process.env.TEST_SHOP_ID),
    secretKey: String(process.env.TEST_SECRET_KEY)
});

