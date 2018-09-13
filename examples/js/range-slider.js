
document.addEventListener('toolkit-slider-init', function(e) {
    //Update the binded output element using the data-slider & data-output attributes  
    var element = e.detail.element;
    updateOutput(element.dataset.slider, e.detail.value);
});

document.addEventListener('toolkit-slider-active', function(e) {
        
    //Update the binded output element using the data-slider & data-output attributes  
    var element = e.detail.element;
    updateOutput(element.dataset.slider, e.detail.value);

    //Switching the sliders based on their data-slider attr value
    switch(element.dataset.slider) {
        case '111':
            console.log("This is the first slider active!");
            break;
        case '222':
            console.log("This is the second slider active!");
            break;
    }
});

document.addEventListener("DOMContentLoaded", function() {

    $('input[type=range].toolkit-slider').rangeslider({
        
        polyfill: false,

        horizontalClass: 'is--horizontal',
        verticalClass: 'is--vertical',

        fillClass: 'fill',
        handleClass: 'thumb',

        onInit: function() {
            var event = new CustomEvent('toolkit-slider-init', {
                detail: {
                    element: this.$element[0], 
                    value: this.value,
                }
            });
            document.dispatchEvent(event); 
        },
        onSlide: function() {

            var event = new CustomEvent('toolkit-slider-active', {
                detail: {
                    element: this.$element[0], 
                    value: this.value,
                }
            });
            document.dispatchEvent(event); 
        }

    });

});

function updateOutput(targetOutput, value) {
    return document.querySelector("output[data-output='"+targetOutput+"']").innerHTML = value;
}

//
// Custom Event Polyfill for IE11
//
(function () {

    if ( typeof window.CustomEvent === "function" ) return false;
  
    function CustomEvent ( event, params ) {
      params = params || { bubbles: false, cancelable: false, detail: undefined };
      var evt = document.createEvent( 'CustomEvent' );
      evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
      return evt;
     }
  
    CustomEvent.prototype = window.Event.prototype;
  
    window.CustomEvent = CustomEvent;
})();