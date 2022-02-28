var info =  {
    nick_name: Date.now(),
    gender: "",
    age: "",
    official_ability: false,
    dialect_id : [],
    dialect_option_detail : [],
    complete_sentense : 0,
    official_ability_read: false,
    local_dialect_read: false,
    user_id: "",
    zipcode: "",
    district_id : "",
    province_id: "",
    county: "",
    coord: {
      lat: null,
      lon: null
    },
    user_id: "",
    volunteer_id: "",
    agree_term: false
  };
var provinces = getVolunteerProvince();

var dialect_option = getDialectOption();

try{
  info.user_id = getUserData().user_id;
}
catch(error) {
  console.log(error);
}
provinceOption(provinces);
// getZipcode();
appendDialectOption();

function getZipcode(){
  currentAddress(function(address){
    info.zipcode = address.postcode;
    document.getElementById("zipcode").value = info.zipcode;
    if(info.zipcode != "" || info.zipcode.length < 5){
      var div = document.getElementById('province-option');
      div.style.display = "none";
    }

  });
}

function appendDialectOption() {
  console.log(dialect_option)

  var dialect_group_div = document.getElementById('dialect-group');
  for(var i=0; i < dialect_option.length; i++){
    var dialect_option_group_div = document.createElement("div");
    dialect_option_group_div.setAttribute("id", "dialect-option-group-"+i.toString());
    dialect_option_group_div.setAttribute("class", "form-check row");
    
    var dialect_option_main_label = document.createElement("label");
    dialect_option_main_label.innerHTML = "ภาษา" + dialect_option[i].name;
    dialect_option_main_label.setAttribute("class", "label");

    for(var j=0; j < dialect_option[i].dialectList.length; j++){ 
      var dialect_option_div = document.createElement("div");
      dialect_option_div.setAttribute("class", "dialect-option");
      

      var dialect_option_input = document.createElement("input");
      dialect_option_input.setAttribute("id", dialect_option[i].dialectList[j].id);
      dialect_option_input.setAttribute("class", "form-check-input");
      dialect_option_input.setAttribute("type", "checkbox");
      dialect_option_input.setAttribute("style", "width: auto; margin-right: 5px;");
      var dialect_option_label = document.createElement("label");
      dialect_option_label.setAttribute("class", "form-check-label");
      dialect_option_label.setAttribute("type", "checkbox");
      dialect_option_label.innerHTML = "ภาษา" + dialect_option[i].dialectList[j].dialect;

      dialect_option_div.appendChild(dialect_option_input);
      dialect_option_div.appendChild(dialect_option_label);

      dialect_option_group_div.appendChild(dialect_option_div);
    }
    
    dialect_group_div.appendChild(dialect_option_main_label);
    dialect_group_div.appendChild(dialect_option_group_div);

  }
}

function provinceOption(list) {
  var sel = document.getElementById('province');
  for(var i = 0; i < list.length; i++) {
      var opt = document.createElement('option');
      opt.innerHTML = list[i]['province_name']
      opt.value = list[i]['province_id'];
      // opt.value = list[i]['defaultzipcode'];
      sel.appendChild(opt);
  }
}

function provinceChange() {
  var province_id = document.getElementById("province").value;
  var districtList = getVolunteerDistrict(province_id);
  districtOption(districtList);
}

function districtOption(list) {
  var sel = document.getElementById('district');
  for(var i = sel.options.length; i > 0; i--) {
    sel.remove(i);
  }
  for(var i = 0; i < list.length; i++) {
      var opt = document.createElement('option');
      opt.innerHTML = list[i]['district_name']
      opt.value = list[i]['district_id'];
      // opt.value = list[i]['defaultzipcode'];
      sel.appendChild(opt);
  }
}

function changeZipcode() {
  document.getElementById("zipcode").value = document.getElementById("province").value;
}
function getOptionInput(){
  var check = [];
  info.dialect_option_detail = [];
  for(var i=0; i < dialect_option.length; i++){
    for(var j=0; j < dialect_option[i].dialectList.length; j++){
      if(document.getElementById(dialect_option[i].dialectList[j].id).checked){
        check.push(dialect_option[i].dialectList[j].id)
        dialect_option[i].dialectList[j].read = false;
        info.dialect_option_detail.push(dialect_option[i].dialectList[j])
      }
    }
  }
  return check;
}
function submit() {
    info.gender = document.getElementById("gender").value
    info.age = parseInt(document.getElementById("age").value)
    // info.zipcode = document.getElementById("zipcode").value
    info.province_id = document.getElementById("province").value
    info.district_id = document.getElementById("district").value
    info.dialect_id = getOptionInput();
    info.agree_term = document.getElementById("terms").checked;
    // info.official_ability = document.getElementById("official_ability").checked;
    info.nick_name = info.nick_name.toString()
    info.dialect_id = info.dialect_id.toString()
    
    var validate = validationForm(); 
    if(validate){
      console.log(info);
      postData(info);
    }
}

function validationForm() {
  document.getElementById("age-error").innerHTML = "";
  document.getElementById("gender-error").innerHTML = "";
  document.getElementById("terms-error").innerHTML = "";
  document.getElementById("error").innerHTML = "";
  var errors = "";
  var validated = true;
  if (info.age == "") { 
    document.getElementById("age-error").innerHTML = "กรุณากรอกอายุ";
    validated = false;
  }
  else if(info.age > 55 || info.age < 18) {
    document.getElementById("age-error").innerHTML = "เราสามารถใช้ข้อมูลของผู้ที่มีอายุ 18 - 55 ปีได้เท่านั้น";
    validated = false;
  }
  if (info.gender == "Choose option") {
    document.getElementById("gender-error").innerHTML = "กรุณาเลือกเพศของคุณ";
    validated = false;
  }
  // if (info.zipcode == "") {
  //   document.getElementById("province-error").innerHTML = "Province field is required.";
  //   validated = false;
  // }
  if (info.dialect_id.length == 0) {
    document.getElementById("dialect-option-error").innerHTML = "กรุณาเลือกอย่างน้อย 1 ภาษา";
    validated = false;
  }
  if (!info.agree_term) {
    document.getElementById("terms-error").innerHTML = "กรุณายอมรับข้อตกลงและเงื่อนไขการใช้บริการเว็บไซต์";
    validated = false;
  }
  return validated;
}

function postData(data) {
  const result = postVolunteerInformation(data);

  console.log("debug : ",result)

  if (result != "error"){
    info.volunteer_id = result.volunteerid;
    localStorage.setItem(config.storage_name, JSON.stringify(info));
    console.log("complete");
    window.location = config.path + '/start';
  }
  else {
    var error = document.getElementById("error").innerHTML;
    document.getElementById("error").innerHTML = "Error Msg: " + error;
    console.log(result);

  }
  console.log(info);
  
}