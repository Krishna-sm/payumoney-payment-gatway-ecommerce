require("colors")
require("dotenv").config({
    path:'./.env'
})
const express = require("express")
const { PayData } = require("./payu.config")
const crypto = require("crypto")
const app = express()
const port = process.env.PORT || 4500
const cors = require("cors")

// middleware
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cors())

app.post("/get-payment",async(req,res)=>{
            try {
                const txn_id='PAYU_MONEY_'+Math.floor(Math.random()*8888888)
                    const { amount,product,firstname,email,mobile } =req.body

                //    let amount=233
                //    let product = JSON.stringify({
                //     name:'T-shirt',
                //     price:233
                //    })
                //    let firstname='Krishna'
                //    let email="harish@gmail.com"
                //    let mobile = 2345678912

                    let udf1 = ''
                    let udf2 = ''
                    let udf3 = ''
                    let udf4 = ''
                    let udf5 = ''

                    const hashString = `${PayData.payu_key}|${txn_id}|${amount}|${JSON.stringify(product)}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${PayData.payu_salt}`;
                    // console.log(hashString);
                    
     
    // Calculate the hash
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');

               const data=    await PayData.payuClient.paymentInitiate({
           
                    
                            isAmountFilledByCustomer:false,
                                txnid:txn_id,
                                amount:amount,
                                currency: 'INR',
                                productinfo:JSON.stringify(product),
                                firstname:firstname,
                                email:email,
                                phone:mobile,
                                surl:`http://localhost:${port}/verify/${txn_id}`,
                                furl:`http://localhost:${port}/verify/${txn_id}`,
                                hash
                    

                    }) 
                    res.send(data)
            } catch (error) {
                        res.status(400).send({
                            msg:error.message,
                            stack:error.stack
                        })
            }
})


app.post("/verify/:txnid",async(req,res)=>{
    // res.send("Done")


        const verified_Data = await PayData.payuClient.verifyPayment(req.params.txnid);
        const data = verified_Data.transaction_details[req.params.txnid]

        res.redirect(`http://localhost:5173/payment/${data.status}/${data.txnid}`)
        // res.send({
        //     status:data.status,
        //     amt:data.amt,
        //     txnid:data.txnid,
        //     method:data.mode,
        //     error:data.error_Message,
        //     created_at:new Date(data.addedon).toLocaleString()
        // })
// PAYU_MONEY_4996538
})
// run the application
app.listen(port,()=>{
    console.log(`the app is listen at http://localhost:${port}`.bgCyan.white);
    
})