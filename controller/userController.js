const express = require('express');
const reg = require('../model/registration');
const router = express.Router();
const twilio = require('twilio');
const axios = require('axios');
const Country =require('../model/country');
// router.post('/registerUser', async (req, res) => {
//     const { first_name, last_name, DOB, email, country, phone, reference, language,remark } = req.body;

//     try {
//         const existingUser = await reg.findOne({ where: { email: email, phone: phone } });
//         console.log(existingUser);
//         if (existingUser) {
//             res.status(400).send({ message: "User already exists" });
//         } else {
//             const user = await reg.create({
//                 first_name,
//                 last_name,
//                 DOB,
//                 email,
//                 country,
//                 phone,
//                 reference,
//                 language,
//                 remark
//             });
//             res.status(200).send({ message: "User registered successfully" });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({ message: "An error occurred" });
//     }
// });


// io.on('connection',function (socket){
//     socket.on('fetchusers',()=> {
//         socket.emit()
//     })
// })
router.post('/registerUser', async (req, res) => {
    const { first_name, last_name, DOB, email, country, phone, reference, language, remark } = req.body;

    try {
        const existingUser = await reg.findOne({ where: { email: email, phone: phone } });
        console.log(existingUser);
        if (existingUser) {
            res.status(400).send({ message: "User already exists" });
        } else {
            const otpRequest = {
                method: 'get',

                url :`'https://www.fast2sms.com/dev/bulkV2?authorization=YOUR_API_KEY&variables_values=5599&route=otp&numbers=${phone}`,
              //  url: `https://2factor.in/API/V1/57e72ad2-8dae-11ed-9158-0200cd936042/SMS/${phone}/AUTOGEN2`,
                headers: {
                    Accept: 'application/json'
                }
            };

            axios(otpRequest)
                .then(async (response) => {
                    
                    const otp = random.int((min = 0), (max = 1)) // Extract the OTP from the response
                    console.log(otp);

                    // Save the user data to the database, including OTP
                    const user = await reg.create({
                        first_name,
                        last_name,
                        DOB,
                        email,
                        country,
                        phone,
                        reference,
                        language,
                        remark,
                        otp // Store OTP in the database
                    });

                    res.status(200).send({ message: "User registered successfully" });
                })
                .catch((error) => {
                    console.error(error);
                    res.status(400).send({ message: "An error occurred while requesting OTP" });
                });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "An error occurred" });
    }
});
// router.post("/verify_otp", async (req, res) => {
//     console.log("<........verify OTP user........>");
//     const number = req.body.phone;
//     console.log(number);
  
//     try {
//       // Find the user with the provided phone number
//       const user = await reg.findOne({ where: { phone: number } });
  
//       if (!user) {
//         res.status(401).send("User not found");
//       } else {
//         console.log("................");
//         console.log(user.otp);
  
//         if (user.otp === req.body.OTP) {
//           // Clear the OTP and save the user
//           user.otp = '';
//           await user.save();
  
//           res.status(200).send("Success");
//         } else {
//           res.status(400).send("Invalid OTP");
//           console.log(number);
  
//           // If OTP is invalid, you may choose to remove the user
//           await user.destroy();
  
//           // You can respond to the client as needed
//           res.json({
//             message: 'User deleted successfully',
//           });
//         }
//       }
//     } catch (err) {
//       console.log("<........error........>" + err);
//       res.status(400).send(err);
//     }
//   });
  

const accountSid = 'AC103d96242eb9ce2785095820ec24b563';

const authToken = '394742e97eccd37d5dc0940f5f097120';

const twilioPhoneNumber = '+12295979290';

const client = new twilio(accountSid, authToken);


router.post('/send-sms', (req, res) => {
    const to = req.body.to; // Extract 'to' from the request body

    // Use the Twilio client to send an SMS
    client.messages
        .create({
            body: "Your registration is complete! . For the zoom session please send a hi to the WhatsApp number :+91 9008290027",
            from: twilioPhoneNumber,
            to: to,
        })
        .then((message) => {
            console.log(`SMS sent: ${message.sid}`);
            res.status(200).json({ status: 'SMS sent successfully' });
        })
        .catch((error) => {
            console.error('Error sending SMS:', error);
            res.status(500).json({ error: 'Failed to send SMS' });
        });
});


router.post('/countries', async (req, res) => {
    const data = req.body; // Assuming req.body is an array of objects

    if (Array.isArray(data)) {
        try {
            // Use Sequelize to bulk create the data in the database
            await Country.bulkCreate(data);

            res.status(200).send({ message: "Countries added to the database successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "An error occurred while adding countries to the database" });
        }
    } else {
        res.status(400).send({ message: "Invalid data format. Please send an array of objects." });
    }
});
router.get('/countrieslist', async (req, res) => {
    try {
        const countries = await Country.findAll();
        res.json(countries);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "An error occurred while fetching countries" });
    }
});

module.exports = router;
