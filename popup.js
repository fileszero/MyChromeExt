
window.onload = async function() {
    let items = await getStorage([DATA_SITES_TEXT]);
    console.info(items);
    if (!chrome.runtime.error) {
        console.log(items);
        console.log(items[DATA_SITES_TEXT]);
        document.getElementById("sites").value = items[DATA_SITES_TEXT];
    };
  }

document.getElementById("btn").addEventListener("click", async () => {
    const sites_text=document.getElementById("sites").value;
    var save_data = {};
    save_data[DATA_SITES_TEXT]=sites_text;
    await setStorage(save_data);

    const pages=TextToPageDefArray(sites_text);
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
