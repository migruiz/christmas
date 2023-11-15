const { share } = require('rxjs/operators');
const { Observable,merge,timer, interval, of } = require('rxjs');
var mqtt = require('./mqttCluster.js');
const { currentOnOffStream, lastEmissionOnOffStream } = require('./currentOnOffStateStream');
const { getMovementStream }  = require('./movementStream')

global.mtqqLocalPath = 'mqtt://192.168.0.11'



console.log(`starting xmas lights current time ${new Date()}`)




const movementStream = getMovementStream()



movementStream.subscribe(async m => {   
    console.log('overall', m);
    //(await mqtt.getClusterAsync()).publishMessage('zigbee2mqtt/0x385b44fffee7a042/set',{state:m});
    (await mqtt.getClusterAsync()).publishMessage('zigbee2mqtt/0xa4c1388e3fe8b3b1/set',{state:m});
    //(await mqtt.getClusterAsync()).publishMessage('zigbee2mqtt/0xa4c138b23751a6d9/set',{state:m});
})