/*
 * A sample config file to use with valmerge
 */

var config = {
    // this is the name of the column in mongodb containing the email ids
    // the mails will be sent to this address.
    email: 'email', 
    // subject of the mail. this could be a template
    subject: '{{name}} - Your status please',
    // how do we get the data
    query : {
        // name of the collection in mongodb
    	collection: 'valmerge',
        // the list of columns to fetch from mongodb collection
    	columns: [],
        // some where condition
    	where: {project:'valmerge'},
        // mongodb db object. connect to mongodb, get a db object, and set it here
    	db:{}
    },
    // how should the From appear in the email
    from: 'Project Manager<logunv@gmail.com>',
    // the html file containing the message template
    message: 'mailmerge.html',
    // should we copy the mails to someone. This can be a template
    cc:'{{manager}}',
    // if test is set to true, valmerge will not send mail, it will just display
    // each mail on the screen. This is for preview and test purpose.
    test: true,
    notify: false,
    summary: true,
    // one or more of your columns could have a Date value.
    // if it does what date format can we use?
    dateFormat: 'yyyy-MM-dd',
    // do you want the progress displayed as valmerge runs?
    progress: true,
    // we need to know the mail server details.
    // here is a sample using gmail SMTP server
    mailserver: {
    	// smtp server
        host: 'smtp.gmail.com',
        // user name %40 here is the @ sign
        user: 'logunv%40gmail.com',
        // your mail password
        passwd: passwd
    },
}
