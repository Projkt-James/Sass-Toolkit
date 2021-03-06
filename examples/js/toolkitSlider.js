var InputProps;
(function (InputProps) {
    InputProps[InputProps["Value"] = 0] = "Value";
    InputProps[InputProps["Min"] = 1] = "Min";
    InputProps[InputProps["Max"] = 2] = "Max";
    InputProps[InputProps["Step"] = 3] = "Step";
})(InputProps || (InputProps = {}));
var ToolkitSlider = /** @class */ (function () {
    function ToolkitSlider(targetInput, params) {
        var _this = this;
        // Event lists
        this.initEvent = ['mousedown', 'touchstart', 'pointerdown'];
        this.moveEvent = ['mousemove', 'touchmove', 'pointermove'];
        this.endEvent = ['mouseup', 'touchend', 'pointerup'];
        this.observerConfig = { characterData: true, attributes: true, childList: true, subtree: true };
        this.targetInput = targetInput;
        this.hideElement(this.targetInput);
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
        this.init();
        // Bind scope of this object to EventListener handlers
        this.initActionHandler = this.initActionHandler.bind(this);
        this.moveActionHandler = this.moveActionHandler.bind(this);
        this.endActionHandler = this.endActionHandler.bind(this);
        // Init slider handle starting action EventListeners
        this.initEvent.forEach(function (eventName) {
            _this.sliderParent.addEventListener(eventName, _this.initActionHandler);
        }, this);
        // MutationObserver to handle input attribute changes
        this.observerHandler = this.observerHandler.bind(this);
        this.observer = new MutationObserver(this.observerHandler);
        this.observer.observe(this.targetInput, this.observerConfig);
    }
    // Function to hide original input[type=range] DOM element
    ToolkitSlider.prototype.hideElement = function (element) {
        element.style.position = "absolute";
        element.style.width = '1px';
        element.style.height = '1px';
        element.style.overflow = 'hidden';
        element.style.opacity = '0';
    };
    ToolkitSlider.prototype.observerHandler = function (mutations) {
        var _this = this;
        this.observer.disconnect(); // Disconnect observer to make dom mutations
        mutations.forEach(function (mutation) {
            // Update value dom attribute
            if (mutation.type == "attributes" && mutation.attributeName == "value") {
                _this.setInputProp(_this.targetInput, InputProps.Value, _this.targetInput.getAttribute("value"));
                _this.targetInput.setAttribute("value", _this.getInputProp(_this.targetInput, InputProps.Value));
                _this.update();
                _this.onChange();
            }
        }, this);
        this.observer.observe(this.targetInput, this.observerConfig); // Reattach observer 
    };
    ToolkitSlider.prototype.initActionHandler = function (e) {
        var _this = this;
        e.preventDefault();
        // Do nothing if not actioned with primary mouse button
        if (e.button && e.button !== 0) {
            return;
        }
        // Update input value based on mousemovement 
        this.value = this.valueFromMousePosition(e);
        this.syncValue();
        // Init move action EventListeners
        this.moveEvent.forEach(function (eventName) {
            document.addEventListener(eventName, _this.moveActionHandler, false);
        }, this);
        // Init End Action EventListeners
        this.endEvent.forEach(function (eventName) {
            document.addEventListener(eventName, _this.endActionHandler, false);
        }, this);
    };
    ToolkitSlider.prototype.moveActionHandler = function (e) {
        e.preventDefault();
        // Update input value based on mousemovement 
        this.value = this.valueFromMousePosition(e);
        this.syncValue();
    };
    ToolkitSlider.prototype.endActionHandler = function (e) {
        var _this = this;
        e.preventDefault();
        // Remove Move Action Event Listeners
        this.moveEvent.forEach(function (eventName) {
            document.removeEventListener(eventName, _this.moveActionHandler, false);
        }, this);
        // Remove End Action Event Listeners
        this.endEvent.forEach(function (eventName) {
            document.removeEventListener(eventName, _this.endActionHandler, false);
        }, this);
    };
    ToolkitSlider.prototype.syncValue = function () {
        // Keep dom input attributes persistent with object
        this.setInputProp(this.targetInput, InputProps.Value, this.value);
        this.targetInput.setAttribute("value", this.getInputProp(this.targetInput, InputProps.Value));
    };
    ToolkitSlider.prototype.getValue = function () {
        return parseInt(this.getInputProp(this.targetInput, InputProps.Value));
    };
    ToolkitSlider.prototype.setValue = function (value) {
        this.value = value;
        this.syncValue();
    };
    ToolkitSlider.prototype.update = function () {
        this.value = parseInt(this.getInputProp(this.targetInput, InputProps.Value));
        this.min = parseInt(this.getInputProp(this.targetInput, InputProps.Min));
        this.max = parseInt(this.getInputProp(this.targetInput, InputProps.Max));
        this.step = parseInt(this.getInputProp(this.targetInput, InputProps.Step));
        var position = this.getPositionFromValue();
        var handleWidth = this.sliderHandle.getBoundingClientRect()['width'];
        this.sliderHandle.style.left = position + 'px';
        this.sliderFill.style.width = position - (handleWidth * 0.5) + 'px';
    };
    ToolkitSlider.prototype.init = function () {
        this.update();
        if (this.params.onInit && typeof this.params.onInit === 'function') {
            var self = this;
            this.params.onInit(self);
        }
    };
    ToolkitSlider.prototype.onChange = function () {
        if (this.params.onChange && typeof this.params.onChange === 'function') {
            var self_1 = this;
            this.params.onChange(self_1);
        }
    };
    ToolkitSlider.prototype.valueFromMousePosition = function (e) {
        var handleWidth = this.sliderHandle.getBoundingClientRect()['width'];
        var trackWidth = this.sliderParent.getBoundingClientRect()['width'];
        var sliderBoundingCoord = (this.sliderParent.getBoundingClientRect()['left']);
        var mousePosition = ((e.clientX - (handleWidth * 0.5)) - sliderBoundingCoord);
        var percentagePosition = (mousePosition / (trackWidth - handleWidth));
        var valueRange = this.max - this.min;
        return (valueRange * percentagePosition) + this.min;
    };
    ToolkitSlider.prototype.getPositionFromValue = function () {
        var handleWidth = this.sliderHandle.getBoundingClientRect()['width'];
        var trackWidth = this.sliderParent.getBoundingClientRect()['width'];
        var valueRange = this.max - this.min;
        var pixelStep = (trackWidth - handleWidth) / valueRange;
        return ((this.value - this.min) * pixelStep) + handleWidth;
    };
    //
    // Helper Functions
    //
    ToolkitSlider.prototype.setInputProp = function (inputElement, prop, value) {
        switch (prop) {
            default:
            case InputProps.Value:
                return inputElement.value = value.toString();
            case InputProps.Min:
                return inputElement.min = value.toString();
            case InputProps.Max:
                return inputElement.max = value.toString();
            case InputProps.Step:
                return inputElement.step = value.toString();
        }
    };
    ToolkitSlider.prototype.getInputProp = function (inputElement, prop) {
        switch (prop) {
            default:
            case InputProps.Value:
                return inputElement.value;
            case InputProps.Min:
                return inputElement.min;
            case InputProps.Max:
                return inputElement.max;
            case InputProps.Step:
                return inputElement.step;
        }
    };
    return ToolkitSlider;
}());
