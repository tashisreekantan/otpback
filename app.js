const express = require('express');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express();
const port = 3000;

mongoose.connect("mongodb+srv://tashisreekantand:tashi8563@cluster0.6ulfxv7.mongodb.net/exitDB?retryWrites=true&w=majority", {useNewUrlParser: true})

const OTPSchema = new mongoose.Schema({
  email: String,
  
  otp: String,
});

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : true}))

const path = require('path');
app.use( express.static(path.join(__dirname, './build')));
app.get('*' , (req ,res)=>{ res.sendFile(path.join(__dirname,
'./build/index.html' ))});


const OTP = mongoose.model('OTP', OTPSchema);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user:'tashisreesailam@gmail.com',
    pass:'xfcvpxnestjjpuxe',
  },
});

app.use(express.json());

app.post('/api/send-otp', (req, res) => {
  const { email } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const mailOptions = {
    from: 'tashisreesailam@gmail.com',
    to: email,
    subject: 'OTP Verification',
    text: `Your OTP is ${otp}`,
  };
 
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to send OTP' });
    } else {
      const newOTP = new OTP({
        email,
        otp,
      });

      newOTP.save();

      res.json({ message: 'OTP sent successfully' });
    }
  });
});

app.post('/api/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
  
    try {
      const result = await OTP.findOne({ email, otp });
  
      if (result) {
        res.json({ message: 'OTP verified successfully' });
      } else {
        res.status(400).json({ error: 'Invalid OTP' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to verify OTP' });
    }
  });
  
 
app.listen(4000, ()=>{
    console.log("Server Running In port 4000")
})
   