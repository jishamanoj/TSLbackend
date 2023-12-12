const express = require('express');
const reg = require('../model/registration');
const router = express.Router();
const { Op } = require("sequelize");
const axios = require('axios');
const Country =require('../model/country');
const session = require('express-session');
const Redis = require('ioredis');
const redis = new Redis();

const{ validUser,BankDetails} = require('../model/validUsers');

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
        const countries = await Country.findAll();
        res.json(countries);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "An error occurred while fetching countries" });
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
            return res.status(409).json({ message: "User already exists" });
        } else {
            // User does not exist, generate a new OTP
            const otp = generateOTP();

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

router.post("/verify_otp", async (req, res) => {
    console.log("<........verify OTP user........>");

    const { first_name, last_name, email, DOB, gender, country, phone, reference, language, remark, OTP } = req.body;

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

            // Store the data in the reg table
            const [user, created] = await reg.findOrCreate({
                where: { phone: phone },
                defaults: {
                    first_name,
                    last_name,
                    email,
                    DOB,
                    gender,
                    country,
                    reference,
                    language,
                    remark,
                    password: hashedPassword,
                    verify: 'true'
                }
            });

            if (!created) {
                // Update the user data if the user already exists
                user.update({
                    first_name,
                    last_name,
                    email,
                    DOB,
                    gender,
                    country,
                    reference,
                    language,
                    remark,
                    password: hashedPassword,
                    verify: 'true'
                });
            }

            // Delete the OTP from Redis after successful verification
            await redis.del(redisKey);

            return res.status(200).send("Success");
        } else {
            // Respond with an error message if OTP is invalid
            return res.status(400).send("Invalid OTP");
        }
    } catch (err) {
        console.error("<........error........>", err);
        return res.status(500).send(err.message || "An error occurred during OTP verification");
    }
});

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

            return res.status(200).json({ message: "OTP sent successfully" });
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
        console.log(storedOTP)

        if (!storedOTP) {
            return res.status(401).send("OTP not found in Redis");
        }

        if (storedOTP === otp) {
            const hashedPassword = await bcrypt.hash(new_password, 10);

            // Save details in the 'validUser' table
            await validUser.create({
                email: regUser.email,
                first_name: regUser.first_name,
                last_name: regUser.last_name,
                DOB : regUser.DOB,
                gender : regUser.gender,
                email : regUser.email,
                country : regUser.country,
                phone : regUser.phone,
                reference : regUser.reference,
                languages: regUser.languages,
                remark : regUser.remark,
                userId : regUser.userId,
                DOJ : regUser.DOJ,
                expiredDate: regUser.expiredDate,
                password: hashedPassword
            });

            // Delete the user from the 'reg' table
            await regUser.destroy();

            // Delete the OTP from Redis after successful verification
            await redis.del(redisKey);

            return res.status(200).json({ message: "Password reset successfully" });
        } else {
            // Respond with an error message if OTP is invalid
            return res.status(400).send("Invalid OTP");
        }
    } catch (err) {
        console.error("<........error........>", err);
        return res.status(500).send(err.message || "An error occurred during OTP verification");
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
      return res.status(400).json({ message:
   
  'Email and password are required' });
    }
  
    try {
      const user = await validUser.findOne({ where: { email } });
  
      if (!user) {
        return res.status(404).json({ message: 'Invalid email or password' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      // Create session and store user ID
      req.session.userId = user.id;
  
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

router.put('/updateUser/:userId', async (req, res) => {
    const userId = req.params.userId;
    const userData = req.body;

    try {
        // Find the user by userId
        const user = await validUser.findByPk(userId);

        // Update user details
        if (user) {
            // Update all fields provided in the request
            await user.update(userData);
        } else {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find or create the associated bank details for the user
        let bankDetails = await BankDetails.findOne({ where: { validUserId: userId } });
        if (!bankDetails) {
            bankDetails = await BankDetails.create({ validUserId: userId });
        }

        // Update all fields of BankDetails provided in the request
        await bankDetails.update(userData);

        return res.status(200).json({ message: 'User and bank details updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
module.exports = router;