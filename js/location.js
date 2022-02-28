
const ENDPOINT = `https://nominatim.openstreetmap.org/reverse`;
const FORMAT = `jsonv2`;


function addressByCoordinates({ latitude, longitude }) {
  var data = {
      format: FORMAT,
      lat: latitude,
      lon: longitude
  };
  const result = (function() {
    var json = null;
    $.ajax({
      'async': false,
      'global': false,
      'url': ENDPOINT,
      'data': data,
      'dataType': "json",
      'success': function(data) {
        json = data;
      }
    });
    return json;
  })();
  // console.log("data.address => ",result)

  return result.address;
}

function currentAddress(callback) {
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(a) {
        // console.log(a.address)
        // console.log(a.coords)

        var coord = a.coords;
        var address = addressByCoordinates(coord);
        // console.log(address);
        callback(address);
    });
  }
}

function getCoordinates(callback) {
  var coord = "" ; 
  if(navigator.geolocation) {
    
    console.log("in if")
    navigator.geolocation.getCurrentPosition(function(a) {
        console.log(a)
        
        console.log(a.coords)

        coord = a.coords;
        callback(coord);
    }, function(err) {
      
      callback(err);
    });
  }
 
}
