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

  firebase.child('peaks')
    .orderByChild('time')
    .startAt(moment().utcOffset(-480).format('YYYY-MM-DD HH:mm'))
    .endAt(moment().utcOffset(-480).add(1, 'hours').format('YYYY-MM-DD HH:mm'))
  .on('value', function(snapshot) {
    const events = snapshot.val();

    if (!events) {
      console.log(events, process.env.FIREBASE_URL);
      return false;
    }

    const eventsText = Object.keys(events)
    .sort(function(prev, next) {
      return formatDate(prev.time).isBefore(formatDate(next.time)) ? -1 : 1;
    })
    .map(function(eventId) {
      const event = events[eventId];

      return `maps.google.com/?q=${event.lat},${event.long} @ ${moment(event.time).format('hh:mmA')}`
    }).join('\n');

    firebase.child('users').on('value', function(snapshot) {
      const users = snapshot.val();
      console.log(eventsText);
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
