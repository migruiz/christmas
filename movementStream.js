const { Observable,merge,timer, interval, of } = require('rxjs');
const { mergeMap, first, withLatestFrom, map,share,shareReplay, filter,mapTo,take,debounceTime,throttle,throttleTime, startWith, takeWhile, delay, scan, distinct,distinctUntilChanged, tap, flatMap, takeUntil, toArray, groupBy, concatMap} = require('rxjs/operators');
var mqtt = require('./mqttCluster.js');
const GROUND_FLOOR_SENSOR_TOPIC = 'zigbee2mqtt/0x00158d000566c0cc'
const LIOVING_ROOM_SENSOR_TOPIC = 'zigbee2mqtt/0x00156456'

const KEEPLIGHTONFORSECS = parseInt(20 * 1000)

const groundfloorSensorStream = new Observable(async subscriber => {  
    var mqttCluster=await mqtt.getClusterAsync()   
    mqttCluster.subscribeData(GROUND_FLOOR_SENSOR_TOPIC, function(content){  
        if (content.occupancy){      
            subscriber.next({content})
        }
    });
});
const livingRoomSensorStream = new Observable(async subscriber => {  
    var mqttCluster=await mqtt.getClusterAsync()   
    mqttCluster.subscribeData(LIOVING_ROOM_SENSOR_TOPIC, function(content){        
        if (content.occupancy){      
            subscriber.next({content})
        }
    });
});






module.exports.getMovementStream = function({lastEmissionOnOffStream}){

    const sensorSharedStreams = merge(groundfloorSensorStream, livingRoomSensorStream).pipe(share())

    const lightsOffStream = sensorSharedStreams.pipe(
        debounceTime(KEEPLIGHTONFORSECS),
        mapTo({type:'movement_off'}),
        )
    const lightsOnStream = sensorSharedStreams.pipe(
        mapTo({type:'movement_on'}),
    )
    
    const movementStream = merge(lightsOnStream, lightsOffStream)

    return movementStream.pipe(
        withLatestFrom(lastEmissionOnOffStream),
        map(([movement, onOffState]) =>  ({type:movement.type, lightsTurnedOn: movement.type==='movement_on' ? onOffState.lightsTurnedOn : false})),
    )

}

