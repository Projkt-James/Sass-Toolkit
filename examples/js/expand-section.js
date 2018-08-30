document.addEventListener("DOMContentLoaded", function() {
    
    var observerConfig = { characterData: true, attributes: true, childList: true, subtree: true};
    
    //Some array conversion for IE11
    var observers = document.querySelectorAll('section.expandable');
    observers = [].slice.call(observers);

    //Create an observer for each expandable section dom node
    observers.forEach(function(targetNode) {
    
        var observer = new MutationObserver(function (mutations) {
        
            observer.disconnect(); //Disconnect observer to make dom mutations
            
            console.log("Mutation occured on section: " + targetNode.querySelector('header > h1').innerHTML);
            sectionResizeHandler(targetNode);
            
            observer.observe(targetNode, observerConfig); //Reattach observer 
        });
        observer.observe(targetNode, observerConfig);
    });  

});


//Section Resize Handler (using Max-Height for animation reasons)
function sectionResizeHandler(section) {

    var header = section.querySelector('header');
    var content = section.querySelector('div');

    if(section.classList.contains('expanded')) {
        section.style.maxHeight = (content.offsetHeight + header.offsetHeight).toString() + "px"; 
    } else {
        section.style.maxHeight = (header.offsetHeight).toString() + "px";
    }
}

//Click Event Handlers
//Note: resizing is handled by the observer as it picks up this class change
function expandableSectionHandler(e) {
    e.classList.toggle('expanded');
}