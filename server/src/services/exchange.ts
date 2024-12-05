import axios from "axios";
import dotenv from 'dotenv'

dotenv.config({path: "../../../.env"})

export async function exchange(base: string, target: string){
    const response = await axios.get(`https://exchange-rates.abstractapi.com/v1/live/?api_key=${String(process.env.EXCHANGE_KEY)}&base=${base}&target=${target}`)
    console.log(response.data.exchange_rates.USD)
    return response.data.exchange_rates.USD
}
//'https://exchange-rates.abstractapi.com/v1/live/?api_key=84ba2d2bbcec4023a3f3098d1f1e8e65&base=EUR&target=RUB'

exchange("rub", "usd")