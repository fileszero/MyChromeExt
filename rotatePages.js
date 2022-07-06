(function()
{
    class PageDef{
        constructor(url, staySec) {
            this.url = url;
            this.staySec = staySec;
        }
    }
    var targetTab=null;
    chrome.tabs.create({},(tab) =>{
        targetTab=tab;
    })

    const pages=[
        new PageDef("https://www.google.com/",3),
        new PageDef("https://www.yahoo.co.jp/",3),
        new PageDef("https://mail.google.com/mail/u/0/",3),
    ]
    var pageIdx=0;
    var mainLoop = function()
    {

        if (targetTab){
            if(pageIdx>=pages.length){
                pageIdx=0;
            }
            chrome.tabs.update(targetTab.id, {url:pages[pageIdx].url});
            setTimeout(mainLoop,1000*pages[pageIdx].staySec);
            pageIdx++;
        } else {
            setTimeout(mainLoop,1000*1);
        }
    };
    mainLoop();
})();

