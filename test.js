var xdi = require('xdi');
var Promise = require('promise');

var XDI_DISCOVERY = "https://xdidiscoveryservice.xdi.net/";
var XDI_ROOT_SERVICES = ["<$https><$connect><$xdi>"];


function discovery(name) {
  var promise = new Promise(function (resolve, reject) {
    xdi.discovery(
      name,
      resolve,
      reject,
      XDI_ROOT_SERVICES,
      XDI_DISCOVERY
    );
  });

  return promise;
}


if(!process.argv[2]) {
  console.log('Usage: test.js =mycloudname');
  process.exit();
}

discovery(process.argv[2]).then(function (discovery) {
  console.log('CLOUD NUMBER', discovery.cloudNumber());
  console.log('XDI ENDPOINT', discovery.xdiEndpoint());
  for (var i in discovery.services()) {
    console.log('SERVICE: ', i,  discovery.services()[i]);
  }
}, function (err) {
  console.log('Error', err);
});
