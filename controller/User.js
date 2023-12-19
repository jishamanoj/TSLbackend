const express = require('express');
const {reg,BankDetails} = require('../model/registration');
const router = express.Router();
const { Op } = require("sequelize");
const axios = require('axios');
const Country =require('../model/country');
const session = require('express-session');
const Redis = require('ioredis');
const redis = new Redis();
const questions =require("../model/question");
const {Users,sequelize} = require('../model/validUsers');
const Meditation =require('../model/meditation');
const moment = require('moment');
const bcrypt = require('bcrypt');

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
      const countries = await Country.findAll({
        order: [['name', 'ASC']], // Order by the 'name' field in ascending order
      });
  
      res.json(countries);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'An error occurred while fetching countries' });
    }
  });


router.post('/registerUser', async (req, res) => {
    const { email, phone } = req.body;

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

            if (existingUser.email === email) {
                return res.status(400).json({ message: "Email already exists" , status:'false',flag :'email'});
            } else {
                return res.status(400).json({ message: "Phone number already exists",status:'false',flag :'phone' });
            }
        } else {
            // User does not exist, generate a new OTP
            const otp = generateOTP();
            console.log(otp);

            // Save the OTP in Redis with a key that includes the user's phone number
            const redisKey = `otp:${phone}`;
            await redis.setex(redisKey, 600, otp);

            // Send OTP to the user via SMS
            const otpRequest = {
                method: 'get',
                url: `https://www.fast2sms.com/dev/bulkV2?authorization=aKVbUigWHc8CBXFA9rRQ17YjD4xhz5ovJGd6Ite3k0mnSNuZPMolFREdzJGqw8YVAD7HU1OatPTS6uiK&variables_values=${otp}&route=otp&numbers=${phone}`,
                headers: {
                    Accept: 'application/json'
                }
            };

            await axios(otpRequest);

            return res.status(200).json({ message: "OTP sent successfully" });
        }
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

function generateOTP() {
    // Generate a random 4-digit OTP
    return Math.floor(1000 + Math.random() * 9000).toString();
}

router.get('/displayDataFromRedis/:key', async (req, res) => {
    const key = req.params.key;

    try {
        // Retrieve data from Redis using the provided key
        const data = await redis.get(key);

        if (data) {
            // If data exists, parse it and send it in the response
            const parsedData = JSON.parse(data);
            res.status(200).json(parsedData);
        } else {
            res.status(404).json({ message: 'Data not found in Redis' });
        }
    } catch (error) {
        console.error('Error retrieving data from Redis:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// router.post("/verify_otp", async (req, res) => {
//     console.log("<........verify OTP user........>");

//     const { first_name, last_name, email, DOB, gender, country, phone, reference, language, remark, OTP } = req.body;
//     console.log(first_name, last_name, email, DOB, gender, country, phone, reference, language, remark, OTP)

//     console.log("Phone: " + phone);
//     console.log("OTP: " + OTP);

//     try {
//         // Retrieve the stored OTP from Redis
//         const redisKey = `otp:${phone}`;
//         const storedOTP = await redis.get(redisKey);

//         if (!storedOTP) {
//             return res.status(401).send("OTP not found in Redis");
//         }

//         // Verify the OTP
//         if (storedOTP === OTP) {
//             //const hashedPassword = await bcrypt.hash(phone, 10);
//             bcrypt.hash(String(phone), 10,async function(err, hashedPassword) {
//                 // Store hash in your password DB.

//                 if(err) {
//                     return res.status(500).json({message: "Something went wrong"});
//                 }

//             console.log(hashedPassword,err, "hash");
//             // Store the data in the reg table
//             const user = await reg.findOrCreate({
//                 where: { phone: phone },
//                 defaults: {
//                     first_name,
//                     last_name,
//                     email,
//                     DOB,
//                     gender,
//                     country,
//                     reference,
//                     language,
//                     remark,
//                     DOJ : new Date(),
//                     expiredDate : calculateExpirationDate(),
//                     password: hashedPassword,
//                     verify: 'true'
//                 }
//             });

//             const extractedValues = Object.values(user.dataValues);

//              console.log("lineno162",extractedValues);
//              console.log("line 163 ",user)


            

//             // Delete the OTP from Redis after successful verification
//             await redis.del(redisKey);

//             return res.status(200).json({message:"Success",data:extractedValues});
//         })
//         } else {
//             // Respond with an error message if OTP is invalid
//             return res.status(400).json({message:"Invalid OTP"});
//         }
//     } catch (err) {
//         console.error("<........error........>", err);
//         return res.status(500).json({message : err.message || "An error occurred during OTP verification"});
//     }
// });


// router.post("/verify_otp", async (req, res) => {
//     console.log("<........verify OTP user........>");

//     const { first_name, last_name, email, DOB, gender, country, phone, reference, languages, remark, OTP } = req.body;

//     console.log("Phone: " + phone);
//     console.log("OTP: " + OTP);

//     try {
//         // Retrieve the stored OTP from Redis
//         const redisKey = `otp:${phone}`;
//         const storedOTP = await redis.get(redisKey);

//         if (!storedOTP) {
//             return res.status(401).send("OTP not found in Redis");
//         }

//         // Verify the OTP
//         if (storedOTP === OTP) {
//             const hashedPassword = await bcrypt.hash(phone, 10);

//             // // Store the data in the reg table
//             // const [user, created] = await reg.findOrCreate({
//             //     where: { phone: phone },
//             //     defaults: {
//             //         first_name,
//             //         last_name,
//             //         email,
//             //         DOB,
//             //         gender,
//             //         country,
//             //         reference,
//             //         languages,
//             //         remark,
//             //         DOJ : new Date(),
//             //         expiredDate : calculateExpirationDate(),
//             //         password: hashedPassword,
//             //         verify: 'true'
//             //     }
//             // });

//             user.first_name = first_name;
//                 user.last_name = last_name;
//                 user.email = email;
//                 user.DOB = DOB;
//                 user.gender = gender;
//                 user.phone = phone;
//                 user.country = country;
//                 user.reference = reference;
//                 user.languages = languages;
//                 user.remark = remark;
//                 user.DOJ = new Date();
//                 user.expiredDate = calculateExpirationDate();
//                 user.password = hashedPassword; // Store the hashed password
//                 user.verify = 'true';
//                 const data = await user.save();

//             await BankDetails.create({
//                 AadarNo: 0,
//                 IFSCCode: "",
//                 branchName: "",
//                 accountName: "",
//                 accountNo: 0,
//                 regId: user.id // Assuming regId is the foreign key in BankDetails
//             });

//             // Delete the OTP from Redis after successful verification
//             await redis.del(redisKey);
//             // const data = {
//             //     message: "Success",
//             //     data: {
//             //         id: user.id,
//             //         first_name: user.first_name,
//             //         last_name: user.last_name,
//             //         DOJ: user.DOJ,
//             //         expiredDate: user.expiredDate,
//             //         userId: user.userId
//             //     }
//             // };

//             return res.status(200).json({ message: "Success", data });
//         } else {
//             // Respond with an error message if OTP is invalid
//             return res.status(400).send("Invalid OTP");
//         }
//     } catch (err) {
//         console.error("<........error........>", err);
//         return res.status(500).send(err.message || "An error occurred during OTP verification");
//     }
// });
// function calculateExpirationDate() {
//     const d = new Date();
//     d.setFullYear(d.getFullYear() + 5);
//     return d;
// }

router.post("/verify_otp", async (req, res) => {
    console.log("<........verify OTP user........>");

    const { first_name, last_name, email, DOB, gender, country, phone, reference, languages, remark, OTP } = req.body;
    console.log(first_name, last_name, email, DOB, gender, country, phone, reference, languages, remark, OTP)

    console.log("Phone: " + phone);
    console.log("OTP: " + OTP);

    try {
        // Retrieve the stored OTP from Redis
        const redisKey = `otp:${phone}`;
        const storedOTP = await redis.get(redisKey);

        if (!storedOTP) {
            return res.status(401).send("OTP not found in Redis");
        }

        // Verify the OTP
        if (storedOTP === OTP) {
            const hashedPassword = await bcrypt.hash(phone, 10);
            const maxUserId = await reg.max('userId');
            const userId = maxUserId + 1;
            // Update the user record
         //   const user = await reg.findOne({ where: { phone } });

            // if (!user) {
            //     return res.status(404).send("User not found");
            // }

            // Update user data
            const user = await reg.create({
            first_name,
            last_name,
            email,
            DOB,
            gender,
            phone,
            country,
            reference,
            languages,
            remark,
            userId,
            DOJ : new Date(),
            expiredDate : calculateExpirationDate(),
            password : hashedPassword, // Store the hashed password
            verify : 'true'
        });
            // Save the updated user data
            await user.save();

            // Create a record in the BankDetails table
            await BankDetails.create({
                AadarNo: 0,
                IFSCCode: "",
                branchName: "",
                accountName: "",
                accountNo: 0,
                regId: user.id // Assuming regId is the foreign key in BankDetails
            });

            // Delete the OTP from Redis after successful verification
            await redis.del(redisKey);

            const responseData = {
                message: "Success",
                data: {
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    DOJ: user.DOJ,
                    expiredDate: user.expiredDate,
                    userId: user.userId
                }
            };

            return res.status(200).json(responseData);
        } else {
            // Respond with an error message if OTP is invalid
            return res.status(400).send("Invalid OTP");
        }
    } catch (err) {
        console.error("<........error........>", err);
        return res.status(500).send(err.message || "An error occurred during OTP verification");
    }
});

function calculateExpirationDate() {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 5);
    return d;
}


router.get('/listName/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find the member with the provided id
        const selectedMember = await reg.findByPk(id);

        if (!selectedMember) {
            return res.status(404).json({ error: 'Member not found' });
        }

        // Fetch the next 4 members including the selected member based on the id in ascending order
        const members = await reg.findAll({
            where: {
                id: {
                    [Op.lte]: selectedMember.id, // Greater than or equal to the selected member's id
                },
            },
            order: [['id', 'DESC']], // Order by id in ascending order
            limit: 5, // Limit to retrieve 5 records
            attributes: ['first_name', 'last_name'], // Select only the first_name and last_name columns
        });

        const processedData = members.map(user => ({
            name: `${user.first_name} ${user.last_name}`,
        }));

        res.status(200).json(processedData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

/////////////////////////////////// USER APP \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

router.post('/requestPasswordReset', async (req, res) => {
        const { email } = req.body;
    
        try {
            // Find the user with the provided email
            const user = await reg.findOne({ where: { email: email } });
    
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            } else {
            // User does not exist, generate a new OTP
            const otp = generateOTP();

            // Save the OTP in Redis with a key that includes the user's phone number
            const redisKey = `reqotp:${user.phone}`;
            await redis.setex(redisKey, 600, otp);

            // Send OTP to the user via SMS
            const otpRequest = {
                method: 'get',
                url: `https://www.fast2sms.com/dev/bulkV2?authorization=aKVbUigWHc8CBXFA9rRQ17YjD4xhz5ovJGd6Ite3k0mnSNuZPMolFREdzJGqw8YVAD7HU1OatPTS6uiK&variables_values=${otp}&route=otp&numbers=${user.phone}`,
                headers: {
                    Accept: 'application/json'
                }
            };

            await axios(otpRequest);

            return res.status(200).json({ message: "OTP sent successfully",otp : otp });
        }
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post('/resetPassword', async (req, res) => {
    const { email, otp, new_password } = req.body;

    try {
        // Find the user with the provided email in the 'reg' schema
        const regUser = await reg.findOne({ where: { email: email } });

        if (!regUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Retrieve the stored OTP from Redis
        const redisKey = `reqotp:${regUser.phone}`;
        const storedOTP = await redis.get(redisKey);

        if (!storedOTP) {
            return res.status(401).json({message:"Otp has expired" });``
        }

        if (storedOTP === otp) {
            const hashedPassword = await bcrypt.hash(new_password, 10);

            // Update password and set classAttended to true in the 'reg' table
            await reg.update({
                password: hashedPassword,
                classAttended: true,
            }, {
                where: { email: regUser.email },
            });

            // Delete the OTP from Redis after successful verification
            await redis.del(redisKey);

            return res.status(200).json({ message: "Password reset successfully" });
        } else {
            // Respond with an error message if OTP is invalid
            return res.status(400).send("Invalid OTP");
        }
    } catch (err) {
        console.error("Error resetting password:", err);
        return res.status(500).send(err.message || "An error occurred during password reset");
    }
});
const sessionMiddleware = session({
    secret: '8be00e304a7ab94f27b5e5172cc0f3b2c575e87d',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  });
  
  router.use(sessionMiddleware);

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    // Validate email and password
  
    
  if (!email || !password) {
      return res.status(400).json({ message:'Email and password are required' });
    }
  
    try {
        const user = await reg.findOne({
            where: {
                email: email,
                classAttended: true, // Check if classAttended is true
            },
        });
      if (!user) {
        return res.status(404).json({ message: 'Invalid email or password' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      // Create session and store user ID
      req.session.userId = user.id;
      //xconsole.log(res)
      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          // Don't send sensitive information like password
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

//   router.put('/updateValidUser/:userId', async (req, res) => {
//     const userId = req.params.userId;
//     const updatedFields = req.body;
  
//     try {
//       // Update the validUser record
//       const result = await validUser.update(updatedFields, {
//         where: { userId: userId },
//       });
//       const result = await BankDetails.update(updatedFields, {
//         where: { validuserId: userId },
//       });
//       if (result[0] > 0) {
//         res.json({ message: `${result[0]} row(s) updated` });
//       } else {
//         res.status(404).json({ message: 'User not found' });
//       }
//     } catch (err) {
//       console.error('Error updating record:', err);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   });



// router.put('/updateUser/:userId', async (req, res) => {
//     const userId = req.params.userId;
//     const userData = req.body;

//     try {
//         // Find the user by userId
//         const user = await reg.findByPk(userId);

//         // Update user details
//         if (user) {
//             // Update all fields provided in the request
//             await user.update(userData);
//         } else {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         // Find or create the associated bank details for the user
//         let bankDetails = await BankDetails.findOne({ where: { regId: userId } });
//         if (!bankDetails) {
//             bankDetails = await BankDetails.create({ regId: userId });
//         }

//         // Update all fields of BankDetails provided in the request
//         await bankDetails.update(userData);

//         return res.status(200).json({ message: 'User and bank details updated successfully' });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

router.put('/updateUser', async (req, res) => {
    const userId = req.session.userId; // Retrieve userId from the session
    const userData = req.body;

    try {
        // Check if the user is authenticated
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Find the user by userId
        const user = await reg.findByPk(userId);

        // Update user details
        if (user) {
            // Update all fields provided in the request
            await user.update(userData);
        } else {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find or create the associated bank details for the user
        let bankDetails = await BankDetails.findOne({ where: { regId: userId } });
        if (!bankDetails) {
            bankDetails = await BankDetails.create({ regId: userId });
        }

        // Update all fields of BankDetails provided in the request
        await bankDetails.update(userData);

        return res.status(200).json({ message: 'User and bank details updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/reference/:userId', async (req, res) => {
    const userId = req.params.userId;
    console.log("userId",userId);
  
    try {
      const user = await reg.findOne({
        where: { userId },
        attributes: ['first_name', 'last_name'],
      });
   
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const fullName = `${user.first_name} ${user.last_name}`.trim();
      res.json({ full_name: fullName });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  router.get('/list-questions', async (req, res) => {
    try {
      const Questions = await questions.findAll();
      res.json(Questions);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  router.get('/user-details/:userId', async (req, res) => {
    const id = req.params.userId;

    try {
        const userDetails = await reg.findOne({
            where: { id },
            include: [BankDetails], // Include BankDetails in the result
        });

        if (!userDetails) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(userDetails);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.delete('/delete-user/:phone', async (req, res) => {
    const phone = req.params.phone;

    try {
        // Find the user based on the phone number
        const user = await reg.findOne({ where: { phone } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete the user
        await user.destroy();

        return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.delete('/deleteuser/:phone', async (req, res) => {
    const phone = req.params.phone;
    try {
        // Find the user based on the phone number
        const user = await reg.findOne({ where: { phone } });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
const bank = await bankDetails.findOne({ where: {regId: user.id} });
await user.destroy();
if (bank) {
    await bank.destroy();
}
return res.status(200).json({ message: 'User deleted successfully' });
        
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

// router.post('/meditation',async(req, res, next)=>{
//     try{
//          const {startdatetime,stopdatetime}   = req.body;
//      //    const startdatetime = "2023-12-19 14:06:49";

// //const stopdatetime = "2023-12-19 14:56:49";

// const refStartDate = moment(`${startdatetime}`, "YYYY-MM-DD HH:mm:ss");

// const refFutureDate = refStartDate.clone().add(45, "minutes");

// const refStopDate = moment(`${stopdatetime}`, "YYYY-MM-DD HH:mm:ss");

// const difference = refStopDate.diff(refStartDate,'minutes')
     
     
//         const meditationRecord = await Meditation.create({
//             med_starttime : refStartDate.format('YYYY-MM-DD HH:mm:ss'),
//             med_stoptime :refStopDate.format('YYYY-MM-DD HH:mm:ss'),
//             med_endtime:refFutureDate.format('YYYY-MM-DD HH:mm:ss'),
            
//             session_num: '0', // Change this based on your requirements
//             day: 0, // Change this based on your requirements
//             cycle: 0, // Change this based on your requirements
           
//           });
//         //  defferance = refactor_startDate.diff(refactor_endDate,'minutes')
//           if(difference >= 45){

//             meditationRecord.session_num += 1
//             await meditationRecord.save();
//           }
//           if(meditationRecord.session_num == 2){
//             meditationRecord.day += 1
//             meditationRecord.session_num = 0
//             await meditationRecord.save();

//           }
//           if (meditationRecord.day == 41){
//             meditationRecord.cycle += 1
//             meditationRecord.day = 0
//           }

//           await meditationRecord.save();
//           return res.status(200).json({ message: 'Meditation time inserted successfully' });
//     }catch (error) {
//         console.error('Error:', error);
//         return res.status(500).json({ error: 'Internal Server Error' });
//     }
// })

router.post('/meditation', async (req, res) => {
    try {
        const { userId, startdatetime, stopdatetime } = req.body;

        console.log('Received userId:', userId);
        console.log('Received startdatetime:', startdatetime);
        console.log('Received stopdatetime:', stopdatetime);

        // Check if userId exists in the reg table
        const userExists = await reg.findOne({ where: { userId } });
        if (!userExists) {
            return res.status(404).json({ error: 'User not found in reg table' });
        }

        const refStartDate = moment(`${startdatetime}`, "YYYY-MM-DD HH:mm:ss", true);
        const refFutureDate = refStartDate.clone().add(45, "minutes");
        const refStopDate = moment(`${stopdatetime}`, "YYYY-MM-DD HH:mm:ss", true);

        console.log('Parsed startdatetime:', refStartDate.format('YYYY-MM-DD HH:mm:ss'));
        console.log('Parsed stopdatetime:', refStopDate.format('YYYY-MM-DD HH:mm:ss'));

        const difference = refStopDate.diff(refStartDate, 'minutes');

        console.log('Difference:', difference);

        const meditationRecord = await Meditation.create({
            userId, // Use the userId from the request body
            med_starttime: refStartDate.format('YYYY-MM-DD HH:mm:ss'),
            med_stoptime: refStopDate.format('YYYY-MM-DD HH:mm:ss'),
            med_endtime: refFutureDate.format('YYYY-MM-DD HH:mm:ss'),
            session_num: 0,
            day: 0,
            cycle: 0,
        });

        if (difference >= 45) {
            meditationRecord.session_num += 1;
        }

        if (meditationRecord.session_num === 2) {
            meditationRecord.day += 1;
            meditationRecord.session_num = 0;
        }

        if (meditationRecord.day === 41) {
            meditationRecord.cycle += 1;
            meditationRecord.day = 0;
        }

        await meditationRecord.save();
        return res.status(200).json({ message: 'Meditation time inserted successfully' });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});



// router.post('/meditation',async(req, res, next)=>{
//     try{
//         if (req.body.med_stoptime){
//         }
//      else{   //const {med_starttime,med_stoptime}   = req.body;
//         const med_starttime = moment();


//         var med_endtime = moment().add(45, 'minutes');
//         console.log(med_starttime.format("YYYY-MM-DD"),med_starttime.format("HH:mm:ss"),med_endtime.format("HH:mm:ss"))
     
//         const meditationRecord = await Meditation.create({
//             med_starttime,
//             med_stoptime,
//             med_endtime,
            
//             session_num: '0', // Change this based on your requirements
//             day: 0, // Change this based on your requirements
//             cycle: 0, // Change this based on your requirements
           
//           });
//           session_num = med_starttime.diff(med_stoptime,'minutes')
//           if(session_num == 45){

//             meditationRecord.session_num = session_num + 1

//           }
//           if(meditationRecord.session_num == 2){
//             meditationRecord.day = +1
//             meditationRecord.session_num = 0


//           }
//           if (meditationRecord.day == 41){
//             meditationRecord.cycle = +1
//             meditationRecord.day = 0
//           }

//           await meditationRecord.save();
//           return res.status(200).json({ message: 'Meditation time inserted successfully' });
//     }}catch (error) {
//         console.error('Error:', error);
//         return res.status(500).json({ error: 'Internal Server Error' });
//     }
// })

module.exports = router;