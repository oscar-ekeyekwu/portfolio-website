// your routes here
const router = require('express').Router();
const { check, validationResult, matchedData } = require('express-validator');

const nodemailer = require('nodemailer');

require('dotenv').config();


router.get('/', function (req, res, next) {
  res.render('index');
});

router.post('/contact', function(req, res, next){

  const {name, email, message} = req.body;

  var mail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });

  var mailOptions = {
    from: process.env.SMTP_SENDER,
    to: email,
    subject: 'Ekeyekwu Oscar Portfolio Response',
    text: 'Thank you for reaching out. I will be in touch shortly'
  };

  mail.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      req.flash('error', 'Mail not sent try again')
      res.redirect('/');
    } else {
      console.log('Email sent: ' + info.response);
      req.flash('success', 'Thank you for reaching out');
      res.redirect('/');
    }
});
});


module.exports = router;
