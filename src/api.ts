import Util from './util/util';
import { DefaultOptions, DefaultSessionCache } from './util/constants';
import fs from 'promise-fs';
import * as path from 'path';

export default class API {
    private serviceUrl: string = 'http://api.paladins.com/paladinsapi.svc';
    private sessionCache: { [key: string]: any} | null = null;

    constructor(private options = {}) {
        this.options = Util.mergeDefaults(DefaultOptions, options);

        this.verifySessionCache();
    }

    public getServiceUrl(): string {
        return this.serviceUrl;
    }
    
    private verifySessionCache() {
        fs.readFile(path.resolve(__dirname, 'cache', 'session.json'))
            .then(data => {
                this.sessionCache = JSON.parse(data.toString());
            })
            .catch(err => {
                if (err.code == 'ENOENT') {
                    return fs.mkdir(path.resolve(__dirname, 'cache'), { recursive: true})
                }
                
                console.error(err);
            })
            .then(() => {
                this.sessionCache = DefaultSessionCache;
                return fs.writeFile(path.resolve(__dirname, 'cache', 'session.json'), JSON.stringify(DefaultSessionCache));
            })
            .catch(err => {
                console.log(err);
            });

    }
}
