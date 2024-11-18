# Let's Integrate Payu Money Payment Gateway with Node js


### Step 1:

- go to payu dashboard
- switch to test/live mode
- get payu Merchant key or Salt


### Step 2:
- create a npm project using 
```bash
npm init -y
```
- create a `.env` file in root 
- add variable in `.env` file

```bash
PAYU_MERCHANT_KEY=<YOUR MERCHANT KEY>
PAYU_MERCHANT_SALT=<YOUR MERCHANT SALT>
PAYU_ENVIRONMENT=<TEST/LIVE>
```


### Step 3:

- install dependencies 

```bash
express cors payu-websdk dotenv

```

### step 4:

- creat express app

```js
//<root>/server.js

require("dotenv").config({})
const express = require("express")
const app = express()
const cors = require("cors")

const {CreateTransaction,payuClient} = require("./payu.config.js")


// add some middlewares

app.use(express.urlencoded({extends:false})) // as body parser
app.use(express.json()) // as body parser
app.use(cors())  // to allow cross origin

app.get("/api/payment",async(req,res)=>{
    // required field for transaction initilized
    const {product_details,firstname,email,mobile,amount } = req.body 
          const data= await CreateTransaction({
                productinfo:product_details,firstname,email,mobile,amount
            })


            res.send(data);

})

// verify payment
app.post("/api/:status/:id,async(req,res)=>{
 
    const data= await payuClient.verifyPayment(req.params.id) 
     const status = data.transaction_details[req.params.id]

    res.send({
            msg:"payment "+req.params.status,
            txn_id:req.params.id,
            error_messsage:status.error_Message,
            status:{
                amount:status.amt,
                payment_method:status.mode,
                error:status.field9,
                date:new Date(status.addedon).toLocaleDateString(),
                time:new Date(status.addedon).toLocaleTimeString(),
                status:status.status,
            },
            // data
        })
})


app.listen(4000,()=>{
    console.log(`the app is listen at http://localhost:4000`)
})


```


### step 5:

- create a config file for `payumoney config`


```js
//<root>/payu.config.js


    const PayU = require("payu-websdk");
    const key  = process.env.PAYU_MERCHANT_KEY
    const salt  = process.env.PAYU_MERCHANT_SALT

    const crypto = require("crypto")

    const payuClient = new PayU({
        key,
        salt,
    },process.env.PAYU_ENVIRONMENT);  

    exports.payuClient = payuClient;

const transaction_id  ='PAYU_' + Math.floor(Math.random() * 45825666); // change as per product id or order id

    exports.CreateTransaction = ({
        email,
        firstname,
        mobile,
        txnid=transaction_id,
        amount,
        productinfo,
        udf1='',
        udf2='',
        udf3='',
        udf4='',
        udf5='',
    })=>{


        // Prepare the string to hash
    const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${salt}`;

     
    // Calculate the hash
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');

      const data = await payuClient.paymentInitiate({
      isAmountFilledByCustomer: false,
      amount: amount,
      currency: 'INR',
      firstname: firstname,
      email: email,
      phone: mobile,
      txnid: txnid,
      productinfo: productinfo, // Passing productinfo as a string
      surl: `http://localhost:4000/api/success/${txnid}`,
      furl: `http://localhost:4000/api/failure/${txnid}`,
      hash: hash
    });
  
              
return data;
    }
```

- more information about integration refer official documentation

[visit](https://docs.payu.in/docs/integrate-gosdk) official docs

```bash
https://docs.payu.in/docs/integrate-gosdk

```

----------
> happy coding 🚀

