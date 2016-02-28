require('dotenv').load();
const schedule = require('node-schedule');

const triggerMessages = require('./triggerMessages');

console.log('------------App started----------------');

schedule.scheduleJob('*/30 * * * *', function() {
  console.log('Job scheduled');
  triggerMessages();
});
