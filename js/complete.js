
var info = getInfoLocal();
var record_div = document.getElementById("record_div") 
var next_div = document.getElementById("next_div") 
record_div.style.display = "none";
next_div.style.display = "none";
document.getElementById("count_1").innerHTML = "วันนี้น้องพอใจเรียนไปได้ " + info.complete_sentense + " ประโยคแล้ว"
document.getElementById("count_2").innerHTML = "วันนี้น้องพอใจเรียนไปได้ " + info.complete_sentense + " ประโยคแล้ว"
console.log(info)
if(!checkComplete(info.dialect_option_detail)){
    record_div.style.display = "block";
    next_div.style.display = "none";
}
else {
    record_div.style.display = "none";
    next_div.style.display = "block";
}


function record(){
    window.location = config.path + '/record';
}
function next(){
    window.location = config.path + '/volunteer-register';
}


function checkComplete(dialect_option_detail) {
    console.log(dialect_option_detail)
    const data = null;
    for (var j = 0; j < dialect_option_detail.length ; j++){
        if(!dialect_option_detail[j].read){
            return false;
        }
    }
    if(data == null)
    {
        return true;
    }
}