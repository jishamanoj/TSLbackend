const express = require('express');
const reg = require('../model/registration');
const router = express.Router();
const twilio = require('twilio');

router.post('/registerUser', async (req, res) => {
    const { first_name, last_name, DOB, email, country, phone, reference, language,remark } = req.body;

    try {
        const existingUser = await reg.findOne({ where: { email: email, phone: phone } });
        if (existingUser) {
            res.status(400).send({ message: "User already exists" });
        } else {
            const user = await reg.create({
                first_name,
                last_name,
                DOB,
                email,
                country,
                phone,
                reference,
                language,
                remark
            });
            res.status(200).send({ message: "User registered successfully" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "An error occurred" });
    }
});
const accountSid = 'AC103d96242eb9ce2785095820ec24b563';
const authToken = '979855b87ed0cfab232674ff02f6795f';
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

module.exports = router;
