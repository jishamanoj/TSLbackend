const express = require('express');
const reg = require('../model/registration');
const router = express.Router();
const twilio = require('twilio');
const axios = require('axios');
const Country =require('../model/country');


const { Op } = require("sequelize");
router.post('/registerUser', async (req, res) => {
  // const { first_name, last_name, DOB,gender, email, country, phone, reference, language, remark } = req.body;
 const{email,phone} = req.body;
    try {
        const existingUser = await reg.findOne({
            where: {
                [Op.or]: [
                    { email: email },
                    { phone: phone }
                ]
            }
        });

        if (existingUser) {
                 
                res.status(400).send({ message: "User already exists" });
            }
         else {
            // User does not exist, generate a new OTP and save the user with verify set as false
            const otp = Math.floor(Math.random() * (9999 - 1000)) + 1000;

            const otpRequest = {
                method: 'get',
                url: `https://www.fast2sms.com/dev/bulkV2?authorization=aKVbUigWHc8CBXFA9rRQ17YjD4xhz5ovJGd6Ite3k0mnSNuZPMolFREdzJGqw8YVAD7HU1OatPTS6uiK&variables_values=${otp}&route=otp&numbers=${phone}`,
                headers: {
                    Accept: 'application/json'
                }
            };

            axios(otpRequest)
                .then(async (response) => {
                    // Save the user data to the database, including OTP and verify set as false
                    const user = await reg.create({                  
                        email,
                        phone,
                        verify: 'false',
                        otp ,
                        otpTimestamp: new Date() 
                        // Store OTP in the database
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
//     const { first_name, last_name, DOB,gender,country, phone, reference, language, remark,OTP} = req.body;
//    // const { phone, OTP } = req.body; // Extract phone and OTP from req.body
//     console.log("Phone: " + phone);
//     console.log("OTP: " + OTP);
  
//     try {
//       // Find the user with the provided phone number
//       const user = await reg.findOne({ where: { phone: phone } });
  
//       if (!user) {
//         return res.status(401).send("User not found");
//       }
  
//       console.log("................");
//       console.log("Stored OTP: " + user.otp);
  
//       if (user.otp === OTP) {
//         user.first_name = first_name;
//         user.last_name = last_name;
//         user.DOB = DOB;
//         user.gender = gender;
//         user.country = country;
//         user.reference =reference;
//         user.language = language;
//         user.remark = remark;
//         // Clear the OTP and save the user
//         user.otp = '';
//         user.verify = 'true';
//         await user.save();
  
//         return res.status(200).send("Success");
//       } else {
//         // If OTP is invalid, delete the user record
//         await user.destroy();
  
//         // Respond with an error message
//         return res.status(400).send("Invalid OTP");
//       }
//     } catch (err) {
//       console.log("<........error........>" + err);
//       return res.status(500).send(err);
//     }
//   });
  
router.post("/verify_otp", async (req, res) => {
    console.log("<........verify OTP user........>");
    const { first_name, last_name, DOB, gender, country, phone, reference, language, remark, OTP } = req.body;
    console.log("Phone: " + phone);
    console.log("OTP: " + OTP);

    try {
        // Find the user with the provided phone number
        const user = await reg.findOne({ where: { phone: phone } });

        if (!user) {
            return res.status(401).send("User not found");
        }

        console.log("................");
        console.log("Stored OTP: " + user.otp);

        // Check if OTP is valid
        if (user.otp === OTP) {
            const currentTime = new Date();
           // console.log("currentTime: " + currentTime);
            const otpTimestamp = new Date(user.otpTimestamp);
            //console.log("otpTimestamp:",otpTimestamp);
           // console.log("currentTime - otpTimestamp",currentTime - otpTimestamp);
            // Check if the OTP is still valid (within 2 minutes)
            if (currentTime - otpTimestamp <= 2 * 60 * 1000) {
                user.first_name = first_name;
                user.last_name = last_name;
                user.DOB = DOB;
                user.gender = gender;
                user.country = country;
                user.reference = reference;
                user.language = language;
                user.remark = remark;

                // Clear the OTP and save the user
                user.otp = '';
                user.verify = 'true';
                let data = await user.save();

                return res.status(200).json({message :"Success",data});
            } else {
                // If OTP is expired, delete the user record
                await user.destroy();

                // Respond with an error message
                return res.status(400).send("OTP has expired");
            }
        }else{
            const currentTime = new Date();
                const otpTimestamp = new Date(user.otpTimestamp);
                if (currentTime - otpTimestamp > 2 * 60 * 1000){
            // If OTP is invalid, delete the user record
            await user.destroy();
            return res.status(400).send("Time expired");
                }
                else {
            // Respond with an error message
            return res.status(400).send("Invalid OTP");
                }
        }
    } catch (err) {
        console.log("<........error........>" + err);
        return res.status(500).send(err);
    }
});

  
  router.post('/send-sms', (req, res) => {
    const to = req.body.to; // Extract 'to' from the request body

    // Use the Twilio client to send an SMS
    
    const sms = {
        method: 'get',
        url :`https://www.fast2sms.com/dev/bulkV2?authorization=aKVbUigWHc8CBXFA9rRQ17YjD4xhz5ovJGd6Ite3k0mnSNuZPMolFREdzJGqw8YVAD7HU1OatPTS6uiK&message=Your registration is complete! . For the zoom session please send a hi to the WhatsApp number :+919008290027&language=english&route=q&numbers=${to}`,
      //  url: `https://2factor.in/API/V1/57e72ad2-8dae-11ed-9158-0200cd936042/SMS/${phone}/AUTOGEN2`,
        headers: {
            Accept: 'application/json'
        }
    };
    
    axios(sms).then((message) => {
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
router.post('/resendOtp', async (req, res) => {
    const { phone } = req.body;

    try {
        // Find the user with the provided phone number
        const user = await reg.findOne({ where: { phone: phone } });

        if (user) {
            // Generate a new OTP
            const otp = Math.floor(Math.random() * (9999 - 1000)) + 1000;

            // Send the new OTP to the user (you can use your OTP sending logic here)
            const otpRequest = {
                method: 'get',
                url: `https://www.fast2sms.com/dev/bulkV2?authorization=aKVbUigWHc8CBXFA9rRQ17YjD4xhz5ovJGd6Ite3k0mnSNuZPMolFREdzJGqw8YVAD7HU1OatPTS6uiK&variables_values=${otp}&route=otp&numbers=${phone}`,
                headers: {
                    Accept: 'application/json'
                }
            };

            axios(otpRequest)
                .then(async (response) => {
                    // Update the user's OTP in the database
                    user.otp = otp;
                    user.verify = 'false';
                    await user.save();

                    res.status(200).send({ message: "OTP resent successfully" });
                })
                .catch((error) => {
                    console.error(error);
                    res.status(400).send({ message: "An error occurred while requesting OTP" });
                });
        } else {
            res.status(400).send({ message: "User not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "An error occurred" });
    }
});


module.exports = router;
