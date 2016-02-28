require('dotenv').load();
const schedule = require('node-schedule');

const triggerMessages = require('./triggerMessages');

console.log('------------App started----------------');

schedule.scheduleJob('*/1 * * * *', function() {
  console.log('Job scheduled');
  triggerMessages();
});
