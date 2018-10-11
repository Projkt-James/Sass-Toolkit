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

    // Bind scope of this object to EventListener handlers
    this.startActionHandler = this.startActionHandler.bind(this);
    this.moveActionHandler = this.moveActionHandler.bind(this);
    this.handleEnd = this.handleEnd.bind(this);
    
    // Init slider handle starting action EventListeners
    this.startEvent.forEach(function(eventName) {
        this.sliderParent.addEventListener(eventName, this.startActionHandler); 
    }, this);

    // MutationObserver to handle input attribute changes
    this.observerHandler = this.observerHandler.bind(this);
    this.observerConfig = { characterData: true, attributes: true, childList: true, subtree: true};
    this.observer = new MutationObserver(this.observerHandler);
    this.observer.observe(this.targetInput, this.observerConfig);

    // Function to hide original input[type=range] DOM element
    function hideElement(element) {
        element.style.position = "absolute";
        element.style.width = '1px';
        element.style.height = '1px';
        element.style.overflow = 'hidden';
        element.style.opacity = '0';
    }
}

toolkitSlider.prototype.observerHandler = function(mutations) {
    
    this.observer.disconnect(); //Disconnect observer to make dom mutations
    
    mutations.forEach(function(mutation) {

        // Update value dom attribute
        if(mutation.type == "attributes" && mutation.attributeName == "value") {

            setInputValue(this.targetInput, this.targetInput.getAttribute("value"), "value");
            this.targetInput.setAttribute("value", getInputValue(this.targetInput, "value"));

            this.update();
            this.onChange(); 
        }
    }, this);

    this.observer.observe(this.targetInput, this.observerConfig); //Reattach observer 
}

toolkitSlider.prototype.startActionHandler = function(e) {
    e.preventDefault();

    // Do nothing if not actioned with primary mouse button
    if(e.button && e.button !== 0) { return; }

    // Update input value based on mousemovement 
    this.value = this.valuefromMousePosition(e);
    this.syncValue();

    // Init move action EventListeners
    this.moveEvent.forEach(function(eventName) {
        document.addEventListener(eventName, this.moveActionHandler, false);
    }, this);

    // Init End Action EventListeners
    this.endEvent.forEach(function(eventName) {
        document.addEventListener(eventName, this.handleEnd, false);
    }, this);
}

toolkitSlider.prototype.moveActionHandler = function(e) {
    e.preventDefault();

    // Update input value based on mousemovement 
    this.value = this.valuefromMousePosition(e);
    this.syncValue();
}

toolkitSlider.prototype.handleEnd = function(e) {
    e.preventDefault();

    //Remove Move Action Event Listeners
    this.moveEvent.forEach(function(eventName) {
        document.removeEventListener(eventName, this.moveActionHandler, false);
    }, this);

     //Remove End Action Event Listeners
     this.endEvent.forEach(function(eventName) {
        document.removeEventListener(eventName, this.handleEnd, false);
    }, this);
}

toolkitSlider.prototype.syncValue = function() {
    // keep dom attributes persistent with object
    setInputValue(this.targetInput, this.value, 'value');
    this.targetInput.setAttribute("value", getInputValue(this.targetInput, 'value'));
}

toolkitSlider.prototype.setValue = function(value) {
    this.value = value;
    this.syncValue();
} 

toolkitSlider.prototype.update = function() {

    this.value = getInputValue(this.targetInput, 'value');
    this.min = getInputValue(this.targetInput, 'min');
    this.max = getInputValue(this.targetInput, 'max');
    this.step = getInputValue(this.targetInput, 'step');

    var position = this.getPositionFromValue();
    var handleWidth = this.sliderHandle.getBoundingClientRect()['width'];
    this.sliderHandle.style.left =  position + 'px';
    this.sliderFill.style.width = position - (handleWidth*0.5) + 'px';

}

toolkitSlider.prototype.init = function() {
    this.update();

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

toolkitSlider.prototype.valuefromMousePosition = function(e) {

    var handleWidth = this.sliderHandle.getBoundingClientRect()['width'];
    var trackWidth = this.sliderParent.getBoundingClientRect()['width'];
    var sliderBoundingCoord = (this.sliderParent.getBoundingClientRect()['left']);

    var mousePosition = ((e.clientX - (handleWidth*0.5)) - sliderBoundingCoord);
    var percentagePosition = (mousePosition/(trackWidth - handleWidth));
    var valueRange = this.max-this.min;
    var value = (valueRange * percentagePosition) + parseInt(this.min);

    return value;
}

toolkitSlider.prototype.getPositionFromValue = function() {

    var handleWidth = this.sliderHandle.getBoundingClientRect()['width'];
    var trackWidth = this.sliderParent.getBoundingClientRect()['width'];

    var valueRange = this.max-this.min;
    var pixelStep = (trackWidth - handleWidth)/valueRange;
    var position = ((this.value - this.min) * pixelStep) + handleWidth;

    return position;
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
    console.error('setInputValue was input param not equal to an HTMLElement object.');
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