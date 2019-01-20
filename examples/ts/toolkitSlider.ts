enum InputProps {
    Value,
    Min,
    Max,
    Step
}

class ToolkitSlider {

    // Object elements
    targetInput: HTMLInputElement;
    sliderParent: HTMLElement;
    sliderHandle: HTMLElement;
    sliderFill: HTMLElement;
    params: { onInit?: (data: any) => void, onChange?: (data: any) => void };

    // Event lists
    initEvent: Array<String> = ['mousedown', 'touchstart', 'pointerdown'];
    moveEvent: Array<String> = ['mousemove', 'touchmove', 'pointermove'];
    endEvent: Array<String> = ['mouseup', 'touchend', 'pointerup'];

    // Observer variables
    observer: MutationObserver;
    observerConfig: MutationObserverInit = {characterData: true, attributes: true, childList: true, subtree: true};

    // Input properties
    value: number;
    min: number;
    max: number;
    step: number;

    constructor(targetInput: HTMLInputElement, params: { onInit?: (data: any) => void, onChange?: (data: any) => void }) {

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
        this.initEvent.forEach((eventName: string) => {
            this.sliderParent.addEventListener(eventName, this.initActionHandler);
        }, this);

        // MutationObserver to handle input attribute changes
        this.observerHandler = this.observerHandler.bind(this);
        this.observer = new MutationObserver(this.observerHandler);
        this.observer.observe(this.targetInput, this.observerConfig);

    }

    // Function to hide original input[type=range] DOM element
    private hideElement(element: HTMLElement) {
        element.style.position = "absolute";
        element.style.width = '1px';
        element.style.height = '1px';
        element.style.overflow = 'hidden';
        element.style.opacity = '0';
    }

    private observerHandler(mutations: MutationRecord[]) {

        this.observer.disconnect(); // Disconnect observer to make dom mutations

        mutations.forEach((mutation: MutationRecord) => {

            // Update value dom attribute
            if(mutation.type == "attributes" && mutation.attributeName == "value") {

                this.setInputProp(this.targetInput, InputProps.Value, this.targetInput.getAttribute("value"));
                this.targetInput.setAttribute("value", this.getInputProp(this.targetInput, InputProps.Value));

                this.update();
                this.onChange(); 
            }
        }, this);

        this.observer.observe(this.targetInput, this.observerConfig); // Reattach observer 
    }

    private initActionHandler(e: MouseEvent): void {
        e.preventDefault();

        // Do nothing if not actioned with primary mouse button
        if(e.button && e.button !== 0) { return; }

        // Update input value based on mousemovement 
        this.value = this.valueFromMousePosition(e);
        this.syncValue();

        // Init move action EventListeners
        this.moveEvent.forEach((eventName: string) => {
            document.addEventListener(eventName, this.moveActionHandler, false);
        }, this);

        // Init End Action EventListeners
        this.endEvent.forEach((eventName: string) => {
            document.addEventListener(eventName, this.endActionHandler, false);
        }, this);
    }

    private moveActionHandler(e: MouseEvent): void {
        e.preventDefault();

        // Update input value based on mousemovement 
        this.value = this.valueFromMousePosition(e);
        this.syncValue();
    }

    private endActionHandler(e: MouseEvent): void {
        e.preventDefault();

        // Remove Move Action Event Listeners
        this.moveEvent.forEach((eventName: string) => {
            document.removeEventListener(eventName, this.moveActionHandler, false);
        }, this);

        // Remove End Action Event Listeners
        this.endEvent.forEach((eventName: string) => {
            document.removeEventListener(eventName, this.endActionHandler, false);
        }, this);
    }

    private syncValue(): void {
        // Keep dom input attributes persistent with object
        this.setInputProp(this.targetInput, InputProps.Value, this.value);
        this.targetInput.setAttribute("value", this.getInputProp(this.targetInput, InputProps.Value));
    }

    public getValue(): number {
        return parseInt(this.getInputProp(this.targetInput, InputProps.Value));
    }

    public setValue(value: number) {
        this.value = value;
        this.syncValue();
    }

    private update(): void {
        this.value = parseInt(this.getInputProp(this.targetInput, InputProps.Value));
        this.min = parseInt(this.getInputProp(this.targetInput, InputProps.Min));
        this.max = parseInt(this.getInputProp(this.targetInput, InputProps.Max));
        this.step = parseInt(this.getInputProp(this.targetInput, InputProps.Step));

        var position = this.getPositionFromValue();
        var handleWidth = this.sliderHandle.getBoundingClientRect()['width'];
        this.sliderHandle.style.left =  position + 'px';
        this.sliderFill.style.width = position - (handleWidth*0.5) + 'px';
    }

    private init(): void {
        this.update();
        if(this.params.onInit && typeof this.params.onInit === 'function') {
            var self = this;
            this.params.onInit(self);
        }
    }

    private onChange(): void {
        if(this.params.onChange && typeof this.params.onChange === 'function') {
            let self = this;
            this.params.onChange(self);
        }
    }

    private valueFromMousePosition(e: MouseEvent): number {
        let handleWidth: number = this.sliderHandle.getBoundingClientRect()['width'];
        let trackWidth: number = this.sliderParent.getBoundingClientRect()['width'];
        let sliderBoundingCoord: number = (this.sliderParent.getBoundingClientRect()['left']);

        let mousePosition: number = ((e.clientX - (handleWidth*0.5)) - sliderBoundingCoord);
        let percentagePosition: number = (mousePosition/(trackWidth - handleWidth));
        let valueRange: number = this.max-this.min;

        return (valueRange * percentagePosition) + this.min;
    }

    private getPositionFromValue(): number {
        let handleWidth: number = this.sliderHandle.getBoundingClientRect()['width'];
        let trackWidth: number = this.sliderParent.getBoundingClientRect()['width'];

        let valueRange: number = this.max-this.min;
        let pixelStep = (trackWidth - handleWidth)/valueRange;

        return ((this.value - this.min) * pixelStep) + handleWidth;
    }

    //
    // Helper Functions
    //

    private setInputProp(inputElement: HTMLInputElement, prop: InputProps, value: number|string) {
        switch(prop) {
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
    }

    private getInputProp(inputElement: HTMLInputElement, prop: InputProps) {
        switch(prop) {
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
    }

}

