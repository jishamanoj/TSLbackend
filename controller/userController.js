const express = require('express');
const reg = require('../model/registration');
const router = express.Router();

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

module.exports = router;
