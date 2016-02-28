var schedule = require('node-schedule');

schedule.scheduleJob('45 * * * *', function() {
  console.log('The answer to life, the universe, and everything!');
});
schedule.scheduleJob('15 * * * *', function() {
  console.log('The answer to life, the universe, and everything!');
});

schedule.scheduleJob('30 * * * *', function() {
  console.log('The answer to life, the universe, and everything!');
});

schedule.scheduleJob('59 * * * *', function() {
  console.log('The answer to life, the universe, and everything!');
});
