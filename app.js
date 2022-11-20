const { share } = require('rxjs/operators');
var mqtt = require('./mqttCluster.js');
const { currentOnOffStream, lastEmissionOnOffStream } = require('./currentOnOffStateStream');
const { getMovementStream }  = require('./movementStream')
const { getLightsStream } = require('./lighStream')

global.mtqqLocalPath = 'mqtt://192.168.0.11'



console.log(`starting stairs lights current time ${new Date()}`)




const movementStream = getMovementStream({lastEmissionOnOffStream})



movementStream.subscribe(async m => {
    console.log('overall', m);
    (await mqtt.getClusterAsync()).publishMessage('stairs/down/light',`${m.value}`)
})