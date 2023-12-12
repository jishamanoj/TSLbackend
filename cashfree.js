const crypto =  require('crypto');
const axios = require('axios');
//const {secrect_key, app_id} = require('./secret')

const newOrderId = async (req, res) => {
    try {
        const options = {
            method: 'POST',
            url: 'https://sandbox.cashfree.com/pg/orders',
            headers: {
                accept: 'application/json',
                'x-api-version': '2022-09-01',
                'content-type': 'application/json',
                'x-client-id': TEST10078244823539563a619b8abba544287001,
                'x-client-secret': cfsk_ma_test_4d3c98af37b5eff4cd7c82373b46b3f2_45def3ca
        },
        data: {
            customer_details: {
            customer_id: 'CID89898' + Date.now(),
            customer_email: 'waleedsdev@gmail.com',
            customer_phone: '7498608775',
            customer_name: 'Waleed Shaikh'
            },
            order_meta: {
            notify_url: "https://webhook.site/d057a7d4-c09a-405c-b44b-3067a1559a07",
            payment_methods: 'cc,dc,upi'
            },
            order_amount: 1,
            order_id: 'ORID665456' + Date.now(),
            order_currency: 'INR',
            order_note: 'This is my first Order',
        }
        };

        axios
        .request(options)
        .then(function (response) {
            console.log(response.data);
            return res.status(200).send(response.data.payment_session_id)
        })
        .catch(function (error) {
            console.error(error);
        });

    } catch (error) {
        res.status(500).send({
            message: error.message,
            success: false
        })
    }
}

const checkStatus = async (req, res) => {
    const orderid = req.params.orderid
    console.log(orderid)
    try {
        const options = {
            method: 'GET',
            url: `https://sandbox.cashfree.com/pg/orders/${orderid}`,
            headers: {
                accept: 'application/json',
                'x-api-version': '2022-09-01',
                'x-client-id': app_id,
                'x-client-secret': secrect_key
            }
        };

        axios
        .request(options)
        .then(function (response) {
            console.log(response.data);
            if(response.data.order_status === "PAID"){
                return res.redirect('http://localhost:3000/success')
            } else if(response.data.order_status === "ACTIVE"){
                return res.redirect(`http://localhost:3000/${response.data.payment_session_id}`)
            } else{
                return res.redirect('http://localhost:3000/failure')
            }
        })
        .catch(function (error) {   
            return console.error(error);
        });
       
    } catch (error) {
        res.status(500).send({
            message: error.message,
            success: false
        })
    }
}

module.exports = {
    newOrderId,
    checkStatus
}