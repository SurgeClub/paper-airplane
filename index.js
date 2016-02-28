require('dotenv').load();
const schedule = require('node-schedule');

const triggerMessages = require('./triggerMessages');

schedule.scheduleJob('*/30 * * * *', function() {
  console.log('Job scheduled');
  triggerMessages();
});
