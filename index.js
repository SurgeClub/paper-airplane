var schedule = require('node-schedule');

schedule.scheduleJob('5 * * * * *', function() {
  console.log('The answer to life, the universe, and everything!5');
});
schedule.scheduleJob('15 * * * * *', function() {
  console.log('The answer to life, the universe, and everything!15');
});
schedule.scheduleJob('30 * * * * *', function() {
  console.log('The answer to life, the universe, and everything!30');
});
schedule.scheduleJob('45 * * * * *', function() {
  console.log('The answer to life, the universe, and everything!45');
});
