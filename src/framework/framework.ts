import Util from '../util/util';
import { DefaultOptions } from '../util/constants';
import fs from 'promise-fs';
import * as path from 'path';
import API from '../paladins';

export default class Framework {
    /** @ignore */
    private apiOptions: { [key: string]: any};

    /** @ignore */
    private api: API;

    /** @ignore */
    private frameworkCache: { [key: string]: any} = {};

    constructor(options: { [key: string]: any} = { }) {
        this.apiOptions = Util.mergeDefaults(DefaultOptions, options);
        this.api = new API(this.apiOptions);

        this.boot();
    }

    /** @ignore */
    private boot() {
        try {
            let data = fs.readFileSync(path.resolve(__dirname, 'cache', 'framework.json'));
            this.frameworkCache = JSON.parse(data.toString());
        } catch (err) {
            if (err.code == 'ENOENT') {
                fs.mkdirSync(path.resolve(__dirname, 'cache'), { recursive: true})
                fs.writeFileSync(path.resolve(__dirname, 'cache', 'framework.json'), JSON.stringify({}));
                this.frameworkCache = {};
                return;
            }
            
            throw new Error(err);
        }
    }
}