'use strict'

// led code
var wpi = require('wiring-pi');

// GPIO pin of the led
var configPin = 7;
// Blinking interval in usec
var configTimeout = 1000;

wpi.setup('wpi');
wpi.pinMode(configPin, wpi.OUTPUT);

var isLedOn = 0;



// beacon code
const Bleacon = require('bleacon')
const startedAt = new Date().getTime()

function isBean(beacon) {
  return beacon.uuid.match('^a495....c5b14b44b5121370f02d74de$')
}

function pad(str, len) {
  while (str.length < len) {
    str = '0' + str
  }
  return str
}

Bleacon.on('discover', (beacon) => {
  const elapsed = new Date().getTime() - startedAt
  const uuid = beacon.uuid
  const major = pad(beacon.major.toString(16), 4)
  const minor = pad(beacon.minor.toString(16), 4)
  let info = `${elapsed}: ${uuid} | ${major} | ${minor}`
  if (isBean(beacon)) {
    // success!!! detected the bean
    info += ' <-- Bean!'
    // detected bean, turn on led
    isLedOn = +!isLedOn;
  	wpi.digitalWrite(configPin, isLedOn );
  }
  console.log(info)
})
Bleacon.startScanning()

console.log('0: Listening for iBeacons...')
