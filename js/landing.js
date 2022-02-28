info = {
    first_name: "",
    last_name : "",
    email : ""
}

loop_checkuser ()
try{
    info.user_id = getInfoLocalLanding().user_id;
}
catch(error) {
    console.log(error);
}


function verify(){  
    time = (Date.now()).toString()
    r = Math.random().toString(36).substring(7)
    info = {
        "first_name" : time,
        "last_name" : r,
        "email" : time+"@sample.com"
    }
    info.user_id = postUserName(info).user_id
}

function loop_checkuser (){
    // console.log(info)
    if(info.user_id != null){
        localStorage.setItem(config.storage_name, JSON.stringify(info));
        window.location = config.path + '/volunteer-register';
    }
    setTimeout(() => {
      loop_checkuser();
    },500)
}


function openInChrome(url) {
    chrome.runtime.sendMessage({action: "openURL", url: url});
}

function isFacebookApp() {
    var ua = navigator.userAgent || navigator.vendor || window.opera;
    console.debug(ua);
    // document.getElementById("debug").innerHTML = ua;
    return (ua.indexOf("FBAN") > -1) || (ua.indexOf("FBAV") > -1) || (ua.indexOf("LINE") > -1) || (ua.indexOf("Line") > -1);
}


if(isFacebookApp()) {
    window.location = "intent://voice.cmkl.ac.th#Intent;scheme=https;action=android.intent.action.VIEW;end;"
}

// chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
//     if(message.action == "openURL") window.open(message.url);
// });