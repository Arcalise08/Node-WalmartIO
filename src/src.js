require('dotenv/config')
const fetch = require('node-fetch');
const crypto = require('crypto');


let details = {
    consumerId: process.env.CONSUMER_ID,
    keyVersion: process.env.KEY_VERSION,
    privateKey: process.env.PRIVATEY_KEY,
    passPhrase: process.env.PASS_PHARSE
}



const generateWalmartHeaders = () => {
    const {consumerId, keyVersion, privateKey, passPhrase} = details;

    if (!consumerId.length > 0 || !keyVersion.length > 0 || !privateKey.length > 0 ) {
        console.error("You have not supplied the correct details. Please follow the readme at https://github.com/Arcalise08/Node-WalmartIO.")
        return false;
    }
    const hashList = {
        "WM_CONSUMER.ID": consumerId,
        "WM_CONSUMER.INTIMESTAMP": Date.now().toString(),
        "WM_SEC.KEY_VERSION": keyVersion,
    };

    const sortedHashString = `${hashList["WM_CONSUMER.ID"]}\n${hashList["WM_CONSUMER.INTIMESTAMP"]}\n${hashList["WM_SEC.KEY_VERSION"]}\n`;
    try {
        const sign = crypto.createSign('sha256')
        sign.write(sortedHashString);
        sign.end();
        const sig = sign.sign({
            key:privateKey,
            passphrase: passPhrase,
        })

        const signature_enc = sig.toString("base64")
        return {
            "WM_SEC.AUTH_SIGNATURE": signature_enc,
            "WM_CONSUMER.INTIMESTAMP": hashList["WM_CONSUMER.INTIMESTAMP"],
            "WM_CONSUMER.ID": hashList["WM_CONSUMER.ID"],
            "WM_SEC.KEY_VERSION": hashList["WM_SEC.KEY_VERSION"],
        };
    }
    catch (e) {
        console.log("Error Generating Signature. Check that your key is valid and if its encrypted that you have provided a passPhrase");
        console.log("If you feel your setup is valid, Please submit a bug report here - https://github.com/Arcalise08/Node-WalmartIO/issues");
        console.log("Please submit any information below with the bug report");
        console.log(e);
        return false;
    }
}


const Request = async (callback, url, query, body, method) => {
    if (!url || !method) {
        console.log("Invalid Request")
        console.log(`Provided request details URL: ${url} & METHOD: ${method}`)
        return false;
    }

    const headers = generateWalmartHeaders();

    if (!headers) {
        return false;
    }
    let options = {
        method: method,
        headers: headers
    }

    if (method === "GET" && query) {
        url += `?${query}`;
    }

    if (method !== "GET" && body) {
        options.body = body;
    }

    const response = await fetch(url, options);
    const res = await response.json();

    return callback(res);;
}


module.exports = {
    makeRequest:Request
}