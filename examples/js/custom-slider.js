// customSlider.js
// use sliders[n].setValue(value) to programmatically set value of targeted slider

function updateOutput(targetOutput, value) {
    return document.querySelector("output[data-output='"+targetOutput+"']").innerHTML = value;
}

document.addEventListener('toolkitSlider-init', function(e) {
    var inputElement = e.detail.element;
    var value = e.detail.value;
    updateOutput(inputElement.dataset.slider, value);
});

document.addEventListener('toolkitSlider-active', function(e) {
    var inputElement = e.detail.element;
    var value = e.detail.value;
    updateOutput(inputElement.dataset.slider, value);
});

var sliders = [];
document.addEventListener("DOMContentLoaded", function() {

    var targetElements = document.querySelectorAll('.toolkit-slider');
    targetElements = [].slice.call(targetElements);   

    targetElements.forEach(function(input) {
        sliders.push(new ToolkitSlider(input, {

            onInit: function(obj) {
                var event = new CustomEvent('toolkitSlider-init', {
                    detail: {
                        element: obj.targetInput,
                        value: obj.getValue()
                    }
                });
                document.dispatchEvent(event);
            },
            onChange: function(obj) {
                var event = new CustomEvent('toolkitSlider-active', {
                    detail: {
                        element: obj.targetInput,
                        value: obj.getValue()
                    }
                });
                document.dispatchEvent(event);
            }

        }));
    }, sliders);
}.bind(sliders));

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


