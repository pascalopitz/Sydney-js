var Promise = require('promise');
var readline = require('readline');

// XDI stuff

var xdi = require('xdi');

var XDI_DISCOVERY = "https://xdidiscoveryservice.xdi.net/";
var XDI_ROOT_SERVICES = ["<$https><$connect><$xdi>"];

function discovery(name) {

  console.log('Discovery started ...');

  var promise = new Promise(function (resolve, reject) {
    xdi.discovery(
      name,
      function (res) {
        console.log('Discovery finished ...');
        resolve(res);
      },
      reject,
      XDI_ROOT_SERVICES,
      XDI_DISCOVERY
    );
  });

  return promise;
}


function message(msg) {
  return function (d) {

    var promise = new Promise(function (resolve, reject) {

      var message = xdi.message(d.cloudNumber());
      message.toAddress('(' + d.cloudNumber() + ')');
      message.linkContract('('+d.cloudNumber()+'/$public)$do');
      message.operation('$get', d.cloudNumber()+msg);

      console.log('Message sent ...');

      message.send(
        d.xdiEndpoint(),
        function (res) {
          console.log('Message received ...');
          resolve(res);
        },
        resolve,
        reject
      );
    });

    return promise;
  }
}


// CLI execution stuff

function ask() {
  console.log('Please type in ' + requiredValues[0]);
}

var requiredValues = [
  'cloudname',
  // 'password'
];
var inputValues = {};

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', function (val) {
  var token = requiredValues.shift();
  inputValues[token] = val;

  if(!requiredValues.length) {
    rl.close();
    console.log('Thanks ... performing request');

    discovery(inputValues.cloudname)
      .then(function (d) {
        message('$msg$sig$keypair<$public><$key>')(d).then(function (response) {
          console.log('finish', response.statements());
        });
      });

  } else {
    ask();
  }
});

console.log('Hello, input required:');
ask();