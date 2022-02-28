var info =  getUserData();
var region = getUserRegion();

prefillInfo();
regionOption(region);
// console.log(navigator.userAgent)



function regionOption(list) {
    var sel = document.getElementById('region_id');
    for(var i = 0; i < list.length; i++) {
        var opt = document.createElement('option');
        opt.innerHTML = list[i]['regionname']
        opt.value = list[i]['regionid'];
        sel.appendChild(opt);
    }
}
function prefillInfo(){
    info.agent_model = navigator.userAgent;
    document.getElementById("first_name").value = info.first_name;
    document.getElementById("last_name").value = info.last_name;
    document.getElementById("email").value = info.email;
    document.getElementById("phone_number").value = info.phone_number;
    document.getElementById("region_id").value = info.region_id;
    document.getElementById("agent_model").value = info.agent_model;
}
  
// try{
//     info.user_id = getUserData().user_id;
    
//     document.getElementById("user_id").innerHTML = info.user_id;
// }
// catch(error) {
//   document.getElementById("user_id").innerHTML = error;
//     console.log(error);
// }
function submit() {
    
    info.first_name = document.getElementById("first_name").value;
    info.last_name = document.getElementById("last_name").value;
    info.email = document.getElementById("email").value;
    info.phone_number = document.getElementById("phone_number").value;
    info.region_id = document.getElementById("region_id").value;
    info.agent_model = document.getElementById("agent_model").value;
    info.terms = document.getElementById("terms").checked;

    console.log(info);
    var validate = validationForm(); 
    if(validate){
      postData(info);
    }
}

function validationForm() {
  document.getElementById("first_name-error").innerHTML = "";
  document.getElementById("last_name-error").innerHTML = "";
  document.getElementById("email-error").innerHTML = "";
  document.getElementById("phone_number-error").innerHTML = "";
  document.getElementById("region_id-error").innerHTML = "";
  document.getElementById("error").innerHTML = "";
  var errors = "";
  var validated = true;
  if (info.first_name == "") {
    document.getElementById("first_name-error").innerHTML = "กรุณากรอกชื่อ";
    validated = false;
  }
  if (info.last_name == "") {
    document.getElementById("last_name-error").innerHTML = "กรุณากรอกนามสกุล";
    validated = false;
  }
  if (info.email == "") { 
    document.getElementById("email-error").innerHTML = "กรุณากรอกอีเมลล์";
    validated = false;
  }
  if(info.phone_number == "") {
    document.getElementById("phone_number-error").innerHTML = "กรุณากรอกเบบอร์โทรศัพท์";
    validated = false;
  }
  if (info.region_id == "เลือกข้อมูล") {
    document.getElementById("region_id-error").innerHTML = "กรุณาเลือกภาคของคุณ";
    validated = false;
  }
  if (!info.terms) {
    document.getElementById("terms-error").innerHTML = "กรุณายอมรับข้อตกลงและเงื่อนไขการใช้บริการเว็บไซต์";
    validated = false;
  }
  return validated;
}

function postData(data) {
  const result = postUserProfile(data);
  if (result != null){
    info.volunteer_id = result.volunteerid;
    // localStorage.setItem(config.storage_name, JSON.stringify(info));
    console.log("complete");
    window.location = config.path + '/volunteer-register';
  }
  else {
    var error = document.getElementById("error").innerHTML;
    document.getElementById("error").innerHTML = "Error Msg: " + error;
  }
  console.log(info);
}