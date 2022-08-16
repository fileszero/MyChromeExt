
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
    await start(sites_text);
});
async function start(sites_text){
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    targetTabId=tab.id;
    chrome.runtime.sendMessage({ type:"setTab",tabId:targetTabId,sites_text:sites_text });
    window.close();
    //mainLoop();
    //chrome.tabs.update(tab.id, {url:"https://calendar.google.com/calendar/u/1/r"});
}
