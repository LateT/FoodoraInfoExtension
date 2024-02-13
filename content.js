const regex = /lng=(.*?)&lat=(.*?)&/;
const url = window.location.href;
const match = regex.exec(url);
const lng = match[1];
const lat = match[2];
checkIfSiteIsReady();


function checkIfSiteIsReady() {

    if (document.querySelector('li.vendor-tile-new-l') !== null) {
        // Webpage has loaded

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
            // li.vendor-tile-new-m[data-testid="a6ut"] a div.vendor-info-row
            // li.vendor-tile-new-m[data-testid="' + dataTestId + '"]
            // document.querySelector('li.vendor-tile-new-m[data-testid="a6ut"] a div.vendor-info-row').innerHTML += '<p>Testi</p>';
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

function fetchMinimumPrice(restarauntId, boxQuerySelector) {

    fetch("https://po.fd-api.com/api/v5/vendors/" + restarauntId + "?include=menus,bundles,multiple_discounts,payment_types&language_id=1&opening_type=delivery&basket_currency=EUR&latitude=" + lat + "&longitude=" + lng)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const box = document.querySelectorAll(boxQuerySelector);
            box.forEach( elem => {
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
