import { Repository } from '../repository';
import Champion from '../../classes/api/champion/champion';

export default class ChampionsRepository implements Repository {
    constructor(private _championCollection: Champion[]) {}

    public all(): Champion[] {
        return this._championCollection;
    }

    public findById(id: any): any {

    }
}