class PageDef{
    constructor(url, staySec) {
        this.url = url;
        this.staySec = staySec;
    }
}
const pages=[
    new PageDef("https://keep.google.com/u/1/#reminders",30),
    new PageDef("https://ticktick.com/webapp/#q/all/tasks",30),
    new PageDef("https://calendar.google.com/calendar/u/1/r",30),
    new PageDef("https://www.youtube.com/embed/coYw-eVU0Ks?autoplay=1",180),
    new PageDef("https://www.youtube.com/embed/H3D90-436C4?autoplay=1",180),
    new PageDef("https://www.nikkei.com/news/category/",60),
]

var pageIdx=0;
var targetTabId=0;



var mainLoop = function()
{
    if(pageIdx>=pages.length){
        pageIdx=0;
    }
    var page=pages[pageIdx];

    // https://kuroeveryday.blogspot.com/2015/06/ChromeExtensionssendMessage.html
    chrome.runtime.sendMessage(
        {
            type:"setUrl",
            url:page.url,
            tabId:targetTabId
        },
        function (response) {
            if(response){
                pageIdx++;
            }
            setTimeout(mainLoop,1000*page.staySec);
        }
    );
}
chrome.runtime.onMessage.addListener(function(message, sender, callback) {
    if(message.type=="tabCreated"){
        targetTabId=message.tabId
        mainLoop();
    }
});

chrome.runtime.sendMessage({ type:"newTab" }, function (response) {
    targetTab=response;
});

