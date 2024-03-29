const { Observable,merge,timer, interval, of } = require('rxjs');
const { mergeMap, first, withLatestFrom, map,share,shareReplay, filter,mapTo,take,debounceTime,throttle,throttleTime, startWith, takeWhile, delay, scan, distinct,distinctUntilChanged, tap, flatMap, takeUntil, toArray, groupBy, concatMap} = require('rxjs/operators');
var mqtt = require('./mqttCluster.js');






const masterSwitchSensor = new Observable(async subscriber => {  
    var mqttCluster=await mqtt.getClusterAsync()   
    mqttCluster.subscribeData('zigbee2mqtt/0x2c1165fffecad895', function(content){   
            subscriber.next(content)
    });
  });


  const masterSwitchStream = masterSwitchSensor.pipe(
    filter( c=> c.action==='on' || c.action==='off' || c.action==='brightness_move_down' || c.action==='brightness_move_up'),
    map((event) => {
      if (event.action==='on') return  {type:'masterOn'}
      if (event.action==='brightness_move_up') return  {type:'masterOn'}
      if (event.action==='off') return  {type:'masterOff'}      
      if (event.action==='brightness_move_down') return  {type:'masterOff'}      
  }),
  )

module.exports.masterSwitchStream =  masterSwitchStream