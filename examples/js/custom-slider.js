//Constuctor function
function toolkitSlider(targetInput, params) {

    // Set HTMLELEMENT Objects
    this.targetInput = targetInput;
    hideElement(this.targetInput);
    
    this.sliderParent = document.createElement('div');
    this.sliderParent.classList.add('toolkitSlider');

    this.sliderHandle = document.createElement('span');
    this.sliderHandle.classList.add('handle');

    this.sliderFill = document.createElement('span');
    this.sliderFill.classList.add('fill');

    // Insert elements after the target input
    this.targetInput.after(this.sliderParent);
    this.sliderParent.appendChild(this.sliderHandle);
    this.sliderParent.appendChild(this.sliderFill);

    this.params = params;

    this.startEvent = ['mousedown', 'touchstart', 'pointerdown'];
    this.moveEvent = ['mousemove', 'touchmove', 'pointermove'];
    this.endEvent = ['mouseup', 'touchend', 'pointerup'];
    
    this.init();

    // Bind scope of the this object to eventlistner handlers
    this.handleDown = this.handleDown.bind(this);
    this.handleMove = this.handleMove.bind(this);
    this.handleEnd = this.handleEnd.bind(this);

    // Init Starting Action EventListeners
    this.startEvent.forEach(function(eventName) {
        this.sliderHandle.addEventListener(eventName, this.handleDown); 
    }, this);
    
    // Function that hides original input[type=range] DOM element
    function hideElement(element) {
        element.style.position = "absolute";
        element.style.width = '1px';
        element.style.height = '1px';
        element.style.overflow = 'hidden';
        element.style.opacity = '0';
    }
}

toolkitSlider.prototype.handleDown = function(e) {
    e.preventDefault();
    console.log('handle down');
    if(e.button && e.button !== 0) { return; }

    // Init Move Action Event Listeners
    this.moveEvent.forEach(function(eventName) {
        document.addEventListener(eventName, this.handleMove, false);
    }, this);

     // Init End Action Event Listeners
     this.endEvent.forEach(function(eventName) {
        document.addEventListener(eventName, this.handleEnd, false);
    }, this);
}

toolkitSlider.prototype.handleMove = function(e) {
    e.preventDefault();

    // Update inputs value based on mousemovement 
    setInputValue(this.targetInput, this.valuefromMousePosition(e), 'value');
    this.onChange();

    // update slider handle position based on value
    this.update(true);
}

toolkitSlider.prototype.valuefromMousePosition = function(e) {

    var sliderBoundingCoord = this.sliderParent.getBoundingClientRect()['left'];
    var trackWidth = this.sliderParent.getBoundingClientRect()['width'];

    var setPos = (e.clientX - sliderBoundingCoord);
    var handleWidth = this.sliderHandle.getBoundingClientRect()['width'];
    
    // Mouse coord less than min set to min
    if(setPos <= handleWidth) {
        setPos = handleWidth;
    }
    // Mouse coord greater than max set to max
    if(setPos >= trackWidth) {
        setPos = trackWidth;
    }

    var pixelPoints = trackWidth - handleWidth;
    var valueRange = this.max - this.min;
    var numSteps = Math.round(valueRange / this.step);
    var step = (setPos - handleWidth)/(pixelPoints/numSteps);
    var value = step * this.step;

    console.log('Pixel Position: ' + (setPos - handleWidth));
    console.log('Number of Pixel Points: ' + pixelPoints);
    console.log('Value Range: ' + valueRange);
    console.log('Number of Steps: ' + numSteps);
    console.log('VALUE:' + value);

    //Temp solution for moving the slide handle
    this.sliderHandle.style.left = setPos + 'px';
    this.sliderFill.style.width = setPos - (handleWidth*0.5) + 'px';

    return value;
}

toolkitSlider.prototype.handleEnd = function(e) {
    e.preventDefault();

    console.log('Ending slider action!');

    //Remove Move Action Event Listeners
    this.moveEvent.forEach(function(eventName) {
        document.removeEventListener(eventName, this.handleMove, false);
    }, this);

     //Remove End Action Event Listeners
     this.endEvent.forEach(function(eventName) {
        document.removeEventListener(eventName, this.handleEnd, false);
    }, this);
}

toolkitSlider.prototype.init = function() {
    this.update(true);

    if(this.params.onInit && typeof this.params.onInit === 'function') {
        var self = this;
        this.params.onInit(self);
    }
}

toolkitSlider.prototype.onChange = function() {
    if(this.params.onChange && typeof this.params.onChange === 'function') {
        var self = this;
        this.params.onChange(self);
    }
}

toolkitSlider.prototype.update = function(updateAttributes) {
    updateAttributes = updateAttributes || false;

    if(updateAttributes) {
        this.min = getInputValue(this.targetInput, 'min');
        this.max = getInputValue(this.targetInput, 'max');
        this.value = getInputValue(this.targetInput);
        this.step = getInputValue(this.targetInput, 'step');
    }

    //this.position = this.getPosFromValue(this.value);

    if(this.targetInput.disabled) {
        //Add class to custom slider to disable it
    }
}

toolkitSlider.prototype.posFromValue = function(value) {
    return value;
}

//
// Helper Functions
//

function setInputValue(inputElement, value, type) {
    type = type || '';
    if(inputElement instanceof HTMLElement) {
        switch(type) {
            default:
                return inputElement.value = value;
                break;
        }
    }
}
function getInputValue(inputElement, type) {
    type = type || '';
    if(inputElement instanceof HTMLElement) {
        switch(type) {
            default:
                return inputElement.value;
                break;
            case 'min':
                return inputElement.min;
                break;
            case 'max':
                return inputElement.max;
                break;
            case 'step':
                return inputElement.step;
                break;
        } 
    } 
    console.error('getInputValue was input param not equal to an HTMLElement object.');
}

//
// Polyfills
//

//from: https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/after()/after().md
(function (arr) {
    arr.forEach(function (item) {
      if (item.hasOwnProperty('after')) {
        return;
      }
      Object.defineProperty(item, 'after', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: function after() {
          var argArr = Array.prototype.slice.call(arguments),
            docFrag = document.createDocumentFragment();
          
          argArr.forEach(function (argItem) {
            var isNode = argItem instanceof Node;
            docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
          });
          
          this.parentNode.insertBefore(docFrag, this.nextSibling);
        }
      });
    });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);


//
// Separate 
//

function updateOutput(targetOutput, value) {
    return document.querySelector("output[data-output='"+targetOutput+"']").innerHTML = value;
}

document.addEventListener('toolkitSlider-active', function(e) {

    var inputElement = e.detail.element;
    var value = getInputValue(inputElement);
    updateOutput(inputElement.dataset.slider, value)

});

document.addEventListener("DOMContentLoaded", function() {

    var y = document.querySelectorAll('.toolkit-slider');

    y.forEach(function(input) {
        new toolkitSlider(input, {

            onInit: function(data) {
                console.log('Init callback working:' + data.value);
                console.log('min:' + data.min);
                console.log('max:' + data.max);
                console.log('step:' + data.max);
            },
            onChange: function(data) {
                var event = new CustomEvent('toolkitSlider-active', {
                    detail: {
                        element: data.targetInput,
                    }
                });
                document.dispatchEvent(event);
            }
    
        });
    });

});

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


