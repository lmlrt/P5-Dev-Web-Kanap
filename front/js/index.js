async function printCatalog() {
    var generatedCode = [];
    const data = await getData("");

    var itemCodeTemplate = `<a href="./product.html?id=__ID__">
    <article>
      <img src="__IMGSRC__" alt="__ALTTEXT__">
      <h3 class="productName">__NAME__</h3>
      <p class="productDescription">__DESCRIPTION__</p>
    </article></a>`;

    for (let i = 0; i < data.length; i++) {
        var itemCode = itemCodeTemplate.replace('__ID__', data[i]._id);
        itemCode = itemCode.replace('__NAME__', data[i].name);
        itemCode = itemCode.replace('__IMGSRC__', data[i].imageUrl);
        itemCode = itemCode.replace('__PRICE__', data[i].price);
        itemCode = itemCode.replace('__ALTTEXT__', data[i].altTxt);
        itemCode = itemCode.replace('__DESCRIPTION__', data[i].description);
        document.getElementById("items").innerHTML += itemCode;
    }
}

printCatalog();
