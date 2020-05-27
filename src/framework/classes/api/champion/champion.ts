import Ability from './ability';
import { Role } from './enumerations';
import AbilitiesRepository from '../../../repositories/api/champion/abilities';

export default class Champion {
    private _health: number;
    private _iconURL: string;
    private _id: number;
    private _lore: string;
    private _latestChampion: boolean;
    private _name: string;
    private _pantheon: string;
    private _role: Role;
    private _speed: number;
    private _title: string;
    private _abilities: AbilitiesRepository;

    constructor(/** @ignore */private data: {[key:string]:any}) {
        this._health = data['Health'];
        this._iconURL = data['ChampionIcon_URL'];
        this._id = data['id'];
        this._lore = data['Lore'];
        this._latestChampion = data['latestChampion'] == 'y' ? true : false;
        this._name = data['Name'];
        this._pantheon = data['Pantheon'];
        this._speed = data['Speed'];
        this._title = data['Title'];
        let abilityCollection = [];

        for (let index = 1; index < 4; index++) {
            abilityCollection.push(new Ability(data[`Ability_${index}`]))
        }

        this._abilities = new AbilitiesRepository(abilityCollection);

        switch (data['Roles']) {
            case 'Paladins Flanker': 
                this._role = Role.FLANK;
                break;
            case 'Paladins Damage': 
                this._role = Role.DAMAGE;
                break;
            case 'Paladins Front Line': 
                this._role = Role.FRONT_LINE;
                break;
            case 'Paladins Support': 
                this._role = Role.SUPPORT;
                break;
            default:
                this._role = Role.UNKNOWN;
        }
    }

    public health(): number {
        return this._health;
    }

    public iconURL(): string {
        return this._iconURL;
    }

    public id(): number {
        return this._id;
    }

    public lore(): string {
        return this._lore;
    }

    public isLatest(): boolean {
        return this._latestChampion;
    }

    public name(): string {
        return this._name;
    }

    public pantheon(): string {
        return this._pantheon;
    }

    public role(): Role {
        return this._role;
    }

    public speed(): number {
        return this._speed;
    }

    public title(): string {
        return this._title;
    }

    public abilities(): AbilitiesRepository {
        return this._abilities;
    }
}