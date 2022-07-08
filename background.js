(function()
{
    importScripts('PageDef.js')
    let pages=[]


    chrome.runtime.onInstalled.addListener(async ({}) => {
        console.log('oninstalled');
        await loadPages();
    });

    async function loadPages(){
        let items = await getStorage([DATA_SITES_TEXT]);
        this.pages=TextToPageDefArray(items[DATA_SITES_TEXT]);
        console.log(this.pages);
    }

    var targetTabId=null;
    var pageIdx=null;

    async function getTabId(){
        if(!targetTabId){
            let items = await getStorage([DATA_TAB_ID]);
            targetTabId=parseInt(items[DATA_TAB_ID])
        }
        return targetTabId;
    }
    async function setTabId(tabId){
        var save_data = {};
        save_data[DATA_TAB_ID]=tabId;
        await setStorage(save_data);
        targetTabId=tabId;
    }

    async function getPageIdx(){
        if(!pageIdx){
            let items = await getStorage([DATA_PAGE_IDX]);
            pageIdx=parseInt(items[DATA_PAGE_IDX])
            if(!pageIdx){
                pageIdx=0;
            }
        }
        return pageIdx;
    }
    async function setPageIdx(Idx){
        var save_data = {};
        save_data[DATA_PAGE_IDX]=Idx;
        await setStorage(save_data);
        pageIdx=Idx;
    }


    const ALARM_NAME="stay_min";
    chrome.alarms.onAlarm.addListener(async (alarm) =>{
        console.info("chrome.alarms.onAlarm!");
        if (alarm.name == ALARM_NAME) {
            await showPage();
        }
    });

    async function showPage(){
        if(this.pages.length<=0){
            await loadPages();
        }
        let idx=await getPageIdx();
        if(idx>=this.pages.length){
            idx=0;
        }
        let page=this.pages[idx];
        idx++;
        await setPageIdx(idx);

        let tabid=await getTabId();
        chrome.tabs.update(tabid, {url:page.url});
        chrome.alarms.clearAll(); //セットしたアラームをクリア
        chrome.alarms.create(ALARM_NAME, { "delayInMinutes": page.stay });
    }

    // https://developer.chrome.com/docs/extensions/mv3/service_workers/#filters
    // mainLoop();
    chrome.runtime.onMessage.addListener(async  (request, sender, sendResponse) => {
        if( request.type=="setTab"){
            await setTabId(request.tabId);
            if(request.pages.length>0){
                this.pages=request.pages;
            }
            await showPage();
        }
    });

})();

