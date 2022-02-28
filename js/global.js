var config;

// -------------------------------------------------------------------------------//
// ----------------------------------sound CODE------------------------------------//
// -------------------------------------------------------------------------------//
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
      this.sound.play();
    }
    this.stop = function(){
      this.sound.pause();
    }
}


var trin_sound = new sound("img/trin.wav"); 
var trinn_sound = new sound("img/trinn.wav"); 
var click_sound = new sound("img/skip.wav"); 


function getConfig() {
    return $.ajax({
      'async': false,
      'global': false,
      'url': "config/config.json",
      'dataType': "json",
      'success': function(data) {
        json = data;
      },
      'error': function(data) {
          console.log(data)
      }
    });
};
function getTerms() {
    return $.ajax({
        'async': false,
        'global': false,
        'url': "config/terms.txt",
        'dataType':'text',
        'success': function(data) {
            // console.log(data)
        },
        'error': function(data) {
            // console.log(data)
        }
    });
};
(function ($) {
    'use strict';
    $(window).on('load',function() {
		// Animate loader off screen
		$(".se-pre-con").fadeOut("slow");;
    });
    
    try {
        var selectSimple = $('.js-select-simple');
    
        selectSimple.each(function () {
            var that = $(this);
            var selectBox = that.find('select');
            var selectDropdown = that.find('.select-dropdown');
            selectBox.select2({
                dropdownParent: selectDropdown
            });
        });
    
    } catch (err) {
        console.log(err);
    }
    
    try {
        $.when(getConfig())
        .done(function(response){
            config = response;
            // console.log(config);
        });
    } catch (err) {
        console.log(err);
    }
    
    try {
        var termsContent = document.getElementById("terms-condition-content")
        var modalBtn = document.getElementById("modal-btn")
        var modal = document.querySelector(".modal")
        var closeBtn = document.querySelector(".close-btn")
        var termsTH = "";
        // console.log(termsTH);
        $.when(getTerms())
        .done(function(response){
            termsTH = response;
            // console.log(termsTH);
        })
        .fail(function(error) {

            console.log(error);
        });
        
        termsContent.innerHTML = termsTH;
        modalBtn.onclick = function(){
            modal.style.display = "block"
            }
            closeBtn.onclick = function(){
            modal.style.display = "none"
            }
            window.onclick = function(e){
            if(e.target == modal){
                modal.style.display = "none"
            }
        }
    } catch (err) {
        console.log(err);
    }


})(jQuery);
