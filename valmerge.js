/**
 *    Merge data from mongodb with a html document template and
 * ValMail - Mail Merge tool for Node with MongoDB.
 *    send mails to all the email ids in the data.
 *
 * (C) 2010-2016, Logu Venkatachalam, logunv@gmail.com
 * 
 * Uses:
 *     1. Automate sending personal and mass mails to your friends.
 *     2. Send request for status update to all your team members.
 *     3. send reminder to your customers for feedback
 *     4. send report cards to all your students.
 *     5. send personal happy new year greetings instead of generic
 *        message to your friends and relatives.
 **/

var fs = require('fs');
var dateformat = require('date-format');
var utils = require('./utils');

var poweredBy = '<br /><hr style="color:#f5f5f5">Powered by ValMerge<br />';
var nl = '<br />';
var hr = '<hr style="color:#F5f5f5" />';

module.exports.runMailMerge = function(config, callback) {
    try {
        validate(config, callback);
        var message = fs.readFileSync(config.message).toString();
        
        var count = 0;
        var cols = {};
        var columns = config.query.columns; 
        if(columns) {
        	cols._id = 0;
        	for(var c in columns) {
        		cols[columns[c]] = 1;
        	}
        }
        var stream = config.db.collection(config.query.collection)
               .find(config.query.where, cols).stream();

       stream.on('error', function (err) {
               callback(err);
       })
       
       stream.on('data', function (doc) {
            var html = processTemplate(config, message, doc);
            var subject = processTemplate(config, config.subject, doc);
            var cc = processTemplate(config, config.cc, doc);
            if(config.progress) {
                console.log('Sending mail to ', doc[config.email]);
            }
            
            if(config.test) {
                console.log('     To: ' + doc[config.email]);
                console.log('     Cc: ' + cc);
                console.log('Subject: ' + subject);
                console.log('Message:\n' + html);
            } else {
                count++;
                utils.email(config.mailserver, config.from, doc[config.email], subject, html + poweredBy, cc);
                if(config.log) {
                	// log the record to logs collection
                	var logrec = {
                		template: config.message,
                		to: doc[config.email],
                		cc: cc,
                		subject: subject,
                		timestamp: new Date()
                	};
                	config.db.collection(config.log).insert(logrec, function() {
                		console.log('Row inserted');
                	});
                }
            }
       })
       
       stream.on('end', function () {
    	   if(config.summary) {
    	       var summary = fs.readFileSync(__dirname + '/summary.html').toString();
    	       var summaryData = {
    	    		   template:config.message, subject:config.subject, 
    	    		   timestamp: new Date(), count:count, message:message,
    	       };
    	       var html = processTemplate(config, summary, summaryData);
               utils.email(config.mailserver, config.from, config.from, 
            		   'ValMerge execution summary:' + config.message, html + poweredBy);    		   
    	   }
            callback(null, 'Sent ' + count + ' mail(s).');
       })
       
    } catch(err) {
        callback(err);
    }
}

function validate(config, callback) {
    var errors = require('./errors');
    if(!config) throw errors.invalidConfig;
    if(!config.email) throw errors.missingEmail;
    if(!config.message) throw errors.missingMessage;
    if(!config.query || !config.query.db || !config.query.collection) 
    	throw errors.missingData;
    if(!config.mailserver || !config.mailserver.host || !config.mailserver.user 
    		|| !config.mailserver.passwd) throw errors.missingMailServer;
}

/*
 * process a given [html] message template and replace {{}} with values from the given
 * row data. data should be a json object. 
 */

function processTemplate(config, template, data) {

    for(var prop in data) {
    	var val;
    	if(data[prop] instanceof Date && config.dateFormat) {
    		val = dateformat(config.dateFormat, data[prop]);
    	} else {
    		val = data[prop];
    	}
        template = template.replaceAll('{{' + prop + '}}', val);
    }
    
    return template;
   
}

String.prototype.replaceAll = function(src, dst) {
    return this.replace(new RegExp(src, 'g'), dst);
}

//
// todo: check for mail quota
// todo: automation
// todo: data support; a query instead of collection
//
