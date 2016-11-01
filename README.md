# valmerge

Send automated personalized email to your contacts.

	A mail merge module for Node with MongoDB.

# Usage

```javascript
See test/pm-tasks.* for an example.
```

`valmerge` accepts config containing the message templates, options, smtp server, and the mongodb query details, and merges the data from the mongodb collection with the template, and sends mails. This is a mail merge program.

# Installation

    npm install valmerge

# History
0.0.6: Oct 31, 2016 - Added `logging` support. If config.log is used, valmerge will log each email record in the database.

0.0.6: Oct 31, 2016 - Added `send summary` feature. If config.summary is used, valmerge will send summary mail of each execution.

0.0.7: - Documentation update.

