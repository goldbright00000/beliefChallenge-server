
/**
 * Created by saad.sami on 2/12/2018.
 */

var moment = require('moment');
var moment_timezone = require('moment-timezone');

// let zone = moment.parseZone("2015-01-02T23:00:00-04:00").format("Z");
// let date = moment()
// let today = date.format()
// console.log(today)

// console.log(moment.parseZone("2015-01-02T23:00:00-04:00").format("Z"))
// console.log(moment_timezone.tz('America/Los_Angeles').format("Z"))
/**
 * @function @validateDuration
 * @description validate if current time is between duration with all time zone differences
 * @requires startDate(Date-ISOString) endDate(Date-ISOString) today(Date with timezone) clientTimezone(String)
 * */
exports._validateDuration = function (startDate, endDate, today, clientTimezone) {

    //var serverTimezone = moment.tz.guess();

    var startDateTz = moment(startDate).tz(clientTimezone);
    var endDateTz = moment(endDate).tz(clientTimezone);

    var isBetween = moment(today).isBetween(startDateTz, endDateTz);
    return isBetween;
};

/**
 * @function @daysLeft
 * @description returns days left between today and provided date
 * @requires eventDate(Date-ISOString) clientTimezone(String)
 * */
exports._daysLeft = (matchDate, clientTimezone) => {
    var today = moment(new Date().toISOString()).tz(clientTimezone);
    var matchDate = moment(matchDate).tz(clientTimezone);
    return matchDate.diff(today, 'days')
};

/**
 * @function @durationElapse
 * @description returns duration elapsed in milliseconds
 * @requires date(Date-ISOString) clientTimezone(String)
 * */
exports._durationElapse = function (date, clientTimezone) {
    var now = moment(new Date().toISOString()).tz(clientTimezone); //today's date
    var end = moment(date).tz(clientTimezone); // another date
    var duration = moment.duration(now.diff(end));
    return duration._milliseconds;
};

/**
 * @function @combineDateAndTime
 * @description combine date and time isoStrings
 * @requires date(Date-ISOString) time(Date-ISOString)
 * */
exports._combineDateAndTime = function (date, time) {
    date = new Date(date);
    time = new Date(time);
    var timeString = time.getHours() + ':' + (time.getMinutes()) + ':' + time.getSeconds();
    var dateString = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getUTCDate();
    var combined = moment(`${dateString} ${timeString}`, 'YYYY-MM-DD HH:mm:ss').toISOString();
    return combined;
};

/**
 * @function @dateFormatter
 * @description return formatted date from iso-string
 * @requires date(Date-ISOString)
 * */
exports._dateFormatter = function (date) {
    date = new Date(date);
    var dateString = date.getFullYear() + '-' + (date.getMonth() + 1 < 9 ? '0' + date.getMonth() : date.getMonth()) + '-' + (date.getUTCDate() < 9 ? '0' + date.getUTCDate() : date.getUTCDate());
    return dateString;
}

/**
 * @function @timeFormatter
 * @description return formatted time from iso-string
 * @requires time(Date-ISOString)
 * */
exports._timeFormatter = function (time) {
    time = new Date(time);
    var timeString = (time.getHours() < 9 ? '0' + time.getHours() : time.getHours()) + ':' + (time.getMinutes() < 9 ? '0' + time.getMinutes() : time.getMinutes());
    return timeString;
}