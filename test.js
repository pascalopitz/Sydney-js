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


function message(op, msg) {
  return function (d) {

    var promise = new Promise(function (resolve, reject) {

      var from = d.cloudNumber();
      var to = d.cloudNumber();

      var message = xdi.message(from);
      message.toAddress('(' + to + ')');

      // link contract: (from/to)$do
      message.linkContract('('+from+'/'+to+')$do');

      // msg: to+msg
      message.operation(op, to+msg);

      // plaintext password
      message.secretToken(inputValues.password);

      console.log('Message sending ...');
      console.log(xdi.io.write(message.messageEnvelope().graph()));

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
  'password'
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
        // fetch private key
        // message('$get', '$msg$encrypt$keypair<$private><$key>')(d).then(function (response) {
        //   console.log('finish', response.statements());
        // });

        // set foo
        // message('$set', '<#foo>&/&/"bar"')(d).then(function (response) {
        //   console.log('finish', response.statements());
        // });

        // get foo
        message('$get', '<#foo>')(d).then(function (response) {
          console.log('finish', response.statements());
        });
      }, function(err) {
        console.log(err);
      });

  } else {
    ask();
  }
});


// get public sign key
// '$msg$sign$keypair<$public><$key>'

// get private sign key
// '$msg$sign$keypair<$private><$key>'

// get public enc key
// '$msg$encrypt$keypair<$public><$key>'

// get private enc key
// '$msg$encrypt$keypair<$private><$key>'


console.log('Hello, input required:');
ask();