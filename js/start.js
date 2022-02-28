
var info = getInfoLocal();
console.log(info)
var next_div = document.getElementById("next_div") 

var dialect = getSentence();
console.log(dialect)


function next(){
    localStorage.setItem(config.dialect_storage_name, JSON.stringify(dialect));
    window.location = config.path + '/record';
}

function getSentence() {
    const data = getDialect(info.volunteer_id)
    console.log(Object.keys(data))
    console.log(Object.keys(data)[0])
    if(data != null){
        for (var j = 0; j < Object.keys(data).length ; j++){
            for (let i = 0; i < data[Object.keys(data)[j]].length; i++) {
                data[Object.keys(data)[j]][i].read = false;
                data[Object.keys(data)[j]][i].uploaded = false;
                data[Object.keys(data)[j]][i].file = null;
                data[Object.keys(data)[j]][i].src = ""
            }
        }
        
    }
    return data;
}
