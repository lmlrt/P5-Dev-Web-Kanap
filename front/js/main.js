
let productsListSource = "http://localhost:3000/api/products/";

/** 
* Fetches data for productId or all if productId is empty
* @param { String } productId
* @return { Object }
*/
async function getData(productId) {
    try {
        const source = productsListSource.concat(productId);
        const response = await fetch(source);
        const data = await response.json();
        return data;
    } catch(err) {
        sendNotification("Erreur de connexion a la base de donnee");
        throw -1;
    }
}



async function dataToCache() {
    fetch(productsListSource).then((response) => {
        if (!response.ok) {
          throw new TypeError("Erreur ");
        }
        return cache.put(url, response);
      });
}

/** 
* Returns the value of url parameter 'id'
* @return { String }
*/
function getIdFromURL() {
    const url = window.location.search;
    const urlParameters = new URLSearchParams(url);
    const id = urlParameters.get("id");
    if(id) {
        return id;
    } else {
        throw -1;
    }
}

/** 
* Shows a notification a the top of the screen
* @param { String } text
*/
function sendNotification(text) {
    document.createElement()
    let alertcontainer = document.getElementById("alert");
    alertcontainer.innerHTML = text;
    alertcontainer.style.display = "block";
}


/** 
* Check if an id is in the data from the API (data is only generated once per page and called as an argument)
* @param { String } id
* @return { Boolean }
*/
async function productExists(id, data) {
    let itemId = "0";
    for (let i = 0; i < data.length; i++) {
        itemId = data[i]._id;
        if(itemId == id) {
            return true;
        }
    }
    return false;
}