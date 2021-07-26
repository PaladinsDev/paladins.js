# pe-paladins.js 🔥

![NPM License](https://img.shields.io/npm/l/pe-paladins.js.svg?style=flat) ![Downloads](https://img.shields.io/npm/dm/pe-paladins.js.svg?style=flat)

A strongly typed fork of [paladins.js](https://www.npmjs.com/package/paladins.js), used by [Paladins Edge](https://paladinsedge.ml)

- Based on the latest version of paladins.js (v2.2.2)
- All of the methods have the exact response type
- Removed the deprecated `request` library for `axios`
- Updated champion enums to include `Vatu` and `Rei` as per gen:LOCK patch
- Added fire emoji for clickbaits

## Install

```
$ npm install pe-paladins.js
```

## Usage

### TypeScript

```javascript
import { API } from "pe-paladins.js";

let api = new API({
  devId: "1234",
  authKey: "abcd1234",
}); // API loaded and ready to go.

api
  .getDataUsage()
  .then((response: any) => {
    // Do something with response
  })
  .catch((err: any) => {
    // Handle the error
  });
```

### JavaScript

```javascript
const { API } = require("pe-paladins.js");

let api = new API({
  devId: "1234",
  authKey: "abcd1234",
}); // API loaded and ready to go.

api
  .getDataUsage()
  .then((response: any) => {
    // Do something with response
  })
  .catch((err: any) => {
    // Handle the error
  });
```

## Documentation / Methods

You can view all the available methods and documentation here [pe-paladins.js](https://pe-paladinsjs.netlify.app/). Some of the methods are removed/changed in pe-paladins.js compared to paladins.js
