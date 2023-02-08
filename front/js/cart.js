/* CONST */
const namePattern = "[a-zA-Z-']{2,}"; //2 letters or more, including - and '
const addressPattern = "[0-9]{1,4}[a-zA-Z -]{1,64}";// 1 to 4 numbers and 1 to 64 characters (letters, dash, apostrophe, space)
const emailPattern = "[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*"; // same pattern used by HTML for input type="email"


/* FUNCTIONS */
/** 
* Updates the total count for items and price
* @param { Array } cart
*/
async function updateCartTotal(cart) {
    let qtyTotal = 0;
    let cartTotal = 0.0;

    for (let i = 0; i < cart.length; i++) {
        const itemData = await getData(cart[i].id);

        cartTotal += Number(itemData.price) * Number(cart[i].qty);
        qtyTotal += Number(cart[i].qty);
    }

    document.getElementById("totalQuantity").innerHTML = qtyTotal;
    document.getElementById("totalPrice").innerHTML = cartTotal;
}

/** 
* Prints the cart from local storage
*/
async function printCart() {

    try {
        let cart = JSON.parse(localStorage.getItem("cart"));
        if (cart && cart[0]) {

            let cart = JSON.parse(localStorage.getItem("cart"));
            let cartCode = "";


            const cartItemTemplate = `<article class="cart__item" data-id="__ID__" data-color="__COLOR__">
        <div class="cart__item__img">
          <img src="__IMGSRC__" alt="__ALTTEXT__">
        </div>
        <div class="cart__item__content">
          <div class="cart__item__content__description">
            <h2>__NAME__</h2>
            <p>__COLOR__</p>
            <p>__PRICE__ €</p>
          </div>
          <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
              <p>Qté : </p>
              <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="__QTY__">
            </div>
            <div class="cart__item__content__settings__delete">
              <p class="deleteItem">Supprimer</p>
            </div>
          </div>
        </div>
      </article>`;

            for (let i = 0; i < cart.length; i++) {
                const itemData = await getData(cart[i].id);
                let itemCode = cartItemTemplate.replace('__ID__', cart[i].id);

                itemCode = itemCode.replace(/__COLOR__/g, cart[i].color); // /g replaces all instances in a string
                itemCode = itemCode.replace('__QTY__', cart[i].qty);
                itemCode = itemCode.replace('__NAME__', itemData.name);
                itemCode = itemCode.replace('__IMGSRC__', itemData.imageUrl);
                itemCode = itemCode.replace('__PRICE__', itemData.price);
                itemCode = itemCode.replace('__DESCRIPTION__', itemData.description);
                itemCode = itemCode.replace('__ALTTEXT__', itemData.altTxt);

                cartCode += itemCode;

            }
            document.getElementById("cart__items").innerHTML = cartCode;
            updateCartTotal(cart);
        } else {
            document.getElementById("cart__items").innerHTML = "Votre panier est vide";
        }
    } catch (err) {
        document.getElementById("cart__items").innerHTML = "Erreur de connexion avec l'API";
        throw -1;
    }
}



/** 
* Returns the quantity of an item
* @param { HTMLElement } item
* @return { String }
*/
function getItemQty(item) {
    return item.closest(".itemQuantity").value;
}
/** 
* Returns the position in cart array (index) of an item
* @param { HTMLElement } item
* @param { Array } cart
* @return { String | Number }
*/
function getItemPos(item, cart) {
    const id = item.closest(".cart__item").getAttribute("data-id");
    const color = item.closest(".cart__item").getAttribute("data-color");
    let tempId;
    let tempColor;

    for (let i = 0; i < cart.length; i++) {
        tempId = cart[i].id;
        tempColor = cart[i].color;
        if ((id == tempId) && (color == tempColor)) {
            return i;
        }
    }
    return -1;
}

/** 
* Updates local storage with the new quantity from form
*/
function updateCart() { //
    let cart = JSON.parse(localStorage.getItem("cart"));
    const qty = getItemQty(this);
    const pos = getItemPos(this, cart);
    if (pos >= 0) {
        cart[pos].qty = Number(qty);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartTotal(cart);
    }
}

/** 
* Returns a cart array without the removed items
* @param { Array } cart
* @return { Array }
*/
function removeDeletedItems(cart) {
    let newCart = [];
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id != "void" && cart[i].qty != "void" && cart[i].color != "void") {
            newCart.push(cart[i]);
        }
    }
    return newCart;
}

/** 
* Removes an item data from cart in local storage
*/
function deleteFromCart() {
    let cart = JSON.parse(localStorage.getItem("cart"));
    const itemPos = getItemPos(this, cart);

    cart[itemPos].id = "void";
    cart[itemPos].qty = "void";
    cart[itemPos].color = "void";
    cart = removeDeletedItems(cart);

    localStorage.setItem("cart", JSON.stringify(cart));
    printCart();
    initEventListeners();
}

/**
 * Initializes all events listeners
 */
async function initEventListeners() {
    await printCart();

    let qtyInputs = document.getElementsByClassName("itemQuantity"); //listeners for quantity inputs
    for (let i = 0; i < qtyInputs.length; i++) {
        qtyInputs[i].addEventListener("change", updateCart);
    }

    let removeButtons = document.getElementsByClassName("deleteItem"); // listeners for remove buttons
    for (let i = 0; i < removeButtons.length; i++) {
        removeButtons[i].addEventListener("click", deleteFromCart);
    }

    document.getElementById("cart_order_form").addEventListener("submit", checkOrderForm, true); //listener for form submition
}

/**
 * Sets patterns for inputs fields
 */
function initFormPatterns() {
    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const address = document.getElementById("address");
    const city = document.getElementById("city");
    const email = document.getElementById("email");

    firstName.pattern = namePattern;
    lastName.pattern = namePattern;
    address.pattern = addressPattern;
    city.pattern = namePattern;
    email.pattern = emailPattern;
}

/** 
* Checks if an input is valid
* @param { String } input
* @param { String } type
* @return { Number }
*/
function isInputValid(input, type) {
    switch (type) {
        case "name":
            var re = new RegExp(namePattern);
            return re.test(input);
        case "email":
            var re = new RegExp(emailPattern);
            return re.test(input);
        case "address":
            var re = new RegExp(addressPattern);
            return re.test(input);
        default:
            return -1;
    }
}

/** 
* Checks if an id/color combination exists in the data
* @param { Object } item
* @return { Boolean }
*/
async function isItemValid(item) {
    const data = await getData("");
    if(productExists(item.id, data)) {
        for (let i = 0; i < data.length; i++) {
            tempColorArray = data[i].colors;
            for (let j = 0; j < tempColorArray.length; j++) {
                const tempColor = tempColorArray[j];
                if(tempColor == item.color) {
                    return true;
                }
            }
        }
    }
    return false;
}
/** 
* Checks if the form contains valid data
* @param { Event } event
*/
var checkOrderForm = function (event) {
    event.preventDefault();

    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let address = document.getElementById("address").value;
    let city = document.getElementById("city").value;
    let email = document.getElementById("email").value;
    let stop = false;

    if (isInputValid(firstName, "name") && isInputValid(lastName, "name") && isInputValid(address, "address") && isInputValid(city, "name") && isInputValid(email, "email")) {
        //form is valid

        let contact = { firstName: firstName, lastName: lastName, address: address, city: city, email: email };


        let products = [];
        let cart = JSON.parse(localStorage.getItem("cart"));
        for (let i = 0; i < cart.length; i++) {
            if(isItemValid(cart[i])) {
                products.push(cart[i]);
            } else {
                stop=true;
            }
        }
        if(stop) {
            sendNotification("Erreur : produit invalide");
        }else{
            sendOrder(contact, products);
        }
        


    } else {
        console.log("prenom : "+isInputValid(firstName, "name")+" prenom :"+isInputValid(lastName, "name")+"address :"+isInputValid(address, "address")+"city :"+isInputValid(city, "name")+"email :"+isInputValid(email, "email"));
        //form is not valid
        let error = "Erreur dans le formulaire : ";
        if (!isInputValid(firstName, "name")) {
            error = error.concat("prénom ");
        }
        if (!isInputValid(lastName, "name")) {
            error = error.concat("nom ");
        }
        if (!isInputValid(email, "email")) {
            error = error.concat("email ");
        }
        if (!isInputValid(city, "name")) {
            error = error.concat("ville ");
        }
        if (!isInputValid(address, "address")) {
            error = error.concat("addresse ");
        }
        sendNotification(error);
    }
};

/** 
* Send a valid order to be processed
* @param { Object } contact
* @param { Array } products
*/
async function sendOrder(contact, products) {
    let url = "http://localhost:3000/api/products/order";

    let productsArray = [];
    for (let i = 0; i < products.length; i++) {
        const item = products[i];
        productsArray.push(item.id);
    }
    let content = { contact: contact, products: productsArray };

    let res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(content),
    });

    if (res.ok) {
        let ret = await res.json();
        let confirmUrl = "confirmation.html?id=" + ret.orderId;

        window.location.replace(confirmUrl);

    } else {
        return `HTTP error: ${res.status}`;
    }
}

/* MAIN */
initEventListeners();
initFormPatterns();

