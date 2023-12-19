// const express = require('express');
// const reg = require('../model/registration');
// const router = express.Router();
// const twilio = require('twilio');
// const axios = require('axios');
// const Country =require('../model/country');
// const bcrypt = require('bcrypt');
// //const user = require('../model/Users')
// const { Op } = require("sequelize");
// const{ validUser} = require('../model/validUsers');
// const session = require('express-session');
// router.post('/registerUser', async (req, res) => {
//     console.log("enter")
//   // const { first_name, last_name, DOB,gender, email, country, phone, reference, language, remark } = req.body;
//  const{email,phone} = req.body;
//     try {
//         const existingUser = await reg.findOne({
//             where: {
//                 [Op.or]: [
//                     { email: email },
//                     { phone: phone }
//                 ]
//             }
//         });

//         if (existingUser) {
                 
//                return res.status(404).json({ message: "User already exists" });
//             }
//          else {
//             // User does not exist, generate a new OTP and save the user with verify set as false
//             const otp = Math.floor(Math.random() * (9999 - 1000)) + 1000;

//             const otpRequest = {
//                 method: 'get',
//                 url: `https://www.fast2sms.com/dev/bulkV2?authorization=aKVbUigWHc8CBXFA9rRQ17YjD4xhz5ovJGd6Ite3k0mnSNuZPMolFREdzJGqw8YVAD7HU1OatPTS6uiK&variables_values=${otp}&route=otp&numbers=${phone}`,
//                 headers: {
//                     Accept: 'application/json'
//                 }
//             };

//             axios(otpRequest)
//                 .then(async (response) => {
//                     // Save the user data to the database, including OTP and verify set as false
//                     const user = await reg.create({                  
//                        email,
//                        phone,
//                         verify: 'false',
//                         otp ,
//                         otpTimestamp: new Date() 
//                         // Store OTP in the database
//                     });
//                 user.save();
//                    return res.status(200).json({ message: "User registered successfully" });
//                 })
//                 .catch((error) => {
//                     console.error(error);
//                    return res.status(404).json({ message: "An error occurred while requesting OTP" });
//                 });
//         }
//     } catch (error) {
//         console.error(error);
//        return res.status(500).send({ message: "An error occurred" });
//     }
// });


// // router.post("/verify_otp", async (req, res) => {
// //     console.log("<........verify OTP user........>");
// //     const { first_name, last_name, DOB,gender,country, phone, reference, language, remark,OTP} = req.body;
// //    // const { phone, OTP } = req.body; // Extract phone and OTP from req.body
// //     console.log("Phone: " + phone);
// //     console.log("OTP: " + OTP);
  
// //     try {
// //       // Find the user with the provided phone number
// //       const user = await reg.findOne({ where: { phone: phone } });
  
// //       if (!user) {
// //         return res.status(401).send("User not found");
// //       }
  
// //       console.log("................");
// //       console.log("Stored OTP: " + user.otp);
  
// //       if (user.otp === OTP) {
// //         user.first_name = first_name;
// //         user.last_name = last_name;
// //         user.DOB = DOB;
// //         user.gender = gender;
// //         user.country = country;
// //         user.reference =reference;
// //         user.language = language;
// //         user.remark = remark;
// //         // Clear the OTP and save the user
// //         user.otp = '';
// //         user.verify = 'true';
// //         await user.save();
  
// //         return res.status(200).send("Success");
// //       } else {
// //         // If OTP is invalid, delete the user record
// //         await user.destroy();
  
// //         // Respond with an error message
// //         return res.status(400).send("Invalid OTP");
// //       }
// //     } catch (err) {
// //       console.log("<........error........>" + err);
// //       return res.status(500).send(err);
// //     }
// //   });
  
// // router.post("/verify_otp", async (req, res) => {
// //     console.log("<........verify OTP user........>");
// //     const { first_name, last_name,email, DOB, gender, country, phone, reference, languages, remark, OTP } = req.body;
// //     console.log("Phone: " + phone);
// //     console.log("OTP: " + OTP);

// //     try {
// //         //Find the user with the provided phone number
// //         const user = await reg.findOne({ where: { phone: phone } });

// //         if (!user) {
// //             return res.status(401).send("User not found");
// //         }

// //         console.log("................");
// //         console.log("Stored OTP: " + user.otp);
// //         const d = new Date();
// //         let month = d.getMonth() + 1; //months from 1-12
// //         let day = d.getDate();
// //         let year = d.getFullYear() + 5;
// //         const exp = `${day}/${month}/${year}`
// //         // Check if OTP is valid
// //         if (user.otp === OTP) {
// //             const currentTime = new Date();
// //            // console.log("currentTime: " + currentTime);
// //             const otpTimestamp = new Date(user.otpTimestamp);
// //             //console.log("otpTimestamp:",otpTimestamp);
// //            // console.log("currentTime - otpTimestamp",currentTime - otpTimestamp);
// //             // Check if the OTP is still valid (within 2 minutes)
// //             if (currentTime - otpTimestamp <= 2 * 60 * 1000) {
// //                 user.first_name = first_name;
// //                 user.last_name = last_name;
// //                 //user.email = email;
// //                 user.DOB = DOB;
// //                 user.gender = gender;
// //                 user.phone = phone;
// //                 user.country = country;
// //                 user.reference = reference;
// //                 user.languages = languages;
// //                 user.remark = remark;
// //                 user.DOB = new Date();
// //                 user.expiredDate = exp;
// //                 // Clear the OTP and save the user
// //                 user.otp = '';
// //                 user.verify = 'true';
// //                 let data = await user.save();

// //                 return res.status(200).json({message :"Success",data});
// //             } else {
// //                 // If OTP is expired, delete the user record
// //                 await user.destroy();

// //                 // Respond with an error message
// //                 return res.status(404).send("OTP has expired");
// //             }
// //         }else{
// //             const currentTime = new Date();
// //                 const otpTimestamp = new Date(user.otpTimestamp);
// //                 if (currentTime - otpTimestamp > 2 * 60 * 1000){
// //             // If OTP is invalid, delete the user record
// //             await user.destroy();
// //             return res.status(404).send("Time expired");
// //                 }
// //                 else {
// //             // Respond with an error message
// //             return res.status(404).send("Invalid OTP");
// //                 }
// //         }
// //     } catch (err) {
// //         console.log("<........error........>" + err);
// //         return res.status(500).send(err);
// //     }
// // });

  
// //   router.post('/send-sms', (req, res) => {
// //     const to = req.body.to; // Extract 'to' from the request body

// //     // Use the Twilio client to send an SMS
    
// //     const sms = {
// //         method: 'get',
// //         url :`https://www.fast2sms.com/dev/bulkV2?authorization=aKVbUigWHc8CBXFA9rRQ17YjD4xhz5ovJGd6Ite3k0mnSNuZPMolFREdzJGqw8YVAD7HU1OatPTS6uiK&message=Your registration is complete! . For the zoom session please send a hi to the WhatsApp number :https://wa.me/+919008290027&language=english&route=q&numbers=${to}`,
// //       //  url: `https://2factor.in/API/V1/57e72ad2-8dae-11ed-9158-0200cd936042/SMS/${phone}/AUTOGEN2`,
// //         headers: {
// //             Accept: 'application/json'
// //         }
// //     };
    
// //     axios(sms).then((message) => {
// //             console.log(`SMS sent: ${message.sid}`);
// //            return res.status(200).json({ status: 'SMS sent successfully' });
// //         })
// //         .catch((error) => {
// //             console.error('Error sending SMS:', error);
// //            return res.status(500).json({ error: 'Failed to send SMS' });
// //         });
// // });



// router.post('/countries', async (req, res) => {
//     const data = req.body; // Assuming req.body is an array of objects

//     if (Array.isArray(data)) {
//         try {
//             // Use Sequelize to bulk create the data in the database
//             await Country.bulkCreate(data);

//             res.status(200).send({ message: "Countries added to the database successfully" });
//         } catch (error) {
//             console.error(error);
//             res.status(500).send({ message: "An error occurred while adding countries to the database" });
//         }
//     } else {
//         res.status(400).send({ message: "Invalid data format. Please send an array of objects." });
//     }
// });
// router.get('/countrieslist', async (req, res) => {
//     try {
//         const countries = await Country.findAll();
//         res.json(countries);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({ message: "An error occurred while fetching countries" });
//     }
// });
// router.post('/resendOtp', async (req, res) => {
//     const { phone } = req.body;

//     try {
//         // Find the user with the provided phone number
//         const user = await reg.findOne({ where: { phone: phone } });

//         if (user) {
//             // Generate a new OTP
//             const otp = Math.floor(Math.random() * (9999 - 1000)) + 1000;

//             // Send the new OTP to the user (you can use your OTP sending logic here)
//             const otpRequest = {
//                 method: 'get',
//                 url: `https://www.fast2sms.com/dev/bulkV2?authorization=aKVbUigWHc8CBXFA9rRQ17YjD4xhz5ovJGd6Ite3k0mnSNuZPMolFREdzJGqw8YVAD7HU1OatPTS6uiK&variables_values=${otp}&route=otp&numbers=${phone}`,
//                 headers: {
//                     Accept: 'application/json'
//                 }
//             };

//             axios(otpRequest)
//                 .then(async (response) => {
//                     // Update the user's OTP in the database
//                     user.otp = otp;
//                     user.verify = 'false';
//                     await user.save();

//                     res.status(200).send({ message: "OTP resent successfully" });
//                 })
//                 .catch((error) => {
//                     console.error(error);
//                     res.status(400).send({ message: "An error occurred while requesting OTP" });
//                 });
//         } else {
//             res.status(404).send({ message: "User not found" });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({ message: "An error occurred" });
//     }
// });



// router.get('/listName/:id', async (req, res) => {
//     try {
//         const { id } = req.params;

//         // Find the member with the provided id
//         const selectedMember = await reg.findByPk(id);

//         if (!selectedMember) {
//             return res.status(404).json({ error: 'Member not found' });
//         }

//         // Fetch the next 4 members including the selected member based on the id in ascending order
//         const members = await reg.findAll({
//             where: {
//                 id: {
//                     [Op.lte]: selectedMember.id, // Greater than or equal to the selected member's id
//                 },
//             },
//             order: [['id', 'DESC']], // Order by id in ascending order
//             limit: 5, // Limit to retrieve 5 records
//             attributes: ['first_name', 'last_name'], // Select only the first_name and last_name columns
//         });

//         const processedData = members.map(user => ({
//             name: `${user.first_name} ${user.last_name}`,
//         }));

//         res.status(200).json(processedData);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'An error occurred' });
//     }
// });


// // const { Op } = require("sequelize");
// // const Redis = require('ioredis');
// // const redis = new Redis();

// // router.post('/registerUser', async (req, res) => {
// //     const { email, phone } = req.body;

// //     try {
// //         const existingUser = await reg.findOne({
// //             where: {
// //                 [Op.or]: [
// //                     { email: email },
// //                     { phone: phone }
// //                 ]
// //             }
// //         });

// //         if (existingUser) {
// //             return res.status(404).json({ message: "User already exists" });
// //         } else {
// //             // User does not exist, generate a new OTP
// //             const otp = generateOTP();

// //             // Save the OTP in Redis with a key that includes the user's phone number
// //             const redisKey = `otp:${phone}`;
// //             await redis.setex(redisKey, 300, otp);

// //             // Send OTP to the user via SMS
// //             const otpRequest = {
// //                 method: 'get',
// //                 url: `https://www.fast2sms.com/dev/bulkV2?authorization=aKVbUigWHc8CBXFA9rRQ17YjD4xhz5ovJGd6Ite3k0mnSNuZPMolFREdzJGqw8YVAD7HU1OatPTS6uiK&variables_values=${otp}&route=otp&numbers=${phone}`,
// //                 headers: {
// //                     Accept: 'application/json'
// //                 }
// //             };

// //             axios(otpRequest)
// //                 .then(async () => {
// //                     // Save the user data to the database, including verify set as false
// //                     const user = await reg.create({
// //                         email,
// //                         phone,
// //                         verify: 'false',
// //                         otpTimestamp: new Date()
// //                     });

// //                     return res.status(200).json({ message: "User registered successfully" });
// //                 })
// //                 .catch((error) => {
// //                     console.error(error);
// //                     return res.status(404).json({ message: "An error occurred while requesting OTP" });
// //                 });
// //         }
// //     } catch (error) {
// //         console.error(error);
// //         return res.status(500).send({ message: "An error occurred" });
// //     }
// // });

// // function generateOTP() {
// //     // Generate a random 6-digit OTP
// //     return Math.floor(100000 + Math.random() * 900000).toString();
// // }
// // async function checkIfOTPExists(phone) {
// //     try {
// //         const redisKey = `otp:${phone}`;
// //         const otp = await redis.get(redisKey);

// //         if (otp) {
// //             // OTP exists in Redis
// //             console.log(`OTP for ${phone}: ${otp}`);
// //             return true;
// //         } else {
// //             // OTP does not exist in Redis
// //             console.log(`OTP not found for ${phone}`);
// //             return false;
// //         }
// //     } catch (error) {
// //         console.error('Error checking OTP in Redis:', error);
// //         return false;
// //     }
// // }

// // // Example usage
// // const userPhone = '907405';  // Replace with the actual user's phone number
// // checkIfOTPExists(userPhone);

// // router.post("/verify_otp", async (req, res) => {
// //     console.log("<........verify OTP user........>");
// //     const { first_name, last_name, DOB,gender,country, phone, reference, language, remark,OTP} = req.body;
// //    // const { phone, OTP } = req.body; // Extract phone and OTP from req.body
// //     console.log("Phone: " + phone);
// //     console.log("OTP: " + OTP);
  
// //     try {
// //       // Find the user with the provided phone number
// //       const user = await reg.findOne({ where: { phone: phone } });
  
// //       if (!user) {
// //         return res.status(401).send("User not found");
// //       }
  
// //       console.log("................");
// //       console.log("Stored OTP: " + user.otp);
  
// //       if (user.otp === OTP) {
// //         user.first_name = first_name;
// //         user.last_name = last_name;
// //         user.DOB = DOB;
// //         user.gender = gender;
// //         user.country = country;
// //         user.reference =reference;
// //         user.language = language;
// //         user.remark = remark;
// //         // Clear the OTP and save the user
// //         user.otp = '';
// //         user.verify = 'true';
// //         await user.save();
  
// //         return res.status(200).send("Success");
// //       } else {
// //         // If OTP is invalid, delete the user record
// //         await user.destroy();
  
// //         // Respond with an error message
// //         return res.status(400).send("Invalid OTP");
// //       }
// //     } catch (err) {
// //       console.log("<........error........>" + err);
// //       return res.status(500).send(err);
// //     }
// //   });
  



router.post("/verify_otp", async (req, res) => {
    console.log("<........verify OTP user........>");
    const { first_name, last_name, email, DOB, gender, country, phone, reference, languages, remark, OTP } = req.body;
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
            const otpTimestamp = new Date(user.otpTimestamp);

            // Check if the OTP is still valid (within 2 minutes)
            if (currentTime - otpTimestamp <= 2 * 60 * 1000) {
                // Validate and store the password securely (use bcrypt for hashing)
                const hashedPassword = await bcrypt.hash(phone, 10);

                user.first_name = first_name;
                user.last_name = last_name;
                user.email = email;
                user.DOB = DOB;
                user.gender = gender;
                user.phone = phone;
                user.country = country;
                user.reference = reference;
                user.languages = languages;
                user.remark = remark;
                user.DOJ = new Date();
                user.expiredDate = calculateExpirationDate();
                user.password = hashedPassword; // Store the hashed password
                user.verify = 'true';

                // Clear the OTP and save the user
                user.otp = '';
                let data = await user.save();

                return res.status(200).json({ message: "Success", data });
            } else {
                // If OTP is expired, delete the user record
                await user.destroy();
                // Respond with an error message
                return res.status(404).send("OTP has expired");
            }
        } else {
            const currentTime = new Date();
            const otpTimestamp = new Date(user.otpTimestamp);

            if (currentTime - otpTimestamp > 2 * 60 * 1000) {
                // If OTP is invalid and time expired, delete the user record
                await user.destroy();
                return res.status(404).send("Time expired");
            } else {
                // Respond with an error message
                return res.status(404).send("Invalid OTP");
            }
        }
    } catch (err) {
        console.log("<........error........>" + err);
        return res.status(500).send(err.message);
    }
});

function calculateExpirationDate() {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 5);
    return d;
}



// // router.post('/resetPassword', async (req, res) => {
// //     const { email, new_password } = req.body;

// //     try {
// //         // Find the user with the provided email
// //         const user = await reg.findOne({ where: { email: email } });

// //         if (!user) {
// //             return res.status(404).json({ message: "User not found" });
// //         }

// //         // Hash the new password with 10 rounds of salt
// //         const hashedPassword = await bcrypt.hash(new_password, 10);

// //         // Update the user's password in the database
// //         user.password = hashedPassword;
// //         await user.save();

// //         return res.status(200).json({ message: "Password reset successfully" });
// //     } catch (error) {
// //         console.error("Error resetting password:", error);
// //         return res.status(500).json({ message: "Internal Server Error" });
// //     }
// // });



// const sessionMiddleware = session({
//     secret: '8be00e304a7ab94f27b5e5172cc0f3b2c575e87d',
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//       maxAge: 1000 * 60 * 60 * 24, // 1 day
//     },
//   });
  
//   router.use(sessionMiddleware);

// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;
  
//     // Validate email and password
  
    
//   if (!email || !password) {
//       return res.status(400).json({ message:
   
//   'Email and password are required' });
//     }
  
//     try {
//       const user = await validUser.findOne({ where: { email } });
  
//       if (!user) {
//         return res.status(404).json({ message: 'Invalid email or password' });
//       }
  
//       const isPasswordValid = await bcrypt.compare(password, user.password);
  
//       if (!isPasswordValid) {
//         return res.status(401).json({ message: 'Invalid email or password' });
//       }
  
//       // Create session and store user ID
//       req.session.userId = user.id;
  
//       res.json({
//         message: 'Login successful',
//         user: {
//           id: user.id,
//           email: user.email,
//           // Don't send sensitive information like password
//         },
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   });

// // router.post('/login', async (req, res) => {
// //     const { email, password } = req.body;

// //     try {
// //         // Find the user with the provided email
// //         const user = await reg.findOne({ where: { email: email } });

// //         if (!user) {
// //             return res.status(404).json({ message: 'User not found' });
// //         }

// //         // Check if the provided password matches the hashed password in the database
// //         const passwordMatch = await bcrypt.compare(password, user.password);

// //         if (passwordMatch) {
// //             // Store the user's ID in the session to indicate that the user is logged in
// //            // req.session.userId = user.id;

// //             return res.status(200).json({ message: 'Login successful', user: { id: user.id, email: user.email } });
// //         } else {
// //             return res.status(401).json({ message: 'Invalid credentials' });
// //         }
// //     } catch (error) {
// //         console.error('Error during login:', error);
// //         return res.status(500).json({ message: 'Internal Server Error' });
// //     }
// // });

// const otpService = require('../services/otpService');
// router.post('/requestPasswordReset', async (req, res) => {
//     const { email } = req.body;

//     try {
//         // Find the user with the provided email
//         const user = await reg.findOne({ where: { email: email } });

//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         // Generate and save a new OTP to the user's record
//         const otp = otpService.generateOTP();
//         user.otp = otp;
       
//         user.otpTimestamp = new Date();
//         await user.save();

//         // Send the OTP to the user's phone number
//         const otpSent = await sendOTPMultipleTimes(user.phone, otp, 3); // Change 3 to the desired number of times

//         if (otpSent) {
//             return res.status(200).json({ message: "OTP sent successfully" });
//         } else {
//             return res.status(500).json({ message: "Failed to send OTP" });
//         }
//     } catch (error) {
//         console.error("Error requesting password reset:", error);
//         return res.status(500).json({ message: "Internal Server Error" });
//     }
// });

// async function sendOTPMultipleTimes(phone, otp, numberOfTimes) {
//     try {
//         for (let i = 0; i < numberOfTimes; i++) {
//             // Send the OTP to the user's phone number
//             const otpSent = await otpService.sendOTP(phone, otp);
            
//             if (!otpSent) {
//                 console.error("Failed to send OTP attempt:", i + 1);
//                 return false;
//             }
//         }
//         return true;
//     } catch (error) {
//         console.error("Error sending OTP multiple times:", error);
//         return false;
//     }
// }

// // ...

// // Route to request a password reset OTP
// // router.post('/requestPasswordReset', async (req, res) => {
// //     const { email } = req.body;

// //     try {
// //         // Find the user with the provided email
// //         const user = await reg.findOne({ where: { email: email } });

// //         if (!user) {
// //             return res.status(404).json({ message: "User not found" });
// //         }

// //         // Generate and save a new OTP to the user's record
// //         const otp = otpService.generateOTP();
// //         user.otp = otp;
       
// //         user.otpTimestamp = new Date();
// //         await user.save();

// //         // Send the OTP to the user's phone number
// //         const otpSent = await otpService.sendOTP(user.phone, otp);

// //         if (otpSent) {
// //             return res.status(200).json({ message: "OTP sent successfully" });
// //         } else {
// //             return res.status(500).json({ message: "Failed to send OTP" });
// //         }
// //     } catch (error) {
// //         console.error("Error requesting password reset:", error);
// //         return res.status(500).json({ message: "Internal Server Error" });
// //     }
// // });
// // router.post('/resetPassword', async (req, res) => {
// //     const { email, otp, new_password } = req.body;

// //     try {
// //         // Find the user with the provided email
// //         const user = await reg.findOne({ where: { email: email } });

// //         if (!user) {
// //             return res.status(404).json({ message: "User not found" });
// //         }

// //         // Check if the provided OTP matches the one stored in the user's record
// //         if (user.otp !== otp) {
// //             return res.status(401).json({ message: "Invalid OTP" });
// //         }

// //         // Check if the OTP is still valid (within 2 minutes)
// //         const currentTime = new Date();
// //         const otpTimestamp = new Date(user.otpTimestamp);
// //         if (currentTime - otpTimestamp > 2 * 60 * 1000) {
// //             return res.status(401).json({ message: "OTP has expired" });
// //         }

// //         // Hash the new password with 10 rounds of salt
// //         const hashedPassword = await bcrypt.hash(new_password, 10);

// //         // Update the user's password and clear the OTP in the database
// //         user.password = hashedPassword;
// //         user.otp = null;
// //         user.otpTimestamp = null;
// //         await user.save();

// //         return res.status(200).json({ message: "Password reset successfully" });
// //     } catch (error) {
// //         console.error("Error resetting password:", error);
// //         return res.status(500).json({ message: "Internal Server Error" });
// //     }
// // });


// router.post('/resetPassword', async (req, res) => {
//     const { email, otp, new_password } = req.body;

//     try {
//         // Find the user with the provided email in the 'reg' schema
//         const regUser = await reg.findOne({ where: { email: email } });

//         if (!regUser) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         // Check if the provided OTP matches the one stored in the user's record
//         if (regUser.otp !== otp) {
//             return res.status(401).json({ message: "Invalid OTP" });
//         }

//         // Check if the OTP is still valid (within 2 minutes)
//         const currentTime = new Date();
//         const otpTimestamp = new Date(regUser.otpTimestamp);
//         if (currentTime - otpTimestamp > 2 * 60 * 1000) {
//             return res.status(401).json({ message: "OTP has expired" });
//         }

//         // Hash the new password with 10 rounds of salt
//         const hashedPassword = await bcrypt.hash(new_password, 10);

//         // Create or update the user in the 'user' schema
//         const [updatedUser, created] = await validUser.findOrCreate({
//             where: { email: regUser.email },
//             defaults: {
//                 first_name: regUser.first_name,
//                 last_name: regUser.last_name,
//                 DOB: regUser.DOB,
//                 gender: regUser.gender,
//                 email: regUser.email,
//                 country: regUser.country,
//                 phone: regUser.phone,
//                 reference: regUser.reference,
//                 languages: regUser.languages,
//                 remark: regUser.remark,
//                 userId: regUser.userId,
//                 DOJ: regUser.DOJ,
//                 expiredDate: regUser.expiredDate,
//                 password: hashedPassword,
//             }
//         });

//         // Clear the OTP in the 'reg' schema
//         regUser.otp = null;
//         regUser.otpTimestamp = null;
//         await regUser.save();
//         await regUser.destroy();

//         return res.status(200).json({ message: "Password reset and user updated successfully" });
//     } catch (error) {
//         console.error("Error resetting password:", error);
//         return res.status(500).json({ message: "Internal Server Error" });
//     }
// });

// router.put('/updateUser/:userId', async (req, res) => {
//     const userId = req.params.userId;

//     try {
//         // Find the user by userId
//         const existingUser = await user.findOne({ where: { userId: userId } });

//         if (!existingUser) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         // Update user fields based on the request body
//         const {
//             first_name,
//             last_name,
//             DOB,
//             gender,
//             email,
//             address,
//             pincode,
//             state,
//             district,
//             country,
//             phone,
//             reference,
//             languages,
//             remark,
//             DOJ,
//             expiredDate
//         } = req.body;

//         // Update the fields
//         existingUser.first_name = first_name || existingUser.first_name;
//         existingUser.last_name = last_name || existingUser.last_name;
//         existingUser.DOB = DOB || existingUser.DOB;
//         existingUser.gender = gender || existingUser.gender;
//         existingUser.email = email || existingUser.email;
//         existingUser.address = address || existingUser.address;
//         existingUser.pincode = pincode || existingUser.pincode;
//         existingUser.state = state || existingUser.state;
//         existingUser.district = district || existingUser.district;
//         existingUser.country = country || existingUser.country;
//         existingUser.phone = phone || existingUser.phone;
//         existingUser.reference = reference || existingUser.reference;
//         existingUser.languages = languages || existingUser.languages;
//         existingUser.remark = remark || existingUser.remark;
//         existingUser.DOJ = DOJ || existingUser.DOJ;
//         existingUser.expiredDate = expiredDate || existingUser.expiredDate;

//         // Save the changes
//         await existingUser.save();

//         return res.status(200).json({ message: "User information updated successfully" });
//     } catch (error) {
//         console.error("Error updating user information:", error);
//         return res.status(500).json({ message: "Internal Server Error" });
//     }
// });

// module.exports = router;
