const { Observable, merge, timer, interval, of } = require('rxjs');
const { mergeMap, first, withLatestFrom, map, share, shareReplay, filter, mapTo, take, debounceTime, throttle, throttleTime, startWith, takeWhile, delay, scan, distinct, distinctUntilChanged, tap, flatMap, takeUntil, toArray, groupBy, concatMap } = require('rxjs/operators');
var mqtt = require('./mqttCluster.js');
const GROUND_FLOOR_SENSOR_TOPIC = 'zigbee2mqtt/0x00158d000566c0cc'
const LIOVING_ROOM_SENSOR_TOPIC = 'zigbee2mqtt/0x00158d00056bad56'
const KITCHEN_SENSOR_TOPTIC = 'zigbee2mqtt/0x142d41fffe24a424'

const KEEPLIGHTONFORSECS = parseInt(20 * 60 * 1000)

const groundfloorSensorStream = new Observable(async subscriber => {
    var mqttCluster = await mqtt.getClusterAsync()
    mqttCluster.subscribeData(GROUND_FLOOR_SENSOR_TOPIC, function (content) {
        if (content.occupancy) {
            subscriber.next({ content })
        }
    });
});
const livingRoomSensorStream = new Observable(async subscriber => {
    var mqttCluster = await mqtt.getClusterAsync()
    mqttCluster.subscribeData(LIOVING_ROOM_SENSOR_TOPIC, function (content) {
        if (content.occupancy) {
            subscriber.next({ content })
        }
    });
});

const kitchenSensorStream = new Observable(async subscriber => {
    var mqttCluster = await mqtt.getClusterAsync()
    mqttCluster.subscribeData(KITCHEN_SENSOR_TOPTIC, function (content) {
        if (content.occupancy) {
            subscriber.next({ content })
        }
    });
});


const sensorSharedStreams = merge(groundfloorSensorStream, livingRoomSensorStream, kitchenSensorStream).pipe(share())

const lightsOffStream = sensorSharedStreams.pipe(
    debounceTime(KEEPLIGHTONFORSECS),
    mapTo({ type: 'auto', value: false }),
    share()
)
const lightsOnStream = sensorSharedStreams.pipe(
    throttle(_ => lightsOffStream),
    mapTo({ type: 'auto', value: true }),
)

const movementStream = merge(lightsOnStream, lightsOffStream)



module.exports.movementStream = movementStream

