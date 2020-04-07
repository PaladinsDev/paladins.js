# paladins.js
![NPM License](https://img.shields.io/npm/l/paladins.js.svg?style=flat) ![Downloads](https://img.shields.io/npm/dm/paladins.js.svg?style=flat)

Paladins.js is a package that helps Hi-Rez/Paladins developers communicate with the API. 

## 2.0
v2.0 is a complete rewrite of the current paladins.js library. It is not backwards compatible with any version prior.

Differences between 1.x / 2.x:
- The complicated cache process has been redone
- You can pass through more options
- Proper error handling
- Returns promises with proper JSON
- and more...

## Install
```
$ npm install paladins.js
```

## Usage
*The following examples are in TypeScript, which this package is written in.*

```javascript
import API from 'paladins.js';

let api = new API({
    devId: '1234',
    authKey: 'abcd1234'
}); // API loaded and ready to go. 

api.getDataUsage()
    .then((response: any) => {
        // Do something with response
    })
    .catch((err: any) => {
        // Handle the error
    });
```

## Documentation / Methods
You can view all the available methods and documentation on the [PaladinsDev website](https://paladins.dev/docs/paladins.js/v/2.0.0/).