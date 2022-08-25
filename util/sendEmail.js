const nodemailer = require("nodemailer");
const { GOOGLESECRET } = require('./config')

const sendEmail = (email, password) => {
    const smtpConfig = {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL, 
        // you can try with TLS, but port is then 587
        auth: {
            user: 'klimko.dzmitry@gmail.com', // Your email id
            pass: GOOGLESECRET // Your password
        }
    };

    const transporter = nodemailer.createTransport(smtpConfig);
    // replace hardcoded options with data passed (somedata)
    var mailOptions = {
        from: 'gpsolutions@gmail.com',
        to: email,
        subject: ' Password changed', // Subject line
        text: `Your password has been changed. 
        Use your secret code:
        
        ${password} `
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            return false;
        } else {
            console.log('Message sent: ' + info.response);
            return true;
        };
    });
};

module.exports = sendEmail