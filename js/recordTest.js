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


var info = getInfoLocal();
info = JSON.parse(info);
info.coord.lat = "null";
info.coord.lon = "null";
console.log(info);
var stage;
var dialect = getSentence();
var dialect_length = getLength(dialect);
var dialect_current_index = 0;
var uploadComplete = 0;
var uploadFail = 0;
// console.log(dialect)
loadSentent();
// loadStatus();
function getLength(data) {
    if(data != null) 
        return data.length; 
    else 
        return 0;
}
function submitFile(data, src, index) {
    writeFile(data, src, index);

    repeat = document.getElementById("repeat").value ;
    var formData = createFormData(index) ;
    for(var i=0 ; i< repeat ; i++){
        postFile(formData, index);
    }
}
function gotoNextPage(){
  if (uploadComplete == dialect.length){
    if(stage == "dialect"){
      info.local_dialect_read = true;
    }
    else {
      info.official_ability_read = true;
    }
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
  dialect_current_index = parseInt(dialect_current_index, 10) - 1;
  loadSentent();
//   console.log(dialect_current_index);
}
function nextTab() {
  dialect_current_index = dialect_current_index + 1;
  loadSentent();
//   console.log(dialect_current_index);
}
function createFormData(index) {
    var formData = new FormData();

    formData.append("latitude", info.coord.lat);
    formData.append("longitude", info.coord.lon);
    formData.append("volunteer_id", info.volunteer_id);
    formData.append("dialect_id", dialect[index].dialectid);
    formData.append("file", dialect[index].file);

    return formData;
}
function postFile(formData, index) {

    postRecord(formData).done(function(){
        uploadComplete = uploadComplete + 1;
        document.getElementById("complete_upload").innerHTML = uploadComplete;
    })
    .fail(function() {
        uploadFail = uploadFail + 1;
        document.getElementById("pending_upload").innerHTML = uploadFail ;
    });
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

            if (dialect[dialect_current_index].src != "") {
                audioElement.src = dialect[dialect_current_index].src;
                audioElement.style.display = "block";
            } 
            else {
                audioElement.style.display = "none";
            }

            document.getElementById("dialect_count").innerHTML = "กำลังบันทึกข้อความที่ " + (dialect_current_index + 1) + "/" +  dialect_length;
            document.getElementById("dialect_sentence").innerHTML = dialect[dialect_current_index].localsentence;   
        }
    }
}



function getSentence() {
    var path = "";
    if(!info.local_dialect_read){
        stage = "dialect";
        path = '/dialect';
    }
    else if (info.official_ability){
        stage = "official";
        path = '/official';
    }
    var url = config.api_path + path + '?user_id=' + info.user_id + '&volunteer_id=' + info.volunteer_id + '&zipcode=' + info.zipcode
    // var url =  "https://voice.cmkl.ac.th/api/dialect?volunteer_id=30p7yPx2Zgl1lBuxBm8qvTHbnbXB5U9A" 
    const data = (function() {
        var json = null;
        $.ajax({
          'async': false,
          'global': false,
          'url': url,
          'dataType': "json",
          'success': function(data) {
            json = data;
          }
        });
        return json;
      })();
    //   console.log(data);
      if(data != null){
        for (let i = 0; i < data.length; i++) {
            data[i].read = false;
            data[i].uploaded = false;
            data[i].file = null;
            data[i].src = ""
        }
    }
      return data;
}

getAddress();

function getAddress(){
    try {
        if (navigator.geolocation) {
            var errorStr = "Geolocation is not available."
            getCoordinates(function(coord){
                // console.log(coord);
                info.coord.lat = coord.latitude;
                info.coord.lon = coord.longitude;
            });
        }
    } 
    catch (error) {
        var loaded = false;
        // console.log(loaded);
        console.log(error);
    }
    // console.log(info)
}