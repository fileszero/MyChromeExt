window.onload = function() {
    chrome.storage.sync.get("data", function(items) {
      if (!chrome.runtime.error) {
        console.log(items);
        document.getElementById("sites").value = items.data;
      }
    });
  }

document.getElementById("btn").addEventListener("click", async () => {
    const sites_text=document.getElementById("sites").value;
    chrome.storage.sync.set({ "data" : sites_text }, function() {
        if (chrome.runtime.error) {
          console.log("Runtime error.");
        }
      });

    const sites = sites_text.split(/\n/);
    const pages=[];
    for(line of sites){
        console.info(line);
        const cols=line.replace(/[\s\t]+/,"\t").split(/\t/)
        if(cols.length>=1){
            const url=cols[0];
            const stay=cols.length>=2 ? parseInt(cols[1]) : 1;
            pages.push(new PageDef(url,stay))
        }
    }
    if(pages.length>0){
        await start(pages);
    }
});
async function start(pages){
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    targetTabId=tab.id;
    chrome.runtime.sendMessage({ type:"setTab",tabId:targetTabId,pages:pages });
    //mainLoop();
    //chrome.tabs.update(tab.id, {url:"https://calendar.google.com/calendar/u/1/r"});
}
