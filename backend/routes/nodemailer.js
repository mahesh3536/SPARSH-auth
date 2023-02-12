const nodemailer = require("nodemailer");

// let testAccount = await nodemailer.createTestAccount();
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "webhunters4@gmail.com",
    pass: "uhqsfcehjgqqdpke",
  },
});

const sendMail = (userData, event) => {
  console.log(userData.email);
  console.log(event);
  const options = {
    from: "webhunters4@gmail.com",
    to: userData.email,
    subject: "Successfully Registered for the event",
    text: `You are successfully registered for ${event.name} event.`,
  };

  //   options.text = `You are successfully registered for ${event} event.`;

  transporter.sendMail(options, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log("Message sent: %s", info.messageId);
    }
  });
};

module.exports = { sendMail };
