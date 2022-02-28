function getInfoLocalLanding() {
  result = localStorage.getItem(config.storage_name);
  result = JSON.parse(result);
  console.log(result)
  if(result == null) {
    
  }
  else {
    return result
  }

}

function getInfoLocal() {
  result = localStorage.getItem(config.storage_name);
  result = JSON.parse(result);
  console.log(result)
  if(result == null) {
    errAlert("Please verify your Information again.", '/volunteer-register')
  }
  else {
    return result
  }

}

function errAlert(errMsg, path = false) {
  alertify
  .alert('Error Message!', errMsg, function(){
    if(path) {
      window.location = path;
    }
  });
}

function getUserData() {
  result = localStorage.getItem(config.storage_name);
  result = JSON.parse(result);
  console.log(result)
  if(result == null) {
    window.location = config.path;
  }
  else {
    return result
  }
}

// // /register
// function getUserRegion(){
//   data = (function() {
//       var json = null;
//       $.ajax({
//         'async': false,
//         'global': false,
//         'url': config.api_path + "/profile/region",
//         'dataType': "json",
//         'error': function(data){
//           console.log('cant get profile with error =>',data)
//           errAlert(data.responseText, config.path);
//             // window.location = config.path;
//         },
//         'success': function(data) {
//           json = data;
//         }
//       });
//       return json;
//   })();
//   return data;
// }

function postUserName(data) {
  const result = (function() {
    var json = null;
    $.ajax({
      'type': "POST",
      'async': false,
      'global': false,
      'data' : JSON.stringify(data),
      'headers': {
          "content-type": "application/json;charset=UTF-8" 
      },
      'url': config.api_path + "/user",
      'error' : function (data) {
          console.log("err")
          console.log(data)
          errAlert(data.responseText);
      },
      'success': function(data) {
          console.log("succ")
          console.log(data)
          json = data;
      }
    });
    return json;
  })();
  return result;
}

function postVolunteerInformation(data) {
  const result = (function() {
    var json = null;
    $.ajax({
      'type': "POST",
      'async': false,
      'global': false,
      'data' : data,
      'url': config.api_path + "/volunteer",
      'dataType': "json",
      'error' : function (data) {
        errAlert(data.responseText);
        json = "error"
      },
      'success': function(data) {
        json = data;
      }
    });
    return json;
  })();
  return result;
}

// // not valid in any page
// function getVolunteerZipcode(){
//   const data = (function() {
//       var json = null;
//       $.ajax({
//         'async': false,
//         'global': false,
//         'url': config.api_path + "/volunteer/zipcode",
//         'dataType': "json",
//         'error': function(data){
//           console.log('cant get profile with error =>',data)
//           errAlert(data.responseText, config.path);
//             // window.location = config.path;
//         },
//         'success': function(data) {
//           console.log('complete =>',data)
//           json = data;
//         }
//       });
//       return json;
//   })();
//   return data;
// }


function getVolunteerProvince(){
  const data = (function() {
      var json = null;
      $.ajax({
        'async': false,
        'global': false,
        'url': config.api_path + "/volunteer/province",
        'dataType': "json",
        'error': function(data){
          console.log('cant get profile with error =>',data)
          errAlert(data.responseText, config.path);
            // window.location = config.path;
        },
        'success': function(data) {
          console.log('complete =>',data)
          json = data;
        }
      });
      return json;
  })();
  return data;
}


function getVolunteerDistrict(id) {
  const data = (function() {
    var json = null;
    $.ajax({
      'async': false,
      'global': false,
      'url': config.api_path + "/volunteer/district/?province_id="+id,
      'dataType': "json",
      'error': function(data){
        console.log('cant get profile with error =>',data)
        errAlert(data.responseText, config.path);
            // window.location = config.path;
      },
      'success': function(data) {
        console.log('complete =>',data)
        json = data;
      }
    });
    return json;
})();
return data;
}


function getDialectOption(){
    const data = (function() {
        var json = null;
        $.ajax({
          'async': false,
          'global': false,
          'url': config.api_path + "/dialect/option",
          'dataType': "json",
          'error': function(data){
            console.log('cant get profile with error =>',data)
            
            errAlert(data.responseText, config.path);
            // errAlert(data.responseText, config.path);
            // window.location = config.path;
          },
          'success': function(data) {
            json = data;
          }
        });
        return json;
    })();
    return data;
}
function getDialect(volunteer_id){
  
  // var url = config.api_path + '/dialect?volunteer_id=' + info.volunteer_id
  // var url = config.api_path + path + '?user_id=' + info.user_id + '&volunteer_id=' + info.volunteer_id + '&zipcode=' + info.zipcode
  // var url =  "https://voice.cmkl.ac.th/api/dialect?volunteer_id=30p7yPx2Zgl1lBuxBm8qvTHbnbXB5U9A" 
    const data = (function() {
        var json = null;
        $.ajax({
          'async': false,
          'global': false,
          'url': config.api_path + '/dialect?volunteer_id=' + volunteer_id,
          'dataType': "json",
          'error': function(data){
            console.log('cant get dialect with error =>',data)
            errAlert(data.responseText, '/volunteer-register');
          },
          'success': function(data) {
            console.log('complete =>',data)
            json = data;
          }
        });
        return json;
    })();
    return data;
}


function postRecord(formData) {
    return $.ajax({
        'type': "POST",
        // 'async': false,
        'global': false,
        'processData': false,
        'contentType': false,
        'data' : formData,
        'url': config.api_path + "/record",
        'error' : function (data) {
            console.log("error")
            console.log(data)
            // data = false
        },
        'success': function(data) {
          console.log("complete")
          console.log(data)
          // data = true;
        }
    });
}