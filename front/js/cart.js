async function updateCartTotal(cart) {
    var qtyTotal = 0;
    var cartTotal = 0.0;

    for (let i = 0; i < cart.length - 2; i += 3) {
        const itemData = await getItemData(cart[i]);

        cartTotal += Number(itemData.price) * Number(cart[i + 1]);
        qtyTotal += Number(cart[i + 1]);
    }

    document.getElementById("totalQuantity").innerHTML = qtyTotal;
    document.getElementById("totalPrice").innerHTML = cartTotal;
}
async function printCart() { //prints the cart from local storage

    if (localStorage.getItem("cart")) {

        var cart = localStorage.getItem("cart").split(",");
        var cartCode = "";


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


        //cart : array, 3 items / elements of cart
        //cart[n] : id
        //cart[n+1] : quantity
        //cart[n+2] : color
        for (let i = 0; i < cart.length - 2; i += 3) {
            const itemData = await getItemData(cart[i]);
            var itemCode = cartItemTemplate.replace('__ID__', cart[i]);

            itemCode = itemCode.replace('__COLOR__', cart[i + 2]);
            itemCode = itemCode.replace('__COLOR__', cart[i + 2]); //check
            itemCode = itemCode.replace('__QTY__', cart[i + 1]);
            itemCode = itemCode.replace('__NAME__', itemData.name);
            itemCode = itemCode.replace('__IMGSRC__', itemData.img);
            itemCode = itemCode.replace('__PRICE__', itemData.price);
            itemCode = itemCode.replace('__DESCRIPTION__', itemData.description);
            itemCode = itemCode.replace('__ALTTEXT__', itemData.alt);

            cartCode += itemCode;

        }
        document.getElementById("cart__items").innerHTML = cartCode;
        updateCartTotal(cart);
    }
}

function findItemId(id, color, cart) { //return the index of 'id' in the array, -1 if the item is not in the cart
    var tempId;
    var tempColor;
    for (let i = 0; i < cart.length - 2; i += 3) {
        tempId = cart[i];
        tempColor = cart[i + 2];
        if ((id == tempId) && (color == tempColor)) {
            return i;
        }
    }
    return -1;
}

function getItemQty(item) {
    return item.closest(".itemQuantity").value;
}
function getItemPos(item, cart) {
    const id = item.closest(".cart__item").getAttribute("data-id");
    const color = item.closest(".cart__item").getAttribute("data-color");
    const pos = findItemId(id, color, cart);
    return pos;
}


function updateCart() { //updates local storage with the new quantity from form
    var cart = localStorage.getItem("cart").split(",");
    const qty = getItemQty(this, cart);
    const pos = getItemPos(this);

    cart[pos + 1] = qty;
    localStorage.setItem("cart", cart);
    updateCartTotal(cart);
}

function removeDeletedItems(cart) { //returns a cart array without the removed items
    var newCart = [];
    for (let i = 0; i < cart.length; i++) {
        if (cart[i] != "void") {
            newCart.push(cart[i]);
        }
    }
    return newCart;
}

function deleteFromCart() {//removes an item data from cart in local storage
    var cart = localStorage.getItem("cart").split(",");
    const itemPos = getItemPos(this, cart);
    console.log(cart + "---" + itemPos +"---" + cart[itemPos]);
    cart[itemPos] = "void";
    cart[itemPos + 1] = "void";
    cart[itemPos + 2] = "void";
    cart = removeDeletedItems(cart);

    localStorage.setItem("cart", cart);
    printCart();
    initEventListeners();
}


async function initEventListeners() { //initialize all events listeners
    await printCart();

    var qtyInputs = document.getElementsByClassName("itemQuantity"); //listeners for quantity inputs
    for (var i = 0; i < qtyInputs.length; i++) {
        qtyInputs[i].addEventListener("change", updateCart);
    }

    var removeButtons = document.getElementsByClassName("deleteItem"); // listeners for remove buttons
    for (var i = 0; i < removeButtons.length; i++) {
        removeButtons[i].addEventListener("click", deleteFromCart);
    }
 
    document.getElementById("cart_order_form").addEventListener("submit", checkOrderForm, true); //listener for form submition
}




const namePattern = "[a-zA-Z-']{3,}"; //3 letters or more, including - and '
const addressPattern = "[0-9]{1,4}[a-zA-Z ]{1, 64}";
const emailPattern = "[a-zA-Z.0-9]{3,}@[a-zA-Z]{2,}.[a-zA-Z]{2,16}"; //at least 3 letters or numbers or a dot + @ + at least 2 letters + . + at least 2 letters, max 16

function initFormPatterns() { //sets patterns for input fields
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const address = document.getElementById("address").value;
    const city = document.getElementById("city").value;
    const email = document.getElementById("email").value;


    firstName.pattern = namePattern;
    lastName.pattern = namePattern;
    address.pattern = addressPattern;
    city.pattern = namePattern;
    email.pattern = emailPattern;
}


function isInputValid(input, type) { //checks if an input is valid
    switch (type) {
        case "name":
            return /^namePattern$/.test(input);
            break;
        case "email":
            return /^emailPattern$/.test(input);
            break;
        case "address":
            return /^addressPattern$/.test(input);
            break;
        default:
            return -1;
    }
}

var checkOrderForm = function (event) {//checks if the form contains valid data
    event.preventDefault();

    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let address = document.getElementById("address").value;
    let city = document.getElementById("city").value;
    let email = document.getElementById("email").value;

    if (isInputValid(firstName, "name") && isInputValid(lastName, "name") && isInputValid(address, "address") && isInputValid(city, "name") && isInputValid(email, "email")) {
        //form is valid

        let contact = { firstName: firstName, lastName: lastName, address: address, city: city, email: email };


        var products = [];
        let cart = localStorage.getItem("cart").split(",");
        for (let i = 0; i < cart.length; i += 3) {
            products.push(cart[i]);

        }
        sendOrder(contact, products);


    } else {
        //form is not valid
        var error = "Erreur dans le formulaire : ";
        if(!isInputValid(firstName, "name")) {
            error.concat("prénom ");
        }
        if(!isInputValid(lastName, "name")) {
            error.concat("nom ");
        }
        if(!isInputValid(email, "email")) {
            error.concat("email ");
        }
        sendNotification(error);
    }
};

async function sendOrder(contact, cart) {//send a valid order to be processed
    let url = "http://localhost:3000/api/products/order";

    var content = { contact: contact, products: cart };

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

initEventListeners();
initFormPatterns();

