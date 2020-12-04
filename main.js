// Get references to UI elements
let connectButton = document.getElementById('connect');
let disconnectButton = document.getElementById('disconnect');
let applyButton = document.getElementById('applySensitivity'); //get button press from slider apply button (Device 1)
let terminalContainer = document.getElementById('terminal');
let sendForm = document.getElementById('send-form');
let inputField = document.getElementById('input');
let sensitivityInputX = document.getElementById('sliderRangeX');//get X number from sliderX (Device 1)
let sensitivityInputY = document.getElementById('sliderRangeY');//get Y number from sliderY (Device 1)
let device2Position = document.getElementById('device2Placement'); //get dropdown input 2 (Device 2)
//let device1Position = document.getElementById('device1Placement'); // get dropdown input 1 (Device 1)
//let applyButton2 = document.getElementById('applyDevice1Placement'); //get button press from position apply button (Device 1)
let sensitivityInput3 = document.getElementById('sliderRange3'); //get number from slider 2 (Device 2)
//let applyButton3 = document.getElementById('applySensitivity2'); //get button press from slider 2 apply button (Device 2)

//let applyButton4 = document.getElementById('applyDevice2Placement'); //get button press from position 2 apply button (Device 2)
let settingsArray = new ArrayBuffer(5);
let view = new Uint8Array(settingsArray);
var slider_data;
//var regularArray = [];
//var slider_2_data;
//var placement_1_data;
//var placement_2_data;

var UUID_SERVICE_SETTINGS = '0000ffe0-0000-1000-8000-00805f9b34fb';
var UUID_CHAR_SENSITIVITY = '0000ffe1-0000-1000-8000-00805f9b34fb';
//var UUID_CHAR_POSITION_ONE = 0xB002;
//var UUID_CHAR_POSITION_TWO = 0xB003;
//var UUID_CHAR_SENSITIVITY_TWO = 0xB004;

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

/*
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
*/

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

    view[0] = 1;
    view[1] = sensitivityInputX.value;
    view[2] = sensitivityInputY.value;
    view[3] = device2Position.value;
    view[4] = sensitivityInput3.value;

    

    log('Device Settings values set to ' + view + '.');

    event.preventDefault(); // Prevent from sending
    sendSensitivity(settingsArray); // Send text field contents
    characteristicCache.writeValue(settingsArray);

    

            //log('Device 1 Sensitivity Y value set to ' + sensitivityInputY.value + ', silly goose!');

            //event.preventDefault(); // Prevent from sending
            //sendSensitivity(sensitivityInputY.value); // Send text field contents
            //characteristicCache.writeValue(Uint8Array.of(sensitivityInputY.value));

            //await sleep(2000);
        

        
        
    
    /*
    //setTimeout(() => {
        log('Device 1 Sensitivity Y value set to ' + sensitivityInputY.value + ', silly goose!');

        event.preventDefault(); // Prevent from sending
        sendSensitivity2(sensitivityInputY.value); // Send text field contents
        slider_data.writeValue(Uint8Array.of(sensitivityInputY.value));
    //}, 4000);
    /*
    setTimeout(() => {
        log('Device 2 Placement set to ' + device2Position.value + ', silly goose!');

        event.preventDefault(); // Prevent from sending
        sendSensitivity3(device2Position.value); // Send text field contents
        slider_data.writeValue(Uint8Array.of(device2Position.value));
    }, 6000);

    setTimeout(() => {
        log('Device 2 Sensitivity value set to ' + sensitivityInput3.value + ', silly goose!');

        event.preventDefault(); // Prevent from sending
        sendSensitivity4(sensitivityInput3.value); // Send text field contents
        slider_data.writeValue(Uint8Array.of(sensitivityInput3.value));

        log('Settings applied.');
    }, 8000);
    //log('regular array is: ' + regularArray);
    /*for (var i = 0; i < 3; i++) {
        view.setUint8(i, view.charAt(i).charCodeAt());
    }*/

    //event.preventDefault(); // Prevent from sending
    //sendSensitivity(settingsArray); // Send text field contents
    //inputField.value = '';  // Zero text field
    //settingsArray.focus();     // Focus on text field

    //slider_data.writeValue(Uint8Array.of(sensitivityInput.value));
    
}

/*function apply2() {
    log('Apply button pressed');
    log('Device 1 Placement set to ' + device1Position.value + ', silly goose!');
    event.preventDefault(); // Prevent from sending
    sendPosition1(device1Position.value); // Send text field contents
    //inputField.value = '';  // Zero text field
    device1Position.focus();     // Focus on text field

    if (device1Position.value == 'head')
        placement_1_data.writeValue(Uint8Array.of(0x0001));

    if (device1Position.value == 'wrist')
        placement_1_data.writeValue(Uint8Array.of(0x0002));

    if (device1Position.value == 'hand')
        placement_1_data.writeValue(Uint8Array.of(0x0003));

    
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
        placement_2_data.writeValue(Uint8Array.of(0x0001));

    if (device2Position.value == 'ankle2')
        placement_2_data.writeValue(Uint8Array.of(0x0002));

    if (device2Position.value == 'leg2')
        placement_2_data.writeValue(Uint8Array.of(0x0003));
}*/


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
      filters: [{ name: 'McWhidCtrlBLE' }],
     
      //acceptAllDevices: true
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
    
    //log('Device 1 Sensitivity X value set to ' + data + ', silly goose!');
    if (!data || !characteristicCache) {
        
        return;
    }
}

function sendSensitivity2(data) {
    data = String(data);
    //slider_data.writeValue(Uint8Array.of(data));
    //log('Device 1 Sensitivity Y value set to ' + data + ', silly goose!');
    if (!data || !characteristicCache) {
        
        return;
    }
}

function sendSensitivity3(data) {
    data = String(data);
    //slider_data.writeValue(Uint8Array.of(data));
    //log('Device 2 Placement set to ' + data + ', silly goose!');
    if (!data || !characteristicCache) {
        
        return;
    }
}

function sendSensitivity4(data) {
    data = String(data);
    //slider_data.writeValue(Uint8Array.of(data));
    //log('Device 2 Sensitivity value set to ' + data + ', silly goose!');
    if (!data || !characteristicCache) {
        
        return;
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
