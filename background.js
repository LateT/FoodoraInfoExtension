chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action == "getPageSource") {
      var pageSource = request.source;
      // Do something with the page source, for example, log it to the console
      console.log("Page source:", pageSource);
    }
  });

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action == "fetchData") {
      fetch(request.url)
        .then(response => response.text())
        .then(data => sendResponse(data))
        .catch(error => console.error(error));
      return true; // Indicates that sendResponse will be called asynchronously
    }
  });


  