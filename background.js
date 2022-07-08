(function()
{
    importScripts('PageDef.js')
    let pages=[
        new PageDef("https://www.google.com/",1),
        new PageDef("https://duckduckgo.com/",2),
        new PageDef("https://www.bing.com/",3),
    ]


    var targetTabId=null;
    var pageIdx=0;

    var mainLoop = function(url)
    {
        if (targetTab){
            chrome.tabs.update(targetTab.id, {url:url});
            return true;
        }
        return false;
    };
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webNavigation/onCompleted#additional_objects
    // chrome.webNavigation.onCompleted.addListener((details) => {
    //     console.info("chrome.webNavigation.onCompleted!");
    //     if(details.tabId==targetTabId){
    //         console.info("target tab!");
    //     }
    // });

    const ALARM_NAME="stay_min";
    chrome.alarms.onAlarm.addListener(function (alarm) {
        console.info("chrome.alarms.onAlarm!");
        if (alarm.name == ALARM_NAME) {
            if(pageIdx>=pages.length){
                pageIdx=0;
            }
            var page=pages[pageIdx];
            pageIdx++;
            chrome.tabs.update(targetTabId, {url:page.url});
            chrome.alarms.clearAll(); //セットしたアラームをクリア
            chrome.alarms.create(ALARM_NAME, { "delayInMinutes": page.stay });
        }
    });

    // https://developer.chrome.com/docs/extensions/mv3/service_workers/#filters
    // mainLoop();
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if( request.type=="setTab"){
            targetTabId=request.tabId;
            if(request.pages.length>0){
                pages=request.pages;
            }
            chrome.tabs.update(request.tabId, {url:pages[0].url});
            chrome.alarms.create(ALARM_NAME, { "delayInMinutes": pages[0].stay });
        }

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

