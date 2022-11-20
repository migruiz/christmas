const { Observable,merge } = require('rxjs');
const { map } = require('rxjs/operators');
const CronJob = require('cron').CronJob;

const START = parseInt(16)
const END = parseInt(22)

const endNotificationStream =  new Observable(subscriber => {      
    new CronJob(
        `0 ${END} * * *`,
       function() {
        subscriber.next({action:'on_alarm'});
       },
       null,
       true,
       'Europe/London'
   );
});
const startNotificationStream =  new Observable(subscriber => {      
    new CronJob(
        `0 ${START} * * *`,
       function() {
           subscriber.next({action:'off_alarm'});
       },
       null,
       true,
       'Europe/London'
   );
});

const dayTimeStream = merge(endNotificationStream,startNotificationStream).pipe(
    map( (m) => {
        if (m.action==='off_alarm') return { action:m.action, lightsTurnedOn: false}
        if (m.action==='on_alarm') return { action:m.action, lightsTurnedOn: true}
        }
    )
)
module.exports.dayTimeStream =  dayTimeStream