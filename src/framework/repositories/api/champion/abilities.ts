import { Repository } from '../../repository';
import Ability from '../../../classes/api/champion/ability';

export default class AbilitiesRepository implements Repository {
    private _abilityCollection: {[key: number]: Ability};

    constructor(abilities: Ability[]) {
        this._abilityCollection = {};
        
        abilities.forEach((ability: Ability) => {
            this._abilityCollection[ability.id()] = ability;
        })
    }

    public all(): {[key: number]: Ability} {
        return this._abilityCollection;
    }

    public findById(id: any): Ability {
        return this._abilityCollection[id] ?? null;
    }
}