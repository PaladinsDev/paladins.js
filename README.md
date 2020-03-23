# Paladins.js
![NPM License](https://img.shields.io/npm/l/paladins.js.svg?style=flat) ![Downloads](https://img.shields.io/npm/dm/paladins.js.svg?style=flat)

Paladins.js is a package that helps Hi-Rez/Paladins developers communicate with the API. 

## Install
```
$ npm install paladins.js
```

## Cache Driver
A cache driver is **highly** recommended. If there is no driver, it will create a new session on each request. This will make it so that your usage limits are hit within no time.

We use [cache-driver](https://www.npmjs.com/package/cache-driver) to provide flexibility in what kind of caching system you would like to use, as long as it's an implementation of `cache-driver` then it will work out of the box.

## Usage
*The following examples are in TypeScript, which this package is written in.*

For the usage example's we'll be using [cache](https://www.npmjs.com/package/cache). We also need the `cache-driver` adapter for `cache` which is [here](https://www.npmjs.com/package/cache-driver-cache)

```
$ npm install cache cache-driver-cache
```

```javascript
import API from "paladins.js";
import { CacheAdapter } from "cache-driver-cache";

let api = new API("devId", "auhtKey", new CacheAdapter()); // API loaded and ready to go. 

api.getItems().then((response: any) => {
    // Do something with response
});
```

## Documentation / Methods
You can view all the available methods and documentation on the [PaladinsDev website](https://paladins.dev/docs/paladins.js/v/1.0.0/).