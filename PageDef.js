class PageDef{
    constructor(url, stay) {
        this.url = url;
        this.stay = stay;
    }
}
const getStorage = (key = null) => new Promise(resolve => {
    chrome.storage.local.get(key, (data) => {resolve(data)});
});
const setStorage = (value = null) => new Promise(resolve => {
    chrome.storage.local.set(value, () => {resolve()});
});


function TextToPageDefArray(sites_text){
    const pages=[];
    if( sites_text){
        const sites = sites_text.split(/\n/);
        for(line of sites){
            if(line.trim().startsWith("http")){
                console.info(line);
                const cols=line.replace(/[\s\t]+/,"\t").split(/\t/)
                if(cols.length>=1){
                    const url=cols[0];
                    const stay=cols.length>=2 ? parseInt(cols[1]) : 1;
                    pages.push(new PageDef(url,stay))
                }
            }
        }
    }
    return pages;
}
const DATA_SITES_TEXT="data_sites";
const DATA_TAB_ID="data_tabId";
const DATA_PAGE_IDX="data_pageIdx";
