import { DamageType } from './enumerations';

export default class Ability {
    private _name: string;
    private _id: number;
    private _description: string;
    private _iconURL: string;
    private _damageType: DamageType;
    private _rechargeSeconds: number;

    constructor(/** @ignore */private data: {[key:string]:any}) {
        this._name = data['Summary'];
        this._id = data['Id'];
        this._description = data['Description'];
        this._iconURL = data['URL'];
        this._rechargeSeconds = data['rechargeSeconds'];

        switch (data['damageType']) {
            case 'AoE': 
                this._damageType = DamageType.AOE;
                break;
            case 'Direct': 
                this._damageType = DamageType.DIRECT;
                break;
            case 'Physical': 
                this._damageType = DamageType.PHYSICAL;
                break;
            case 'True': 
                this._damageType = DamageType.TRUE;
                break;
            default:
                this._damageType = DamageType.UNKNOWN;
        }
    }

    public name(): string {
        return this._name;
    }

    public id(): number {
        return this._id;
    }

    public description(): string {
        return this._description;
    }

    public iconURL(): string {
        return this._iconURL;
    }

    public damageType(): DamageType {
        return this._damageType;
    }

    public rechargeSeconds(): number {
        return this._rechargeSeconds;
    }
}