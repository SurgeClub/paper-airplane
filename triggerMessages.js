const Firebase = require('firebase');
const moment = require('moment');
const sinchSms = require('sinch-sms')({
	key: process.env.SINCH_KEY,
	secret: process.env.SINCH_SECRET
});

module.exports = function() {
  console.log('TIME ON SERVER', moment().utcOffset(-480).format('LLLL'));

  const firebase = new Firebase(process.env.FIREBASE_URL);

  function parseDate(date) {
    return parseInt(date.format('YYYYMMDDHHmm'), 10);
  };

  function formatDate(dateNum) {
    const dateString = String(dateNum);

    return moment(`${dateString.slice(0, 8)}T${dateString.slice(8)}`);
  };

  firebase.child('events')
    .orderByChild('startTime')
    .startAt(parseDate(moment().utcOffset(-480)))
    .endAt(parseDate(moment().utcOffset(-480).add(2, 'days')))
  .on('value', function(snapshot) {
    const events = snapshot.val();

    if (!events) {
      console.log(events, process.env.FIREBASE_URL);
      return false;
    }

    const eventsText = Object.keys(events)
    .sort(function(prev, next) {
      return formatDate(prev.startTime).isBefore(formatDate(next.startTime)) ? -1 : 1;
    })
    .map(function(eventId) {
      const event = events[eventId];

      return `${event.category}: ${formatDate(event.startTime).format('hh:mmA')}\n${event.address}`
    }).join('\n');

    firebase.child('users').on('value', function(snapshot) {
      const users = snapshot.val();

      Object.keys(users).map(function(userId) {
        const user = users[userId];

        console.log(`Sending to ${user.phoneNumber}`);
        sinchSms.send(`+1${user.phoneNumber}`, eventsText).then(function(response) {
        	//All good, response contains messageId
        	console.log(response);
        }).fail(function(error) {
        	// Some type of error, see error object
        	console.log(error);
        });
      });
    });
  });
}
