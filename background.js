(function()
{
    class PageDef{
        constructor(url, staySec) {
            this.url = url;
            this.staySec = staySec;
        }
    }
    const pages=[
        new PageDef("https://keep.google.com/u/1/#reminders",1),
        new PageDef("https://www.youtube.com/embed/coYw-eVU0Ks?autoplay=1",3),
        new PageDef("https://ticktick.com/webapp/#q/all/tasks",1),
        new PageDef("https://calendar.google.com/calendar/u/1/r",1),
        new PageDef("https://www.youtube.com/embed/H3D90-436C4?autoplay=1",3),
        new PageDef("https://www.nikkei.com/news/category/",1),
        new PageDef("https://www.youtube.com/embed/sRbzjQTxvPE?autoplay=1",3),
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
    chrome.webNavigation.onCompleted.addListener((details) => {
        console.info("chrome.webNavigation.onCompleted!");
        if(details.tabId==targetTabId){
            console.info("target tab!");
        }
    });

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
            chrome.alarms.create(ALARM_NAME, { "delayInMinutes": 1 });
        }
    });

    // https://developer.chrome.com/docs/extensions/mv3/service_workers/#filters
    // mainLoop();
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if( request.type=="setTab"){
            targetTabId=request.tabId;
            chrome.tabs.update(request.tabId, {url:request.url});
            chrome.alarms.create(ALARM_NAME, { "delayInMinutes": 1 });
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

