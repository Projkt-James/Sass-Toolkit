//Constuctor function
function toolkitSlider(targetInput, params) {

    //Set HTMLELEMENT Objects
    this.targetInput = targetInput;
    hideElement(this.targetInput);
    
    this.sliderParent = document.createElement('div');
    this.sliderParent.classList.add('toolkitSlider');

    this.sliderHandle = document.createElement('span');
    this.sliderHandle.classList.add('handle');

    //Insert elements after the target input
    this.targetInput.after(this.sliderParent);
    this.sliderParent.appendChild(this.sliderHandle);

    this.params = params;
    
    this.init();

     // Function that hides original input[type=range] DOM element
    function hideElement(element) {
        element.style.position = "absolute";
        element.style.width = '1px';
        element.style.height = '1px';
        element.style.overflow = 'hidden';
        element.style.opacity = '0';
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
        } 
    } 
    console.error('getInputValue was input param not equal to an HTMLElement object.');
}

toolkitSlider.prototype.init = function() {
    this.update(true);

    if(this.params.onInit && typeof this.params.onInit === 'function') {
        var self = this;
        this.params.onInit(self);
    }
}

toolkitSlider.prototype.onChange = function() {

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




document.addEventListener("DOMContentLoaded", function() {

    var y = document.querySelector('#test');

    var x = new toolkitSlider(y, {

        onInit: function(data) {
            console.log('Init callback working:' + data.value);
            console.log('min:' + data.min);
            console.log('max:' + data.max);
            console.log('step:' + data.max);
        },
        onChange: function() {

        }

    });


});

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

