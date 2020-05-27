import Util from '../util/util';
import { DefaultOptions } from '../util/constants';
import fs from 'promise-fs';
import * as path from 'path';
import API from '../paladins';
import ChampionsRepository from './repositories/api/champions';
import Champion from './classes/api/champion/champion';

export default class Framework {
    /** @ignore */
    private apiOptions: { [key: string]: any};

    /** @ignore */
    private api: API;

    /** @ignore */
    private frameworkCache: { [key: string]: any} = {};

    private _champions: ChampionsRepository;

    constructor(options: { [key: string]: any} = { }) {
        this.apiOptions = Util.mergeDefaults(DefaultOptions, options);
    }

    static async create(options: { [key: string]: any} = { }) {
        let cls = new Framework(options);
        await cls.boot();
        return cls;
    }

    public champions(): ChampionsRepository {
        return this._champions;
    }

    private async boot() {
        this.api = new API(this.apiOptions);

        try {
            
            let data = fs.readFileSync(path.resolve(__dirname, 'cache', 'framework.json'));
            this.frameworkCache = JSON.parse(data.toString());

            let champions: any[] = [];
            let championData = await this.api.getChampions();
            
            championData.forEach((champ: any) => {
                champions.push(new Champion(champ));
            });

            this._champions = new ChampionsRepository(champions)
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