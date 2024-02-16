const regexlng = /lng=(.*?)&/;
const regexlat = /lat=(.*?)&/;
const url = window.location.href;
const lng = regexlng.exec(url)[1];
const lat = regexlat.exec(url)[1];
checkIfSiteIsReady();


function checkIfSiteIsReady() {

    if (document.querySelector('li.vendor-tile-new-l') !== null) {
        // Webpage has loaded
        console.log(document.cookie);
        // Restaraunts at the top of the page with sliders sideways
        const topRestarauntLiElements = document.querySelectorAll('li.vendor-tile-new-m');
        // All restaraunts including closed but excluding the top slider panel ones.
        const allRestarauntLiElements = document.querySelectorAll('li.vendor-tile-new-l');

        // Add information for the top of the page restaraunts first
        topRestarauntLiElements.forEach(
            restaraunt => {
                const dataTestId = getDataTestId(restaraunt);
                fetchMinimumPrice(dataTestId, 'li.vendor-tile-new-m[data-testid="' + dataTestId + '"]');
            }
        )
        // Add information to rest of the restaraunts
        allRestarauntLiElements.forEach(
            restaraunt => {
                const dataTestId = getDataTestId(restaraunt);
                fetchMinimumPrice(dataTestId, 'li.vendor-tile-new-l[data-testid="' + dataTestId + '"]');
            }
        )

    } else {
        setTimeout(checkIfSiteIsReady, 100);
    }
}

function parsePerseusHeaders() {
    const regexPerseusClientId = /dhhPerseusGuestId=(.*?);/;
    const regexPerseusSessionId = /dhhPerseusSessionId=(.*?);/;
    const cookies = document.cookie;
    const perseusClientIdHeader = regexPerseusClientId.exec(cookies)[1] + ", " + regexPerseusClientId.exec(cookies)[1];
    const perseusSessionId = regexPerseusSessionId.exec(cookies)[1] + ", " + regexPerseusSessionId.exec(cookies)[1];
    return {
        clientId : perseusClientIdHeader,
        sessionId : perseusSessionId
    }
}

function fetchMinimumPrice(restarauntId, boxQuerySelector) {
    const headers = new Headers();
    const perseusHeaders = parsePerseusHeaders();
    headers.append("Perseus-Client-Id",perseusHeaders.clientId);
    headers.append("Perseus-Session-Id",perseusHeaders.sessionId);
    headers.append("Dps-Session-Id", "eyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==");
    fetch("https://po.fd-api.com/api/v5/vendors/" + restarauntId + "?include=menus,bundles,multiple_discounts,payment_types&language_id=1&opening_type=delivery&basket_currency=EUR&latitude=" + lat + "&longitude=" + lng,
    {
        // Request options
        headers: headers
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const box = document.querySelectorAll(boxQuerySelector);
            box.forEach(elem => {
                const existingParagraph = elem.querySelector('p[class="min-order-info"]');
                if (!existingParagraph) {
                    // Add the paragraph only if it doesn't exist already
                    elem.querySelector(' a div.vendor-info-row').innerHTML += '<p class="min-order-info">Minimitilaus: ' + data['data']['minimum_order_amount'] + '€</p>';
                }
            })
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function getDataTestId(liElement) {
    return liElement.getAttribute('data-testid');
}
