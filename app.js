const { share } = require('rxjs/operators');
const { Observable,merge,timer, interval, of } = require('rxjs');
var mqtt = require('./mqttCluster.js');
const { currentOnOffStream, lastEmissionOnOffStream } = require('./currentOnOffStateStream');
const { getMovementStream }  = require('./movementStream')

global.mtqqLocalPath = 'mqtt://192.168.0.11'



console.log(`starting xmas lights current time ${new Date()}`)




const movementStream = merge(currentOnOffStream,getMovementStream({lastEmissionOnOffStream}))



movementStream.subscribe(async m => {
   // (await mqtt.getClusterAsync()).publishMessage('zigbee2mqtt/0x0c4314fffe20d4f8/set',JSON.stringify({state:m.lightsTurnedOn?'ON':'OFF'}));
    console.log('overall', m);
})