document.addEventListener("DOMContentLoaded", () => {

    let observerConfig = { characterData: true, attributes: true, childList: true, subtree: true};

    let observers: Array<HTMLElement> = <HTMLElement[]>arrayFromNodeList(document.querySelectorAll('section.expandable'));

    observers.forEach((targetNode) => {

        let observer: MutationObserver = new MutationObserver((mutations) => {
            
            observer.disconnect(); //Disconnect observer to make dom mutations

            sectionResizeHandler(targetNode);

            observer.observe(targetNode, observerConfig); //Reattach observer after dom mutations
        });
        //Initalise each observer
        observer.observe(targetNode, observerConfig);
    });
});

//Section Resize Handler (using Max-Height for animation reasons)
function sectionResizeHandler(section: HTMLElement): void {

    let header: HTMLElement = section.querySelector('header');
    let content: HTMLElement = section.querySelector('div');

    if(section.classList.contains('expanded')) {
        section.style.maxHeight = (content.offsetHeight + header.offsetHeight).toString() + "px"; 
    } else {
        section.style.maxHeight = (header.offsetHeight).toString() + "px";
    }
}

//Click Event Handlers
//Note: resizing is handled by the observer as it picks up this class change
function expandableSectionHandler(e): void {
    e.classList.toggle('expanded');
}

//Deep copy array from NodeList object
function arrayFromNodeList(nodeList: NodeList): Array<Node> {
    let array: Array<Node> = [];
    for (let key in nodeList) {
        array.push(nodeList[key]);
    }
    return array;
}


