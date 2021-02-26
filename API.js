const fetch = require('node-fetch');
const crypto = require("crypto")
const env = require('./env')

const keyVer = '1'
const timeStamp = Date.now()

const generateWalmartHeaders = () => {
    const hashList = {
        "WM_CONSUMER.ID": consumerId,
        "WM_CONSUMER.INTIMESTAMP": timeStamp,
        "WM_SEC.KEY_VERSION": keyVer,
    };
    const sortedHashString = `${hashList["WM_CONSUMER.ID"]}\n${hashList["WM_CONSUMER.INTIMESTAMP"]}\n${hashList["WM_SEC.KEY_VERSION"]}\n`;
    const sign = crypto.createSign('sha256')
    sign.write(sortedHashString);
    sign.end();
    const sig = sign.sign({
        key:privateKey,
        passphrase: "1_Whysly",

    })
    const signature_enc = sig.toString('base64');

    return {
        "WM_SEC.AUTH_SIGNATURE": signature_enc,
        "WM_CONSUMER.INTIMESTAMP": hashList["WM_CONSUMER.INTIMESTAMP"],
        "WM_CONSUMER.ID": hashList["WM_CONSUMER.ID"],
        "WM_SEC.KEY_VERSION": hashList["WM_SEC.KEY_VERSION"],
    };
}


(async () => {
    const options = {
        method: 'GET',
        headers: generateWalmartHeaders()
    }
    const response = await fetch("https://developer.api.walmart.com/api-proxy/service/affil/product/v2/items?upc=079400352958", options);
    const body = await response.text();

    console.log(body);
    console.log(options)
})();
