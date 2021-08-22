// your routes here
const router = require('express').Router();
const { check, validationResult, matchedData } = require('express-validator');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const nodemailer = require('nodemailer');

require('dotenv').config();


const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "https://developers.google.com/oauthplayground/"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
  });

  
  let accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        reject("Failed to create access token :(");
      }
      resolve(token);
    })
  }).catch(error=>{
      console.log(error);      
  });



  // accessToken = "ya29.a0ARrdaM9gMeDSYHNQAXoxic6k3qDSlyF0qfQqzEz__JsktNQrYZGIGtiz-YTDL27CXLJ29kujJ8Ht00DKEet_nI7UrlyRDKQOL94yVCBatiTvjalCWo2q911TUBLc5oG1IP5wXIz58O1nBTjzvSGEQ9TRBv-j";
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.SMTP_USER,
      accessToken: accessToken,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      tls: {
        rejectUnauthorized: false
      }
    }
    
  });

  return transporter;
};

const sendMail = async (emailOptions) => {
  let transporter = await createTransporter();
  await transporter.sendMail(emailOptions);
}

router.get('/', function (req, res, next) {
  res.render('index');
});

router.post('/contact',[
    check('name')
      .isLength({ min: 1 })
      .withMessage('Name is required')
      .trim(),
    check('email')
      .isEmail()
      .withMessage('Enter a Valid Email Address')
      .bail()
      .trim()
      .normalizeEmail(),
  ], async function(req, res, next){

  const {name, email, message} = req.body;
  
   const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error', 'Fill in all fields');
      res.redirect('/');
    }

  // var mail = nodemailer.createTransport({
  //   service: 'gmail',
  //   auth: {
  //     user: process.env.SMTP_USER,
  //     pass: process.env.SMTP_PASSWORD
  //   }
  // });

  let mailOptions = {
    from: process.env.SMTP_SENDER,
    to: email,
    subject: 'Ekeyekwu Oscar Portfolio Response',
    text: 'Thank you for reaching out. I will be in touch shortly'
  };

  // sendMail(mailOptions);

  let transporter = await createTransporter();
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      req.flash('error', 'Mail not sent try again');
      res.redirect('/');
    } else {
      console.log('Email sent: ' + info.response);
      req.flash('success', 'Thank you for reaching out');
      res.redirect('/');
    }
  });
});


module.exports = router;
