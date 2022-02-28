window.URL = window.URL || window.webkitURL;
/** 
 * Detecte the correct AudioContext for the browser 
 * */
window.AudioContext = window.AudioContext || window.webkitAudioContext;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
var recorder = new RecordVoiceAudios();
let startBtn = document.querySelector('.js-start');
let stopBtn = document.querySelector('.js-stop');
var audioElement = document.querySelector('audio');
var audioDivision = document.querySelector('.audio');
startBtn.onclick = recorder.startRecord;
stopBtn.onclick = recorder.stopRecord;

function RecordVoiceAudios() {
    let elementVolume = document.querySelector('.js-volume');
    let ctx = elementVolume.getContext('2d');
    // let audioElement = document.querySelector('audio');
    let encoder = null;
    let microphone;
    let isRecording = false;
    var audioContext;
    let processor;
    let config = {
        bufferLen: 4096,
        numChannels: 2,
        mimeType: 'audio/wav'
    };

    this.startRecord = function () {
        trinn_sound.play();
        audioContext = new AudioContext();
        /** 
        * Create a ScriptProcessorNode with a bufferSize of 
        * 4096 and two input and output channel 
        * */
        if (audioContext.createJavaScriptNode) {
            processor = audioContext.createJavaScriptNode(config.bufferLen, config.numChannels, config.numChannels);
        } else if (audioContext.createScriptProcessor) {
            processor = audioContext.createScriptProcessor(config.bufferLen, config.numChannels, config.numChannels);
        } else {
            console.log('WebAudio API has no support on this browser.');
        }

        processor.connect(audioContext.destination);
        /**
        *  ask permission of the user for use microphone or camera  
        * */
        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
            .then(gotStreamMethod)
            .catch(logError);
    };

    let getBuffers = (event) => {
        var buffers = [];
        for (var ch = 0; ch < 2; ++ch)
            buffers[ch] = event.inputBuffer.getChannelData(ch);
        return buffers;
    }

    let gotStreamMethod = (stream) => {
        startBtn.setAttribute('disabled', true);
        stopBtn.removeAttribute('disabled');
        audioElement.src = "";
        config = {
            bufferLen: 4096,
            numChannels: 2,
            mimeType: 'audio/wav'
        };
        isRecording = true;

        let tracks = stream.getTracks();
        /** 
        * Create a MediaStreamAudioSourceNode for the microphone 
        * */
        microphone = audioContext.createMediaStreamSource(stream);
        /** 
        * connect the AudioBufferSourceNode to the gainNode 
        * */
        microphone.connect(processor);
        encoder = new WavAudioEncoder(audioContext.sampleRate, 2);
        /** 
        * Give the node a function to process audio events 
        */
        processor.onaudioprocess = function (event) {
            encoder.encode(getBuffers(event));
        };

        stopBtnRecord = () => {
            console.log('stopBtnRecord');
            isRecording = false;
            startBtn.removeAttribute('disabled');
            stopBtn.setAttribute('disabled', true);
            audioContext.close();
            processor.disconnect();
            tracks.forEach(track => track.stop());
            var recordData = encoder.finish();
            audioElement.src = URL.createObjectURL(recordData);
            console.log(audioElement.src);
            submitFile(recordData, audioElement.src, dialect_current_index);
            console.log("complete stopBtnRecord");
        };

        analizer(audioContext);
    }

    this.stopRecord = function () {
        trinn_sound.play();
        stopBtnRecord();
    };

    let analizer = (context) => {
        let listener = context.createAnalyser();
        microphone.connect(listener);
        listener.fftSize = 256;
        var bufferLength = listener.frequencyBinCount;
        let analyserData = new Uint8Array(bufferLength);

        let getVolume = () => {
            let volumeSum = 0;
            let volumeMax = 0;

            listener.getByteFrequencyData(analyserData);

            for (let i = 0; i < bufferLength; i++) {
                volumeSum += analyserData[i];
            }

            let volume = volumeSum / bufferLength;

            if (volume > volumeMax)
                volumeMax = volume;

            drawAudio(volume / 10);
            /**
            * Call getVolume several time for catch the level until it stop the record
            */
            return setTimeout(() => {
                if (isRecording)
                    getVolume();
                else
                    drawAudio(0);
            }, 10);
        }

        getVolume();
    }

    let drawAudio = (volume) => {
        ctx.save();
        ctx.translate(0, 0);

        for (var i = 0; i < 14; i++) {
            fillStyle = '#ffffff';
            if (i < volume)
                fillStyle = '#ff2c77';

            ctx.fillStyle = fillStyle;
            ctx.beginPath();
            ctx.arc(2, 10, 50, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
            ctx.translate(15, 0);
        }

        ctx.restore();
    }

    let logError = (error) => {
        alert(error);
        console.log(error);
    }

   
    drawAudio(0);
}


// -------------------------------------------------------------------------------//
// ----------------------------------BASE CODE------------------------------------//
// -------------------------------------------------------------------------------//
var fail_sound = new sound("img/fail.wav"); 
var pass_sound = new sound("img/pass.wav"); 
var win_sound = new sound("img/win.wav"); 
var skip_sound = new sound("img/skip.wav"); 

 
var info = getInfoLocal();
info.coord.lat = 0;
info.coord.lon = 0;
console.log(info);
audioDivision.style.display = "none";
var stage;

var dialect_full_index = getSentenceIndex(info.dialect_option_detail);
var dialect_full = localStorage.getItem(config.dialect_storage_name);
dialect_full = JSON.parse(dialect_full);
var dialect = dialect_full[info.dialect_option_detail[dialect_full_index].code]
var dialect_length = getLength(dialect);
var dialect_current_index = 0;
var uploadComplete = 0;
var uploadFail = 0;
var pending_index = [];

console.log("dialect : ",dialect)
loadSentent();
loadStatus();


alertify.alert('Tips ในการใช้ระบบ', ' \
<div> \
<b>Browser ที่สามารถใช้อัดเสียงได้</b>\
<p>1. คุณสามารถใช้ Google Chrome หรือ Safari ในการอัดเสียง</p> \
<p>2. หากคุณเปิด Browser ใน Facebook, Line ระบบอัดเสียงอาจขัดข้อง</p> \
<b>การกดอัดเสียง</b>\
<p>1. กรุณาเลือกพื้นที่ที่ไม่มีเสียงรบกวนจากภายนอก (เช่น เสียงพัดลม เสียงคนพูดคุยกัน)</p> \
<p>2. กรุณากดปุ่มไมโครโฟน(สีแดง) และเว้นจังหวะประมาณ 1 วินาที ก่อนอัดเสียง </p> \
<p>3. หลังอ่านประโยคจบครบถ้วน กรุณากดปุ่มหยุดอัดเสียง(สีเทา) </p> \
<p>4. หลังจากหยุดอัดเสียง กรุณารอการตรวจสอบจากระบบเพื่อตรวจสอบคุณภาพเสียงของคุณ</p> \
<p>5. หากเสียงของคุณผ่านมาตรฐาน ระบบจะแสดงประโยคถัดไปให้คุณโดยอัตโนมัติ แต่หากเสียงของคุณขัดข้อง ระบบจะแสดงข้อความแจ้งเตือนปัญหาให้คุณทราบ</p> \
</div> \
').set('closable', false);


function wait_upload(){
    alertify.alert('กรุณารอการตรวจสอบจากระบบ', ' \
    <img style="width: 100%;" src="img/checking.gif" />\
    ').set('closable', false);    
}

function finish_upload(){
    alertify.closeAll();
}

function getLength(data) {
    if(data != null) 
        return data.length; 
    else 
        return 0;
}
function submitFile(data, src, index) {
    writeFile(data, src, index);
    
    // dialect[index].uploaded = "fail";
    uploadFail = countUploadFail(dialect);
    loadStatus();

    wait_upload();

    setTimeout(() => {
        var formData = createFormData(index) ;
        postFile(formData, index);
    },1000);
    if (index < dialect_length - 1){
        // console.log("44444444444444444444444444444444444444444444444444");
        // nextTab();
    }
    else {
        // console.log("5555555555555555555555555555555555555555555555");
        // nextTab();
        // gotoNextPage()
    }
}


function check_stage(index){
    if (index < dialect_length - 1){
        nextTab();
    }
    else {
        nextTab();
        gotoNextPage()
    }
}


function gotoNextPage(){
    if (uploadComplete == dialect.length){
        info.complete_sentense = info.complete_sentense + uploadComplete;
        info.dialect_option_detail[dialect_full_index].read = true;
        console.log("complete");
        localStorage.setItem(config.storage_name, JSON.stringify(info));
        window.location = config.path + '/complete';
  }
  else{
    setTimeout(() => {
        console.log("settimeoutww : ");
        gotoNextPage()
    }, 1000);
  }
}
function prevTab() {
    skip_sound.play();
  dialect_current_index = parseInt(dialect_current_index, 10) - 1;
  loadSentent();
//   console.log(dialect_current_index);
}
function nextTab() {
    skip_sound.play();
  dialect_current_index = dialect_current_index + 1;
  loadSentent();
//   console.log(dialect_current_index);
}
function gotoFirstFail() {
    if(pending_index.length > 0) {
        gotoTab(pending_index[0])
    }
}
function gotoTab(index) {
    dialect_current_index = index;
    loadSentent();
  //   console.log(dialect_current_index);
}

function createFormData(index) {

    var formData = new FormData();

    formData.append("latitude", info.coord.lat);
    formData.append("longitude", info.coord.lon);
    formData.append("volunteer_id", info.volunteer_id);
    formData.append("dialect_id", dialect[index].dialectid);
    formData.append("sentence", dialect[index].localsentence);
    formData.append("dialect_code",info.dialect_option_detail[dialect_full_index].code);
    formData.append("file", dialect[index].file);

    return formData;
}
function postFile(formData, index) {

    // console.log(dialect)
    // console.log(formData)

    postRecord(formData)
    .done(function(data){
        finish_upload();
        if(data.energy && data.snr && data.vad){
            dialect[index].uploaded = "complete";
            uploadComplete = countUploadComplete(dialect);
            uploadFail = countUploadFail(dialect);
            delFromFailList(index);
            check_stage(index);
            loadStatus();
            pass_sound.play();
        }
        // else if(!data.clipping){
        //     fail_alert("เสียงของคุณดังเกินไป", "อุ๊ปส์ เหมือนเราจะได้ยินเสียงของคุณดังเกินไป ลองพูดอีกครั้งสิ")
        // }
        else if(!data.energy){
            fail_alert("เสียงของคุณเบาเกินไป", "อุ๊ปส์ เหมือนเราจะได้ยินเสียงของคุณเบาเกินไป ลองพูดอีกครั้งสิ")
        }
        else if(!data.snr){
            fail_alert("เสียงของคุณมีเสียงรบกวน", "อุ๊ปส์ เหมือนเราจะได้ยินเสียงของคุณมีเสียงรบกวน ลองพูดอีกครั้งสิ")
        }
        else if(!data.vad){
            fail_alert("เสียงของคุณไม่ชัดเจน", "อุ๊ปส์ เหมือนเราจะได้ยินเสียงของคุณไม่ชัดเจน ลองพูดอีกครั้งสิ")
        }
        // else if(data.transcription == ""){
        //     fail_alert("เสียงของคุณไม่ตรงกับข้อความ", "อุ๊ปส์ เหมือนเราไม่ได้ยินเสียงของคุณ ลองพูดอีกครั้งสิ")
        // }
        // else {
        //     fail_alert("เสียงของคุณไม่ตรงกับข้อความ", "อุ๊ปส์ เราได้ยินคุณพูดว่า " + data.transcription + " ลองพูดอีกครั้งสิ")
        // }
    })
    .fail(function() {
        finish_upload();
        // if(dialect[index].uploaded == "fail") {
            dialect[index].uploaded = "fail";
            uploadFail = countUploadFail(dialect);
            addToFailList(index);
            loadStatus();
            fail_alert("ระบบขัดข้อง", "อุ๊ปส์ เหมือนเราจะไม่สามารถอัพโหลดไฟล์ของคุณเข้าไปในระบบได้ โปรดติดต่อ support เพื่อแก้ไขปัญหานี้หรือลองใหม่อีกครั้ง")
            // setTimeout(() => {
            //     postFile(formData, index);
            // },1000);
        // }
    });
}
function addToFailList(index) {
    if(pending_index.indexOf(index) === -1) {
        pending_index.push(index);
        console.log(pending_index);
    }
}

function delFromFailList(item) {
    const index = pending_index.indexOf(item);
    if (index > -1) {
        pending_index.splice(index, 1);
    }
}
function countUploadComplete(arr) {
    var res = arr.filter(val => {
      return val.uploaded == "complete"
    })
    return res.length
}
function countUploadFail(arr) {
    var res = arr.filter(val => {
      return val.uploaded == "fail"
    })
    return res.length
}
function writeFile (data, src, index) {

    var file = new File([data], info.volunteer_id + '_' + Date.now() + '.wav')
    // console.log("Downloadable todataurl", file.toDataURL('wav/aiff'));
    dialect[index].data = data;
    dialect[index].src = src;
    dialect[index].file = file;
    dialect[index].read = true;
}
function loadStatus() {
    var pendingPercent = (100*uploadFail)/dialect_length;
    var completePercent = (100*uploadComplete)/dialect_length;
    // console.log(completePercent, pendingPercent)
    $('#progress-bar-complete').css('width', completePercent+'%').attr('aria-valuenow', completePercent);
    $('#progress-bar-pending').css('width', pendingPercent+'%').attr('aria-valuenow', pendingPercent); 
    document.getElementById("complete_upload").innerHTML = uploadComplete + "/" +  dialect_length;
    document.getElementById("pending_upload").innerHTML = uploadFail + "/" +  dialect_length;

    console.log(pending_index)
    var re_record_div = document.getElementById("re_record_div");
    if (pending_index.length > 0) {
        re_record_div.style.display = "block";
    } 
    else {
        re_record_div.style.display = "none";
    }

}
function setWaitDiv() {
    
    var upload_div = document.getElementById("upload-pending-div");
    var record_div = document.getElementById("record-pending-div");
    if (dialect_current_index >= dialect_length) {
        upload_div.style.display = "block";
        record_div.style.display = "none";
    } 
    else {
        upload_div.style.display = "none";
        record_div.style.display = "block";
    }

}
function loadSentent() {

    document.getElementById("dialect-group-option").innerHTML = "ภาษา" + info.dialect_option_detail[dialect_full_index].dialect;
    
    var upload_div = document.getElementById("upload-pending-div");
    var record_div = document.getElementById("record-pending-div");
    var record_btn = document.getElementById("record-button");
    // console.log(dialect)
    if(dialect == null) {
        record_btn.style.display = "none";
    } 
    else {
        record_btn.style.display = "block";

        if (dialect_current_index >= dialect_length) {
            upload_div.style.display = "block";
            record_div.style.display = "none";
        } 
        else {
            upload_div.style.display = "none";
            record_div.style.display = "block";
        }
        if (dialect_current_index < dialect_length) {
            // console.log("dialect_current_index: ,",dialect_current_index)
            var prev_div = document.getElementById("prev_div");
            var next_div = document.getElementById("next_div");
            prev_div.style.display = "none";
            next_div.style.display = "none";

            if (dialect_current_index > 0) {
                prev_div.style.display = "block";
            } 
            else {
                prev_div.style.display = "none";
            }

            if (dialect_current_index < dialect_length & dialect[dialect_current_index].src != "" ) {
                next_div.style.display = "block";
            } 
            else {
                next_div.style.display = "none";
            }
            console.log(dialect[dialect_current_index])
            if (dialect[dialect_current_index].src != "") {
                audioElement.src = dialect[dialect_current_index].src;
                audioDivision.style.display = "inline";
            } 
            else {
                audioDivision.style.display = "none";
            }

            document.getElementById("dialect_count").innerHTML = "กำลังบันทึกข้อความที่ " + (dialect_current_index + 1) + "/" +  dialect_length;
            document.getElementById("dialect_sentence").innerHTML = dialect[dialect_current_index].localsentence;   
            document.getElementById("dialect_official_sentence").innerHTML = dialect[dialect_current_index].official_sentence;   
        }
    }
}


function getSentenceIndex(dialect_option_detail) {
    console.log(dialect_option_detail)
    const data = null;
    for (var j = 0; j < dialect_option_detail.length ; j++){
        if(!dialect_option_detail[j].read){
            return  j
        }
    }
    if(data == null)
    {
        window.location = config.path + "/complete"
    }
}

getAddress();
function getAddress(){
    console.log(info);
    try {
        if (navigator.geolocation) {
            var errorStr = "Geolocation is not available."
            getCoordinates(function(coord){
                if(coord.latitude != null) {
                    info.coord.lat = coord.latitude;
                    info.coord.lon = coord.longitude;
                }
                else {
                    console.log(coord);
                    info.coord.lat = 0;
                    info.coord.lon = 0;
                }
                
                
            });
        }
    } 
    catch (error) {
        var loaded = false;
        // console.log(loaded);
        console.log(error);
    }
    console.log(info)
}

function exit() {
    
    info.complete_sentense = info.complete_sentense + uploadComplete;
    info.dialect_option_detail[dialect_full_index].read = true;
    localStorage.setItem(config.storage_name, JSON.stringify(info));
    window.location = config.path + '/complete';
}



function fail_alert(title, message) {
    fail_sound.play();
    alertify.confirm(title , message, 
    function(){ 
        console.debug("this word")
    } , 
    function(){  
        console.debug("next word")
        nextTab();
    }).set('labels', {ok:'กลับไปพูดคำนี้อีกครั้ง', cancel:'อ่านประโยคนี้ไม่ได้ ข้ามไปประโยคถัดไป'});
}