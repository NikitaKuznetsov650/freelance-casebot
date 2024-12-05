import axios from "axios"
import dotenv from 'dotenv'

dotenv.config()

async function test(){
    await axios.get(`https://openexchangerates.org/api/latest.json?app_id=1976040383e040e7ba26035df57fc05e`).then(res => {
        console.log(res.data.rates["EUR"])
    }).catch(error => {
        console.log(error)
    })
}

test()