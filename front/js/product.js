/** 
* prints a single item
* @param { String } id
*/
async function printItem(id) {
    try {
        const fulldata = await getData("");
        if(!productExists(id, fulldata)){
            window.location.replace("index.html");
        }
    } catch(err) {
        window.location.replace("index.html");
    }
    try {
        const data = await getData(id);

        document.getElementById("title").innerHTML = data.name;
        document.title = data.name;
        document.getElementById("image_produit").src = data.imageUrl;
        document.getElementById("image_produit").alt = data.altTxt;
        document.getElementById("price").innerHTML = data.price;
        document.getElementById("description").innerHTML = data.description;

        //Adding <options> for colors
        const optionTemplate = "<option value=\"__COLOR__\">__COLOR__</option>\n";
        for (let i = 0; i < data.colors.length; i++) {
            const color = data.colors[i];
            let option = optionTemplate.replaceAll("__COLOR__", color);
            document.getElementById('colors').options.add(new Option(color, color));
        }
    }
    catch (err) {
        window.location.replace("index.html");
    }

}


/*CART*/
// Cart : array of obj{id, qty, color}

/** 
* Returns the index in the cart array of an element or -1 if it is not in the array
* @param { String } id
* @param { String } color
* @return { Number }
*/
function isInCart(id, color) {
    let res = -1;
    let cart = [];
    if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
    }

    for (let i = 0; i < cart.length; i++) {
        item = cart[i];
        if (item.id == id && item.color == color) {
            res = i;
        }
    }
    return res;
}

/** 
* Add an item to localstorage (item : id, quantity, color)
*/
function addToCart() {
    let id = getIdFromURL();
    let qty = Number(document.getElementById("quantity").value);
    let color = document.getElementById("colors").value;
    let cart = [];

    if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
    }

    if (id && (qty > 0) && (color != "0")) {
        const item = { id: id, qty: qty, color: color };

        let isItemInCart = isInCart(id, color);
        if (isItemInCart == -1) {

            cart.push(item);
            sendNotification("Ajouté au panier");
        } else {
            if (Number(cart[isItemInCart].qty) + qty <= 100) {
                cart[isItemInCart].qty = Number(cart[isItemInCart].qty) + Number(qty);
                sendNotification("Ajouté au panier");
            } else {
                sendNotification("Erreur : la quantité totale ne doit pas depasser 100.");
            }
        }
        localStorage.setItem("cart", JSON.stringify(cart));
    } else {
        if (qty <= 0) {
            sendNotification("Erreur : la quantité doit etre supérieure a zéro");
        }
        if (color == "0") {
            sendNotification("Erreur : choisir une couleur");
        }
    }
}


    /* MAIN */

let id = getIdFromURL();

    printItem(id);
