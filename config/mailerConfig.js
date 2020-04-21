/**
 * Created by saad.sami on 1/8/2018.
 */

const nodemailer = require('nodemailer');
// mailerController = require('../controllers/config/mailTransportController');

// console.log('fuck')
// Setting up smtpTransport for email

// var smtpTransport;
var smtpTransport = nodemailer.createTransport({
    //service: "Hotmail",  // sets automatically host, port and connection security settings
    host: 'uksrv.vservices.com',
    port: 465,
    auth: {
        user: "noreply@eventspmo.com",
        pass: "@lusOF{%STvS"
    }
});

// setup e-mail data with unicode symbols
var mailOptions = {
    from: '"Belief Challenge" <noreply@belifechallenge.com>', // sender address
    to: '', // list of receivers
    subject: '', // Subject line
    text: '', // plaintext body
    html: ''//'<b>Password Changed!</b>' // html body
};

function fetchMailTransport(res, callback) {
    console.log('loaded!')

    smtpTransport = nodemailer.createTransport({
        //service: "Hotmail",  // sets automatically host, port and connection security settings
        host: 'uksrv.vservices.com',
        port: 465,
        auth: {
            user: "noreply@eventspmo.com",
            pass: "@lusOF{%STvS"
        }
    });

    callback();


}

fetchMailTransport('', function () {
    console.log('Mail transport loaded!')
});

async function sendMail(res, data) {
    /* send mail to receiver*/
    // mailOptions.to = data.to;
    // mailOptions.subject = data.subject;
    // mailOptions.html = data.templateUrl;
    // mailOptions.html = data.html;

    let transporter = nodemailer.createTransport({
        //service: "Hotmail",  // sets automatically host, port and connection security settings
        host: 'uksrv.vservices.com',
        port: 465,
        auth: {
            user: "noreply@eventspmo.com",
            pass: "@lusOF{%STvS"
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    // console.log(transporter.sendMail({
    //     from: '"believ Challenge" <noreply@eventspmo.com>', // sender address
    //     to: "zain.ahmed199524@gmail.com", // list of receivers
    //     subject: 123, // Subject line
    //     html: `<h2>abc</h2>` // html body
    // }))
    let info = await transporter.sendMail({
        from: '"Belief Challenge <noreply@eventspmo.com>', // sender address
        to: data.to, // list of receivers
        subject: data.subject, // Subject line
        html: data.html // html body
    });

    return info
}

function sendBulkEmails(res, data) {
    /* send bulk mails to receivers */
    mailOptions.to = data.to;
    mailOptions.subject = data.subject;
    mailOptions.html = data.html;

    // fetchMailTransport(res, function(){
    smtpTransport.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log('mail error: ', err)
        } else {
            if (info['accepted'].length) {
                console.log('Mail Sent! to', info['accepted'][0])
            } else {
                console.log('Mail Rejected: ', info.rejected)
            }
        }
    });
    // })
}

exports.sendBulkEmailsFN = sendBulkEmails;

exports.sendMailFN = sendMail;