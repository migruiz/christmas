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
    map((curr) => {
        if (curr.action==='date_time') return {triggeredBy:'timeOfDay', lightsTurnedOn:curr.lightsTurnedOn}
        if (curr.action==='on') return {triggeredBy:'device', lightsTurnedOn:true}
        if (curr.action==='brightness_stop') return {triggeredBy:'device', lightsTurnedOn:false}
        if (curr.action==='brightness_move_up') return {triggeredBy:'device', lightsTurnedOn:false }
        return {triggeredBy:'init', lightsTurnedOn:false}
        
    }),
    share()
)
const lastEmissionOnOFFStream = currentOnOffStream.pipe(shareReplay(1))

module.exports.currentOnOffStream =  currentOnOffStream
module.exports.lastEmissionOnOFFStream =  lastEmissionOnOFFStream