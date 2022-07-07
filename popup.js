class PageDef{
    constructor(url, stay) {
        this.url = url;
        this.stay = stay;
    }
}
const pages=[
    new PageDef("https://keep.google.com/u/1/#reminders",30/3),
    new PageDef("https://ticktick.com/webapp/#q/all/tasks",30/3),
    new PageDef("https://calendar.google.com/calendar/u/1/r",30/3),
    new PageDef("https://www.youtube.com/embed/coYw-eVU0Ks?autoplay=1",180/3),
    new PageDef("https://www.youtube.com/embed/H3D90-436C4?autoplay=1",180/3),
    new PageDef("https://www.nikkei.com/news/category/",60/3),
]

var pageIdx=0;
var targetTabId=0;

var mainLoop = function(tabId)
{

    if (targetTabId!=0){
        if(pageIdx>=pages.length){
            pageIdx=0;
        }
        chrome.tabs.update(targetTabId, {url:pages[pageIdx].url});
        setTimeout(mainLoop,1000*pages[pageIdx].stay);
        pageIdx++;
    } else {
        setTimeout(mainLoop,1000*1);
    }
};

chrome.runtime.onMessage.addListener(function(message, sender, callback) {
    if(message.type=="tabCreated"){
        targetTabId=message.tabId
        mainLoop();
    }
});
async function start(){
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    targetTabId=tab.id;
    chrome.runtime.sendMessage({ type:"setTab",tabId:targetTabId,url:pages[0].url,stay:pages[0].stay });
    //mainLoop();
    //chrome.tabs.update(tab.id, {url:"https://calendar.google.com/calendar/u/1/r"});
}
start()