$(document).ready( function() {

    function sectionResizeHandler(section) {

        var header = section.children('header');
        var content = section.children('div');

        if(section.hasClass('expanded')) {
            section.css("max-height", (content.height() + header.height()));
        } else {
            section.css("max-height", (header.height()));
        }
    }

    //Click event handler
    $('section.expandable').click( function() {
        $(this).toggleClass('expanded');
        sectionResizeHandler($(this));
    });
    
    var observerConfig = { characterData: true, attributes: true, childList: true, subtree: true};
    
    
    //Create an observer for each expandable node
    $('section.expandable').each( function() {
        
        var targetNode = $(this)[0];
        var observer = new MutationObserver(function (mutations) {
        
            observer.disconnect(); //Disconnect observer to make dom mutations
            
            console.log("Mutation occured on section: " + $(targetNode).find('header h1').text());
            sectionResizeHandler($(targetNode));
            
            observer.observe(targetNode, observerConfig); //Reattach observer 
        });
  
        observer.observe($(this)[0], observerConfig);

    });  

});
