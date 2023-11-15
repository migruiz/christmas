const { Observable, merge } = require('rxjs');
const { mapTo, share, filter } = require('rxjs/operators');
const CronJob = require('cron').CronJob;

const SUNSET_HOUR = parseInt(16)
const SLEEP_HOUR = parseInt(23)


const everyHourStream = new Observable(subscriber => {
    new CronJob(
        `0 * * * *`,
        function () {
            subscriber.next(DateTime.now());
        },
        null,
        true,
        'Europe/Dublin'
    );
});
const sharedHourStream = everyHourStream.pipe(share())
const sleepStream = sharedHourStream.pipe(
    filter(datetime => datetime.hour === SLEEP_HOUR),
    mapTo({ type: 'sleep' })
)
const sunSetStream = sharedHourStream.pipe(
    filter(datetime => datetime.hour === SUNSET_HOUR),
    mapTo({ type: 'sunSet' })
)



module.exports.dayTimeStream = merge(sleepStream, sunSetStream)