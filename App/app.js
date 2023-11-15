const { scan, filter } = require('rxjs/operators');
const { Observable, merge, timer, interval, of } = require('rxjs');
var mqtt = require('./mqttCluster.js');
const { masterSwitchStream } = require('./currentOnOffStateStream');
const { movementStream } = require('./movementStream')
const { dayTimeStream } = require('./dayTimeStream')

global.mtqqLocalPath = 'mqtt://192.168.0.11'



console.log(`starting xmas lights current time ${new Date()}`)




const combinedStream = merge(masterSwitchStream, movementStream, dayTimeStream).pipe(
    scan((acc, curr) => {
        if (curr.type === 'masterOn') return { type: curr.type, masterState: true, actionState: true }
        if (curr.type === 'masterOff') return { type: curr.type, masterState: false, actionState: false }
        if (curr.type === 'sleep') return { type: curr.type, masterState: false, actionState: false }
        if (curr.type === 'sunSet') return { type: curr.type, masterState: true, actionState: true }
        if (curr.type === 'auto') return { type: acc.masterState ? curr.type : 'omit', masterState: acc.masterState, actionState: curr.value }

    }, { masterState: false, actionState: false, type: 'init' }),
    filter(e => e.type !== 'omit')

);





combinedStream.subscribe(async m => {
    console.log('overall', m);
    //(await mqtt.getClusterAsync()).publishMessage('zigbee2mqtt/0x385b44fffee7a042/set',{state:m});
    (await mqtt.getClusterAsync()).publishMessage('zigbee2mqtt/0xa4c1388e3fe8b3b1/set', JSON.stringify({ state: m.actionState ? "ON" : "OFF" }));
    //(await mqtt.getClusterAsync()).publishMessage('zigbee2mqtt/0xa4c138b23751a6d9/set',{state:m});
})