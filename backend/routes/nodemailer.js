const express = require("express")
const nodemailer = require("nodemailer")
const app = express()
const router = express.Router()

app.use(express.json())
app.use(express.urlencoded())

const transporter  =  nodemailer.createTransport( {
    service : "hotmail",
    port: 587,
    auth : {
        user : "nodetest-5ACE85C5-3-DAC0F69-@outlook.com",
        pass : "znd,vzjmdi490m<*#&@#^%sod"
    }
})

const options = {
    from : "nodetest-5ACE85C5-3-DAC0F69-@outlook.com",
    to : "pradipvala400@gmail.com",
    subject : "SUCCESSFULLY LOGGIN",
    text : "You are successfully logged in"
}

const sendMail = (userData) => {
    console.log(userData.email)
    
    options.to = 'pradipvala400@gmail.com';

    transporter.sendMail(options , function (err , info) {
        if(err){
            console.log(err)
        }
        else {
            console.log("Send : "  , info.response)
        }
    })
}

module.exports = { sendMail }
