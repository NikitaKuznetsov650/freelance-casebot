import {RestClientV5} from 'bybit-api'
import dotenv from 'dotenv'

dotenv.config({path: "../../../.env"})

export const cryptoClient = new RestClientV5({
    testnet: false,
    key: process.env.TEST_CRYPTO_KEY,
    secret: process.env.TEST_CRYPTO_SECRET
})

console.log("API Key:", process.env.TEST_CRYPTO_KEY);
console.log("API Secret:", process.env.TEST_CRYPTO_SECRET);
const test = async () => {
    try {
        const response = await cryptoClient
        .getPositionInfo({
            category: "spot",
            symbol: "BTC"
        });


        console.log(response)
    } catch (error) {
        console.error(error)
    }

}


