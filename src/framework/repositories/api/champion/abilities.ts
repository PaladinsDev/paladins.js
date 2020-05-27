import { Repository } from '../../repository';
import Ability from '../../../classes/api/champion/ability';

export default class AbilitiesRepository implements Repository {
    constructor(private _abilityCollection: Ability[]) {}

    public all(): any {

    }

    public find(needle: any, key?: any): any {

    }
}