(function()
{
    var targetTab=null;

    var pageIdx=0;
    var mainLoop = function(url)
    {
        if (targetTab){
            chrome.tabs.update(targetTab.id, {url:url});
            return true;
        }
        return false;
    };
    // mainLoop();
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if( request.type=="newTab"){
            chrome.tabs.create({},(tab) =>{
                sendResponse(tab.id);
                chrome.tabs.sendMessage(sender.tab.id,{type:"tabCreated",tabId:tab.id},null);
            })
        }
        if( request.type=="setUrl"){
            chrome.tabs.update(request.tabId, {url:request.url});
            sendResponse(true);
        }
    });

})();

