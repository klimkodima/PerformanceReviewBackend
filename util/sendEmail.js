const nodemailer = require('nodemailer')
const { GOOGLESECRET, USERMAIL } = require('./config')

const sendEmail = (email, password) => {
  const smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL,
    // you can try with TLS, but port is then 587
    auth: {
      user: USERMAIL, // Your email id
      pass: GOOGLESECRET // Your password
    }
  }

  const from = 'gpsolutions@gmail.com'
  const text = `Your password has been changed. 
  Use your secret code:
      
  ${password} `

  const transporter = nodemailer.createTransport(smtpConfig)
  // replace hardcoded options with data passed (somedata)
  const mailOptions = {
    from: from,
    to: email,
    subject: ' Password changed', // Subject line
    text: text
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
      return false
    } else {
      console.log('Message sent: ' + info.response)
      return true
    }
  })
}

module.exports = sendEmail