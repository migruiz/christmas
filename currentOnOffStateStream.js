const { Observable,merge,timer, interval, of } = require('rxjs');
const { mergeMap, first, withLatestFrom, map,share,shareReplay, filter,mapTo,take,debounceTime,throttle,throttleTime, startWith, takeWhile, delay, scan, distinct,distinctUntilChanged, tap, flatMap, takeUntil, toArray, groupBy, concatMap} = require('rxjs/operators');


const { dayTimeStream }= require('./dayTimeStream')




const masterSwitchSensor = new Observable(async subscriber => {  
    var mqttCluster=await mqtt.getClusterAsync()   
    mqttCluster.subscribeData('zigbee2mqtt/0x84ba20fffecacbc4', function(content){   
            subscriber.next(content)
    });
  });

  const masterSwitchStream = masterSwitchSensor.pipe(
    filter( c=> c.action==='on' || c.action==='brightness_stop' || c.action==='brightness_move_up')
  )





const currentOnOffStream = merge(masterSwitchStream,dayTimeStream).pipe(
    map((event) => {
        if (event.action==='off_alarm') return {type:event.action, lightsTurnedOn:event.lightsTurnedOn}
        if (event.action==='on_alarm') return {type:event.action, lightsTurnedOn:event.lightsTurnedOn}
        if (event.action==='on') return {type:event.action, lightsTurnedOn:true}
        if (event.action==='brightness_stop') return {type:event.action, lightsTurnedOn:false}
        if (event.action==='brightness_move_up') return {type:event.action, lightsTurnedOn:false }        
    }),
    startWith({type:'init', lightsTurnedOn:false}),
    share()
)
const lastEmissionOnOffStream = currentOnOffStream.pipe(shareReplay(1))

module.exports.currentOnOffStream =  currentOnOffStream
module.exports.lastEmissionOnOffStream =  lastEmissionOnOffStream