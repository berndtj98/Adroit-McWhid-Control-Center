// Get references to UI elements
let connectButton = document.getElementById('connect');
let disconnectButton = document.getElementById('disconnect');
let terminalContainer = document.getElementById('terminal');
let sendForm = document.getElementById('send-form');
let inputField = document.getElementById('input');
let sensitivityInput = document.getElementById('sliderRange'); //get number from slider (Device 1)
let applyButton = document.getElementById('applySensitivity'); //get button press from slider apply button (Device 1)
let device1Position = document.getElementById('device1Placement'); // get dropdown input 1 (Device 1)
let applyButton2 = document.getElementById('applyDevice1Placement'); //get button press from position apply button (Device 1)
let sensitivityInput2 = document.getElementById('sliderRange2'); //get number from slider 2 (Device 2)
let applyButton3 = document.getElementById('applySensitivity2'); //get button press from slider 2 apply button (Device 2)
let device2Position = document.getElementById('device2Placement'); //get dropdown input 2 (Device 2)
let applyButton4 = document.getElementById('applyDevice2Placement'); //get button press from position 2 apply button (Device 2)
var slider_data;
var slider_2_data;
var placement_1_data;
var placement_2_data;

var UUID_SERVICE_SETTINGS = 0xB000;
var UUID_CHAR_SENSITIVITY = 0xB001;
var UUID_CHAR_POSITION_ONE = 0xB002;
var UUID_CHAR_POSITION_TWO = 0xB003;
var UUID_CHAR_SENSITIVITY_TWO = 0xB004;

// Connect to the device on Connect button click
connectButton.addEventListener('click', function () {
  connect();
});

// Disconnect from the device on Disconnect button click
disconnectButton.addEventListener('click', function() {
  disconnect();
});


// Apply button click
applyButton.addEventListener('click', function () {
    apply();
});

// Apply 2 button click
applyButton2.addEventListener('click', function () {
    apply2();
});

// Apply 3 button click
applyButton3.addEventListener('click', function () {
    apply3();
});

// Apply 4 button click
applyButton4.addEventListener('click', function () {
    apply4();
});

// Handle form submit event
sendForm.addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent from sending
  send(inputField.value); // Send text field contents
  inputField.value = '';  // Zero text field
  inputField.focus();     // Focus on text field
});

// Selected device object cache
let deviceCache = null;

// Characteristic object cache
let characteristicCache = null;

// Intermediate buffer for incoming data
let readBuffer = '';


function apply() {
    log('Apply button pressed');
    log('Device 1 Sensitivity value set to ' + sensitivityInput.value + ', silly goose!');
    event.preventDefault(); // Prevent from sending
    sendSensitivity(sensitivityInput.value); // Send text field contents
    //inputField.value = '';  // Zero text field
    sensitivityInput.focus();     // Focus on text field

    slider_data.writeValue(Uint8Array.of(sensitivityInput.value));
}

function apply2() {
    log('Apply button pressed');
    log('Device 1 Placement set to ' + device1Position.value + ', silly goose!');
    event.preventDefault(); // Prevent from sending
    sendPosition1(device1Position.value); // Send text field contents
    //inputField.value = '';  // Zero text field
    device1Position.focus();     // Focus on text field

    if (device1Position.value == 'head')
        placement_1_data.writeValue(Uint8Array.of(0x01));

    if (device1Position.value == 'wrist')
        placement_1_data.writeValue(Uint8Array.of(0x02));

    if (device1Position.value == 'hand')
        placement_1_data.writeValue(Uint8Array.of(0x03));

    
}

function apply3() {
    log('Apply button pressed');
    log('Device 2 Sensitivity value set to ' + sensitivityInput2.value + ', silly goose!');
    event.preventDefault(); // Prevent from sending
    sendSensitivity2(sensitivityInput2.value); // Send text field contents
    //inputField.value = '';  // Zero text field
    sensitivityInput2.focus();     // Focus on text field

    slider_2_data.writeValue(Uint8Array.of(sensitivityInput2.value));
}

function apply4() {
    log('Apply button pressed');
    log('Device 2 Placement set to ' + device2Position.value + ', silly goose!');
    event.preventDefault(); // Prevent from sending
    sendPosition2(device2Position.value); // Send text field contents
    //inputField.value = '';  // Zero text field
    device2Position.focus();     // Focus on text field

    if (device2Position.value == 'wrist2')
        placement_2_data.writeValue(Uint8Array.of(0x01));

    if (device2Position.value == 'ankle2')
        placement_2_data.writeValue(Uint8Array.of(0x02));

    if (device2Position.value == 'leg2')
        placement_2_data.writeValue(Uint8Array.of(0x03));
}


// Launch Bluetooth device chooser and connect to the selected
function connect() {
  return (deviceCache ? Promise.resolve(deviceCache) :
      requestBluetoothDevice()).
      then(device => connectDeviceAndCacheCharacteristic(device)).
      catch(error => log(error));
}

// Запрос выбора Bluetooth устройства
function requestBluetoothDevice() {
  log('Requesting bluetooth device...');

  return navigator.bluetooth.requestDevice({
      filters: [{ name: 'McWhid - Mouse'}],
      optionalServices: [UUID_SERVICE_SETTINGS]
  }).
      then(device => {
        log('"' + device.name + '" bluetooth device selected');
        deviceCache = device;
        deviceCache.addEventListener('gattserverdisconnected',
            handleDisconnection);

        return deviceCache;
      });
}

// Обработчик разъединения
function handleDisconnection(event) {
  let device = event.target;

  log('"' + device.name +
      '" bluetooth device disconnected, trying to reconnect...');

  connectDeviceAndCacheCharacteristic(device).
      catch(error => log(error));
}

// Connect to the device specified, get service and characteristic
function connectDeviceAndCacheCharacteristic(device) {
  if (device.gatt.connected && characteristicCache) {
    return Promise.resolve(characteristicCache);
  }

  log('Connecting to GATT server...');

  return device.gatt.connect().
      then(server => {
        log('GATT server connected, getting service...');
          return server.getPrimaryService(UUID_SERVICE_SETTINGS);
      }).
      then(service => {
        log('Service found!');
          return service.getCharacteristic(UUID_CHAR_SENSITIVITY);
      }).

      then(characteristic => {
          slider_data = characteristic;
          characteristicCache = characteristic; 
          return characteristicCache;
      });
}

// Output to terminal
function log(data, type = '') {
  terminalContainer.insertAdjacentHTML('beforeend',
      '<div' + (type ? ' class="' + type + '"' : '') + '>' + data + '</div>');
}

// Отключиться от подключенного устройства
function disconnect() {
  if (deviceCache) {
      log('Disconnecting from "' + deviceCache.name + '" bluetooth device...');
    deviceCache.removeEventListener('gattserverdisconnected',
        handleDisconnection);

    if (deviceCache.gatt.connected) {
      deviceCache.gatt.disconnect();
      log('"' + deviceCache.name + '" bluetooth device disconnected');
    }
    else {
      log('"' + deviceCache.name +
          '" bluetooth device is already disconnected');
    }
  }

  if (characteristicCache) {
    characteristicCache.removeEventListener('characteristicvaluechanged',
        handleCharacteristicValueChanged);
    characteristicCache = null;
  }

  deviceCache = null;
}


// clone of send but data is from the slider range
function sendSensitivity(data) {
    data = String(data);

    if (!data || !characteristicCache){
        return;
    }
}

function sendSensitivity2(data) {
    data = String(data);

    if (!data || !characteristicCache) {
        return;
    }
}

function sendPosition1(data) {
    data = String(data);

    if (!data || !characteristicCache) {
        return;
    }
}

function sendPosition2(data) {
    data = String(data);

    if (!data || !characteristicCache) {
        return;
    }
}