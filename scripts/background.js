chrome.storage.local.set({
  'darkmodeFlag': 0
});
chrome.runtime.onMessage.addListener(
  function(request, sender,sendResponse) {
    
      if (request.type == 'getUserSolution') {
        chrome.scripting.executeScript({
          target: {tabId: sender.tab.id},
          files: ['scripts/extractCode.js'],
          world: 'MAIN',
        });
        sendResponse({status: true});
      }

      if ( request.type == 'deleteNode' ) {
        chrome.scripting.executeScript({
          target: {tabId: sender.tab.id},
          files: ['scripts/nodeDeletion.js'],
          world: 'MAIN',
        });
        sendResponse({status: true});
      }

      if (request && request.removeCurrentTab === true && request.AuthenticationSuccessful === true) {
        chrome.storage.local.set({ githubUsername: request.githubUsername }, () => {});
        chrome.storage.local.set({ githubAccessToken: request.accessToken }, () => {});
        chrome.storage.local.set({ pipeFlag: false }, () => {});
        const indexURL = chrome.runtime.getURL('index.html');
        chrome.tabs.create({ url: indexURL, active: true });
      }

      else if (request && request.removeCurrentTab === true && request.AuthenticationSuccessful === false) {
        alert('Couldn\'t Authenticate your GitHub Account. Please try again later!');
      }
  }
);