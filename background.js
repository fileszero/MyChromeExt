(function () {
    importScripts('PageDef.js')


    async function getPages() {
        const items = await getStorage([DATA_SITES_TEXT]);
        const pages = TextToPageDefArray(items[DATA_SITES_TEXT]);
        console.log(pages);
        return pages;
    }

    async function setPages(sites_text) {
        var save_data = {};
        save_data[DATA_SITES_TEXT] = sites_text;
        await setStorage(save_data);
    }

    async function getTabId() {
        const items = await getStorage([DATA_TAB_ID]);
        const id = parseInt(items[DATA_TAB_ID])
        return id;
    }
    async function setTabId(tabId) {
        var save_data = {};
        save_data[DATA_TAB_ID] = tabId;
        await setStorage(save_data);
    }

    async function getPageIdx() {
        const items = await getStorage([DATA_PAGE_IDX]);
        const Idx = parseInt(items[DATA_PAGE_IDX])
        if (!Idx) {
            return 0;
        }
        return Idx;
    }
    async function setPageIdx(Idx) {
        var save_data = {};
        save_data[DATA_PAGE_IDX] = Idx;
        await setStorage(save_data);
    }


    const ALARM_NAME = "stay_min";
    chrome.alarms.onAlarm.addListener(async (alarm) => {
        console.info("chrome.alarms.onAlarm!");
        if (alarm.name == ALARM_NAME) {
            await showPage();
        }
    });

    async function showPage() {
        const pages = await getPages();
        if (pages.length <= 0) {
            return;
        }
        let idx = await getPageIdx();
        if (idx >= pages.length) {
            idx = 0;
        }
        let page = pages[idx];
        idx++;
        await setPageIdx(idx);

        let tabid = await getTabId();
        chrome.tabs.update(tabid, { url: page.url });
        chrome.alarms.clearAll(); //セットしたアラームをクリア
        chrome.alarms.create(ALARM_NAME, { "delayInMinutes": page.stay });
    }

    // https://developer.chrome.com/docs/extensions/mv3/service_workers/#filters
    // mainLoop();
    chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
        if (request.type == "setTab") {
            await setTabId(request.tabId);
            await setPages(request.sites_text);
            await showPage();
        }
    });

    // chrome.tabs.onCreated.addListener(async (newtab) => {
    //     console.log("chrome.tabs.onCreated");
    //     console.log(newtab);
    //     if (newtab.url.indexOf("www.kimurak.net") != -1) {
    //         await setTabId(newtab.id);
    //         await showPage();
    //     }
    // });

    chrome.tabs.onActivated.addListener(function (activeInfo) {
        chrome.tabs.get(activeInfo.tabId, function (tab) {
            setAction(tab.url,activeInfo.tabId);
        });
    });

    chrome.tabs.onUpdated.addListener((tabId, change, tab) => {
        if (tab.active && change.url) {
            setAction(change.url,tabId);
        }
    });

    async function setAction(url,tabId) {
        console.log(url);
        const pattern = /^https:\/\/www.kimurak.net/;
        if (pattern.test(url)) {
            await setTabId(tabId);
            await showPage();
        }
    }
    //showPage();
    // chrome.tabs.create({url: 'onboarding.html' }, async (newtab) => {
    //     console.log(newtab);
    //     await setTabId(newtab.id);
    //     await showPage();
    // });

    // chrome.runtime.onInstalled.addListener( (reason) => {
    //     console.log("chrome.runtime.onInstalled.addListener:" + reason);
    //     if (reason.reason == chrome.runtime.OnInstalledReason.INSTALL || reason.reason == chrome.runtime.OnInstalledReason.UPDATE) {
    //       chrome.tabs.create({url: 'onboarding.html' }, async (newtab) => {
    //         console.log(newtab);
    //         await setTabId(newtab.id);
    //         await showPage();
    //       });
    //     }
    //   });

})();

