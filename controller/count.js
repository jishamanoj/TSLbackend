// //const {load} =require('@cashfreepayments/cashfree-js');

// // (async function loadCash(){
// //     const cashfree = await load({
// //         mode: "sandbox" //or production
// //     });
// //     let version = cashfree.version();

// // console.log(version);
// // })()

// const express = require('express');
// const cashfree = require('@cashfreepayments');

// const app = express();

// // Configure Cashfree SDK
// const cashfreeClient = cashfree({
//   mode: 'sandbox', // Replace with 'production' for production environment
//   clientId: 'TEST10078244823539563a619b8abba544287001',
//   clientSecret: 'cfsk_ma_test_4d3c98af37b5eff4cd7c82373b46b3f2_45def3ca',
// });

// // Create Order API
// app.post('/create-order', async (req, res) => {
//   try {
//     const { amount, currency, orderNote, customerDetails } = req.body;

//     const order = await cashfreeClient.createOrder({
//       amount,
//       currency,
//       orderNote,
//       customerDetails,
//     });

//     res.status(201).json({
//       orderId: order.orderId,
//       paymentSession: order.paymentSession,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'An error occurred while creating order' });
//   }
// });

// // Initiate Payment API
// app.post('/initiate-payment', async (req, res) => {
//   try {
//     const { orderId, paymentOption } = req.body;

//     const response = await cashfreeClient.initiatePayment({
//       orderId,
//       paymentOption,
//     });

//     res.status(200).json({
//       paymentLink: response.paymentLink,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'An error occurred while initiating payment' });
//   }
// });

// // Verify Payment API
// app.post('/verify-payment', async (req, res) => {
//   try {
//     const { orderId, paymentToken } = req.body;

//     const verification = await cashfreeClient.verifyPayment({
//       orderId,
//       paymentToken,
//     });

//     res.status(200).json({
//       paymentStatus: verification.paymentStatus,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'An error occurred while verifying payment' });
//   }
// });

// // Start the server
// app.listen(3000, () => {
//   console.log('Server started on port 3000');
// });










// //require CashfreeSDK
// const cfSdk = require('cashfree-sdk');

// //access the PayoutsSdk from CashfreeSDK
// const {Payouts} = cfSdk;

// // // Instantiate Cashfree Payouts
// const payoutsInstance = new Payouts({
//   env: 'TEST',
//   clientId: 'TEST10078244823539563a619b8abba544287001',
//   clientSecret: 'cfsk_ma_test_4d3c98af37b5eff4cd7c82373b46b3f2_45def3ca',
// });





// //import { PaymentGateway } from '@cashfreepayments/cashfree-sdk';


// // Instantiate Cashfree Payment Gateway
// const pgInstance = new PaymentGateway({
//   env: 'TEST', // or 'PRODUCTION'
//   apiVersion: '1.0.0', // specify your API version
//   appId: 'YOUR_APP_ID', // replace with your App ID
//   secretKey: 'YOUR_SECRET_KEY', // replace with your Secret Key
// });


const cfSdk = require('cashfree-sdk');

//access the PayoutsSdk from CashfreeSDK
const {Payouts} = cfSdk;
//console.log({payouts});

// Instantiate Cashfree Payouts
const payoutsInstance = new Payouts({
  env: 'TEST',
  clientId: 'TEST10078244823539563a619b8abba544287001',
  clientSecret: 'cfsk_ma_test_4d3c98af37b5eff4cd7c82373b46b3f2_45def3ca',
});

// // Instantiate Cashfree Payouts
// const payoutsInstance = new Payouts({
//   env: 'TEST',
//   clientId: '<CLIENT_ID>',
//   clientSecret: '<CLIENT_SECRET>',
//   pathToPublicKey: '/path/to/your/public/key/file.pem',
//   //"publicKey": "ALTERNATIVE TO SPECIFYING PATH (DIRECTLY PASTE PublicKey)"
// })
