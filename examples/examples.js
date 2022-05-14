const walmart = require("../src/src"); //WHEN USING NPN THIS SHOULD BE THE PACKAGE NAME
const url = "https://developer.api.walmart.com/api-proxy/service/affil/product/v2/items";
const query = "upc=035000521019"
const method = "GET";


const cb = (res) => {
    console.log(res)
}

walmart.makeRequest(cb, url, query, null, method);