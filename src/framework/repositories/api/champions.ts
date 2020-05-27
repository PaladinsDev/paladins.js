import { Repository } from '../repository';
import Champion from '../../classes/api/champion/champion';

export default class ChampionsRepository implements Repository {
    private _championCollection: {[key: number]: Champion};

    constructor(private _champions: Champion[]) {
        this._championCollection = {};
        _champions.forEach((champion: Champion) => {
            this._championCollection[champion.id()] = champion;
        })
    }

    public all(): {[key: number]: Champion} {
        return this._championCollection;
    }

    public findById(id: any): Champion {
        return this._championCollection[id] ?? null;
    }
}