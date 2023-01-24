async function printItem(id) { //prints a single item

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
        var option = optionTemplate.replaceAll("__COLOR__", color);
        document.getElementById('colors').options.add(new Option(color, color));
    }
}


/*CART*/

function isInCart(id, color) { //returns the position of the id of the corresponding element in the cart array, -1 if it isn't in the cart
    var res = -1;
    var cart = [];
    if (localStorage.getItem("cart")) {
        var cart = localStorage.getItem("cart").split(",");
    }

    for (let i = 0; i < cart.length; i += 3) {
        if (cart[i] == id && cart[i + 2] == color) {
            res = i;
        }
    }

    return res;
}

function addToCart() { //add item to the cart (item : id, quantity, color)
    let id = getIdFromURL();
    let qty = document.getElementById("quantity").value;
    let color = document.getElementById("colors").value;
    var cart = [];
    var item = [];

    if (localStorage.getItem("cart")) {
        var cart = localStorage.getItem("cart").split(",");
    }

    if (id && (qty > 0) && (color != "0")) {
        item = [id, qty, color];

        let isItemInCart = isInCart(id, color);
        if (isItemInCart == -1) {
            cart.push(item);
            sendNotification("Ajouté au panier");
        } else {
            if (Number(cart[isItemInCart + 1]) + qty <= 100) {
                cart[isItemInCart + 1] = Number(cart[isItemInCart + 1]) + Number(qty);
                sendNotification("Ajouté au panier");
            } else {
                sendNotification("Erreur : la quantité totale ne doit pas depasser 100.");
            }
        }

        localStorage.setItem("cart", cart);
    } else {
        if(qty<=0) {
            sendNotification("Erreur : la quantité doit etre supérieure a zéro");
        }
        if(color=="0") {
            sendNotification("Erreur : choisir une couleur");
        }
    }
}

let id = getIdFromURL();

//verifying if id exists
if (id) {
    printItem(id);
} else {
    window.location.replace("index.html");
}
