
let productsListSource = "http://localhost:3000/api/products/";


async function getData(product) {
    const source = productsListSource.concat(product);
    const response = await fetch(source);
    const data = await response.json();
    return data;
}

async function getItemData(id) {
    const data = await getData(id);
    const name = data.name;
    const price = data.price;
    const img = data.imageUrl;
    const alt = data.altTxt;
    const description = data.description;
    const res = { name: name, price: price, img: img, alt: alt, description: description };

    return res;
}

function getIdFromURL() { //returns the value of url parameter 'id'
    const url = window.location.search;
    const urlParameters = new URLSearchParams(url);
    const id = urlParameters.get("id");
    return id;
}

function sendNotification(text) {
    var alertcontainer = document.getElementById("alert");
    alertcontainer.innerHTML = text;
    alertcontainer.style.display = "block";
}



