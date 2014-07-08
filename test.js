var xdi = require('xdi');

xdi.discovery(

    '=pascalo',
    function(discovery) {
      console.log(discovery);
      // $("#discoveryresult").html("");
      // $("#discoveryresult").append("<p class='segment'>CLOUD NUMBER: " + discovery.cloudNumber() + "</p>");
      // $("#discoveryresult").append("<p class='segment'>XDI ENDPOINT: " + discovery.xdiEndpoint() + "</p>");
      // for (var i in discovery.services()) {
      //   $("#discoveryresult").append("<p class='segment'>SERVICE: " + i + " --> " + discovery.services()[i] + "</p>");
      // }
    },
    function(errorText) {
      console.log(errorText);
    },
    ["<$https><$connect><$xdi>"],
    "https://xdidiscoveryservice.xdi.net/"
  );