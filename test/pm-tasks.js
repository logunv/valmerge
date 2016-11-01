/**
 * Test ValMerge - a sample (and test) program
 * This sends automated mails to project team members
 * asking for their status.
 */

var valmerge = require('../valmerge');

var passwd = process.env.GMAIL_PASSWD;

// set your gmail password in the GMAIL_PASSWD environment variable

if(!passwd) return console.error('Env GMAIL_PASSWD is not set');

var config = {
    email: 'email',
    subject: 'Your status on {{task}} please',
    query : {
    	collection: 'project',
    	columns: ['name', 'email', 'task', 'duedate', 'lead'],
    	where: {project:'valmerge'},
    	db:{}
    },
    from: 'Project Manager<logunv@gmail.com>',
    message: 'pm-tasks.html',
    cc:'{{lead}}',
    test: false,
    dateFormat: 'yyyy-MM-dd',
    progress: true,
    mailserver: {
        host: 'smtp.gmail.com',
        user: 'logunv@gmail.com',
        passwd: passwd
    },
    log:'valmergelog', // name of the log table
    summary: true, // do you want to receive summary email of each execution?
}

var mongo = require('mongodb').MongoClient;
var dbcon = 'mongodb://localhost:27017/valmerge';

mongo.connect(dbcon, function(err, db) {
    config.db = db;
    valmerge.runMailMerge(config, function(err, msg) {
        if(err) {
	    console.log('ValMerge Error:' + err);
        } else {
	    console.log('ValMerge:' + msg);
        }
        db.close();
    });
})

