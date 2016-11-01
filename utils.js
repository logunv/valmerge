/**
 * ValMerge utility functions.
 * 
 * @param maillserver
 * @param from
 * @param to
 * @param subject
 * @param html
 * @param cc
 */

var nodemailer = require('nodemailer');

function email(mailserver, from, to, subject, html, cc) {
	var user = encodeURIComponent(mailserver.user);
	
    var transporter = nodemailer.createTransport('smtps://' + user + ':' + 
        mailserver.passwd + '@' + mailserver.host);

    var mailOptions = {
        from: from,
        to: to,
        cc:cc,
        subject: subject,
        text: html,
        html: html
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error) return console.log(error);
        console.log('Message sent: ' + info.response);
    });
}

module.exports.email = email;

