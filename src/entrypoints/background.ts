export default defineBackground(() => {
  browser.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  // browser.tabs.onUpdated.addListener(function
  //     (tabId, changeInfo, tab) {
  //       // read changeInfo data and do something with it (like read the url)
  //       // console.log("changeinfo", changeInfo)
  //       if (changeInfo.url) {
  //         console.log("url changeed", changeInfo.url)
  //           browser.tabs.sendMessage( tabId, {
  //               message: 'switched tab',
  //               url: changeInfo.url
  //           })
  //       }
  //     }
  // );
});