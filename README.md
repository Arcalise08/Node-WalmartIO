# Node-WalmartIO
## _Basic Walmart Functionality For Node_

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

* [Installation](https://github.com/Arcalise08/Node-WalmartIO#installation)
* [Important Note](https://github.com/Arcalise08/Node-WalmartIO#IMPORTANT)
* [Usage](https://github.com/Arcalise08/Node-WalmartIO#usage)
* [Methods](https://github.com/Arcalise08/Node-WalmartIO#methods)
* [Parameters](https://github.com/Arcalise08/Node-WalmartIO#parameters)
* [Key Generation](https://github.com/Arcalise08/Node-WalmartIO#key-generation)
* [Header Generation](https://github.com/Arcalise08/Node-WalmartIO#headers-generation)


### Tested on Node
**v12.18.3**
### This Repo is for NODE only DO NOT USE THIS FOR FRONTEND APPLICATIONS
While technically you could replace the crypto package this repo uses with one that is compatible with the front-end. This is a really bad idea! Private keys should not be put on a front end. They are **PRIVATE** for a reason!


# Installation
This repo requires additional setup within node_modules
### First run install

```
npm i node_walmartio
```

### Next navigate to /node_modules/node_walmartio/src 
*You must fill out the details at the top of the page*

```
let details = {
    consumerId: "", <- Find on walmart dashboard after uploading your public key
    keyVersion:"", <- See Above^
    privateKey: ``, <- You must past the encrypted private key. See below for more information
    passPhrase:"" <- The passphrase which was used in the generation of the private key
}
```
When you commit//clone your repo remember that node_modules will be cleaned. This might be seen as an annoyance but it will help ensure you dont accidently make your private key public.

# IMPORTANT
Once you upload your public key onto the walmart dashboard there seems to be some amount of time that must pass before you can use it. If youre getting responses similar to
```
{details: "There is no Public Key for consumer Id : "32423-235325d-3252-23526"}
```
That normally means youre good to go, Just need to wait. I'm still not sure the exact timeframe, The key I had was around 5 days old and it seemed to work right off the bat. Whereas the one I generated and uploaded same day still hasnt worked.

# Usage
Here is the basic usage of this repo
```
const walmart = require("node_walmartio");
const url = "https://developer.api.walmart.com/api-proxy/service/affil/product/v2/items";
const query = "upc=035000521019"
const method = "GET";


const cb = (res) => {
    console.log(res)
}
console.log(walmart(cb, url, method, null, query ));
```

# Methods
Currently theres only one method and it is the default export of this repository. This will likely change in the future

# Parameters
Currently theres 4 parameters and only three are required. The order in which they are passed is important.
``
walmart(callback, url, method, body, query)
``

**``callback``** <- This is a callback which returns the response of the query. This is included as the first parameter for use with Jering Techs Node Wrapper **REQUIRED**

**``url``** <- The endpoint of the request **REQUIRED**

**``method``** <- The method of the request **REQUIRED**

**``body``** <- The body of the request. Should be **null** for get request.

**``query``**  <- The query of the request, Useful for get request. Although you can also do the query directly in the URL instead of using this.


# Key Generation
Theres very little documentation based around key generation for walmart.io
I suggest following the tutorial https://walmart.io/key-tutorial
The ubuntu guide is more fool proof then the windows one.

A properly generated Key would look similar to this
```
-----BEGIN RSA PRIVATE KEY-----
Proc-Type: 4,ENCRYPTED
DEK-Info: DES-EDE3-CBC,76C07E7C6988CE63

A bunch of random text will be here.
-----END RSA PRIVATE KEY-----
```
If it doesnt look like that, This repo wont work for you.

# Headers Generation
Again theres very little documentation around this. They give you a very obscure example that really seems to over complicate this process. If you're using this repo you dont need to worry about this as the headers generation is taken care of for you. However if your curious the signature is generated like this.

```
const hashList = {
        "WM_CONSUMER.ID": consumerId,
        "WM_CONSUMER.INTIMESTAMP": Date.now().toString(),
        "WM_SEC.KEY_VERSION": keyVersion,
    };

    const sortedHashString = `${hashList["WM_CONSUMER.ID"]}\n${hashList["WM_CONSUMER.INTIMESTAMP"]}\n${hashList["WM_SEC.KEY_VERSION"]}\n`; <- Pay attention to the order. It will not authenticate you if it isnt in this order.
    try {
        const sign = crypto.createSign('sha256')
        sign.write(sortedHashString);
        sign.end();
        const sig = sign.sign({ <- This is where the magic happens
            key:privateKey,
            passphrase: passPhrase,
        })

        const signature_enc = sig.toString("base64") <- The output of this function is a properly generated signature
        return {
            "WM_SEC.AUTH_SIGNATURE": signature_enc,
            "WM_CONSUMER.INTIMESTAMP": hashList["WM_CONSUMER.INTIMESTAMP"],
            "WM_CONSUMER.ID": hashList["WM_CONSUMER.ID"],
            "WM_SEC.KEY_VERSION": hashList["WM_SEC.KEY_VERSION"],
        };
```

Walmart seems like they're undergoing some changes so I don't really expect this to work for too long. If you see issues please feel free to post in the issue or submit PRs.



