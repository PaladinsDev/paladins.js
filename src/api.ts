import Util from './util/util';
import { DefaultOptions, DefaultSessionCache } from './util/constants';
import fs from 'promise-fs';
import * as path from 'path';
import moment from 'moment';
import md5 from 'md5';
import rp from 'request-promise';
import sr from 'sync-request';
import { NotFoundError, PrivateProfileError, UnauthorizedDeveloper } from './errors';
import { Portals } from './util/enumerations';

export default class API {
    /** @ignore */
    private serviceUrl: string = 'http://api.paladins.com/paladinsapi.svc';
    /** @ignore */
    private sessionCache: { [key: string]: any} = {};

    constructor(/** @ignore */private options: { [key: string]: any} = { }) {
        this.options = Util.mergeDefaults(DefaultOptions, options);

        this.setupModule();
    }

    /**
     * Get the current API service URL.
     *
     * @returns {string}
     * @memberof API
     */
    public getServiceUrl(): string {
        return this.serviceUrl;
    }

    /**
     * Get match ids for a queue on the given hour and date.
     *
     * @param {string} hour
     * @param {*} date
     * @param {number} queue
     * @returns {Promise<any>}
     * @memberof API
     */
    public getMatchIdsByQueue(hour: string, date: any, queue: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.makeRequest(`${this.getServiceUrl()}/getmatchidsbyqueueJson/${this.options['devId']}/${this.getSignature('getmatchidsbyqueue')}/${this.getSession()}/${this.getTimestamp()}/${queue}/${date}/${hour}`)
                .then((data: any) => {
                    data = JSON.parse(data);

                    if (data.length > 0 && data[0]['ret_msg'] != null && data[0]['ret_msg'].toLowerCase() == 'invalid session id.') {
                        this.setSession();
                        resolve(this.getMatchIdsByQueue(hour, date, queue));
                    }
                    
                    return resolve(data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }

    /**
     * Get all the champions currently in the game.
     *
     * @returns {Promise<any>}
     * @memberof API
     */
    public getChampions(): Promise<any> {
        return this.endpoint('getchampions', [null, this.options['languageId']]);
    }

    /**
     * Get the cards for the requested champion.
     *
     * @param {number} championId
     * @returns {Promise<any>}
     * @memberof API
     */
    public getChampionCards(championId: number): Promise<any> {
        return this.endpoint('getchampioncards', [null, this.options['languageId'], null, championId]);
    }

    /**
     * Get all the skins associated with the champion.
     *
     * @param {number} championId
     * @returns {Promise<any>}
     * @memberof API
     */
    public getChampionSkins(championId: number): Promise<any> {
        return this.endpoint('getchampionskins', [null, this.options['languageId'], null, championId]);
    }

    /**
     * Get all the items available for purchase in the game.
     *
     * @returns {Promise<any>}
     * @memberof API
     */
    public getItems(): Promise<any> {
        return this.endpoint('getitems', [null, this.options['languageId']]);
    }

    /**
     * Get a player and their details.
     *
     * @param {number} player
     * @returns {Promise<any>}
     * @memberof API
     */
    public getPlayer(player: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.endpoint('getplayer', [player])
                .then((data) => {
                    if (data.length < 1) {
                        return reject(new NotFoundError('No profiles were found with the given criteria.'));
                    }

                    if (data[0]['ret_msg'] && data[0]['ret_msg'].toLowerCase().indexOf('player privacy flag') > -1) {
                        return reject(new PrivateProfileError('Player profile is currently set to private.'));
                    }

                    return resolve(data[0]);
                })
                .catch((err) => {
                    return reject(err);
                })
        })
    }

    /**
     * Get player information for a batch of players.
     *
     * @param {number[]} playerIds
     * @returns {Promise<any>}
     * @memberof API
     */
    public getPlayerBatch(playerIds: number[]): Promise<any> {
        return this.endpoint('getplayerbatch', [playerIds.join(',')]);
    }

    /**
     * Get an array of players with the requested name.
     * 
     * Will be removed in future releases. Please use {@link API.searchPlayers} for searching.
     *
     * @deprecated
     * @param {string} name
     * @returns {Promise<any>}
     * @memberof API
     */
    public getPlayerIdByName(name: string): Promise<any> {
        return this.endpoint('getplayeridbyname', [name]);
    }

    /**
     * Get a player from PC or PSN. Does not work with Xbox or Switch.
     *
     * @param {string} name
     * @param {number} platform
     * @returns {Promise<any>}
     * @memberof API
     */
    public getPlayerIdByPortalUserId(name: string, platform: number): Promise<any> {
        return this.endpoint('getplayeridbyportaluserid', [name, null, null, null, null, null, null, platform]);
    }

    /**
     * Get player ids by the gamertag.
     *
     * @param {string} name
     * @param {number} platform
     * @returns {Promise<any>}
     * @memberof API
     */
    public getPlayerIdsByGamertag(name: string, platform: number): Promise<any> {
        return this.endpoint('getplayeridsbygamertag', [name, null, null, null, null, null, null, platform]);
    }

    /**
     * Get player id info for Xbox and Switch.
     *
     * @param {string} name
     * @returns {Promise<any>}
     * @memberof API
     */
    public getPlayerIdInfoForXboxAndSwitch(name: string): Promise<any> {
        return this.endpoint('getplayeridinfoforxboxandswitch', [name])
    }

    /**
     * Get all the relationships for the requested player, includes both blocked and friends.
     *
     * @param {number} playerId
     * @returns {Promise<any>}
     * @memberof API
     */
    public getPlayerRelationships(playerId: number): Promise<any> {
        return this.endpoint('getfriends', [playerId]);
    }

    /**
     * Get all the champion ranks for the requested player.
     *
     * @param {number} playerId
     * @returns {Promise<any>}
     * @memberof API
     */
    public getPlayerChampionRanks(playerId: number): Promise<any> {
        return this.endpoint('getchampionranks', [playerId]);
    }

    /**
     * Get all the champion loadouts for the requested player.
     *
     * @param {number} playerId
     * @returns {Promise<any>}
     * @memberof API
     */
    public getPlayerLoadouts(playerId: number): Promise<any> {
        return this.endpoint('getplayerloadouts', [playerId, this.options['languageId']]);
    }

    /**
     * Get the current status of the player.
     *
     * @param {number} playerId
     * @returns {Promise<any>}
     * @memberof API
     */
    public getPlayerStatus(playerId: number): Promise<any> {
        return this.endpoint('getplayerstatus', [playerId], true);
    }

    /**
     * Get the match history of the requested player.
     *
     * @param {number} playerId
     * @returns {Promise<any>}
     * @memberof API
     */
    public getPlayerMatchHistory(playerId: number): Promise<any> {
        return this.endpoint('getmatchhistory', [playerId]);
    }

    /**
     * Get the queue stats of a player.
     *
     * @param {number} playerId
     * @param {number} queueId
     * @returns {Promise<any>}
     * @memberof API
     */
    public getPlayerQueueStats(playerId: number, queueId: number): Promise<any> {
        return this.endpoint('getqueuestats', [playerId, null, null, null, queueId]);
    }

    /**
     * Get the information for an ended match.
     *
     * @param {number} matchId
     * @returns {Promise<any>}
     * @memberof API
     */
    public getMatchModeDetails(matchId: number): Promise<any> {
        return this.endpoint('getmodedetails', [matchId]);
    }

    /**
     * Get details on multiple matches
     *
     * @param {number[]} matchIds
     * @param {boolean} [returnSorted=true] Makes each match sorted in the object. If you set this to false, it may improve performance when requesting many matches but it will return everything in a single array.
     * @returns {Promise<any>}
     * @memberof API
     */
    public getMatchModeDetailsBatch(matchIds: number[], returnSorted: boolean = true): Promise<any> {
        if (returnSorted) {
            return new Promise((resolve, reject) => {
                this.endpoint('getmatchdetailsbatch', [matchIds.join(',')])
                    .then((data) => {
                        let sorted: { [key: string]: any[] } = {}

                        data.forEach((matchPlayer: any) => {
                            if (sorted[matchPlayer['Match']]) {
                                sorted[matchPlayer['Match']].push(matchPlayer);
                            } else {
                                sorted[matchPlayer['Match']] = [];
                                sorted[matchPlayer['Match']].push(matchPlayer);
                            }
                        });

                        return resolve(sorted);
                    })
                    .catch((err) => {
                        return reject(err);
                    })
            })
        } else {
            return this.endpoint('getmatchdetailsbatch', [matchIds.join(',')]);
        }
    }

    /**
     * Get match details from an ended match.
     *
     * @param {number} matchId
     * @returns {Promise<any>}
     * @memberof API
     */
    public getMatchDetails(matchId: number): Promise<any> {
        return this.endpoint('getmatchdetails', [null, null, matchId]);
    }

    /**
     * Get basic info for a live, active match.
     *
     * @param {number} matchId
     * @returns {Promise<any>}
     * @memberof API
     */
    public getActiveMatchDetails(matchId: number): Promise<any> {
        return this.endpoint('getmatchplayerdetails', [null, null, matchId]);
    }

    /**
     * Get the current data usage.
     *
     * @returns {Promise<any>}
     * @memberof API
     */
    public getDataUsage(): Promise<any> {
        return this.endpoint('getdataused', [], true);
    }

    /**
     * Do a general player search that returns more detail information on the players.
     *
     * @param {string} name 
     * @param {boolean} [mapPortals=false] Map the portals to their general name. WARNING: This can severely affect performance if you are doing generic names because of Switch results.
     * @returns {Promise<any>}
     * @memberof API
     */
    public searchPlayers(name: string, mapPortals: boolean = false): Promise<any> {
        if (mapPortals) {
            return new Promise((resolve, reject) => {
                this.endpoint('searchplayers', [name])
                    .then((data) => {
                        data.forEach((player: any) => {
                            player['portal_name'] = Portals[player['portal_id']];
                        });

                        return resolve(data);
                    })
                    .catch((err) => {
                        return reject(err);
                    })
            })
        } else {
            return this.endpoint('searchplayers', [name]);
        }
    }

    /** @ignore */
    private endpoint(endpoint: string, args: Array<any>, returnFirstElement: boolean = false): Promise<any> {
        let fArgs = <any>[endpoint].concat(args);
        let url = this.buildUrl.apply(this, fArgs);

        return new Promise((resolve, reject) => {
            this.makeRequest(url)
                .then((data: any) => {
                    data = JSON.parse(data);
                    if (data.length > 0 && data[0]['ret_msg'] != null && data[0]['ret_msg'].toLowerCase() == 'invalid session id.') {
                        this.setSession();
                        resolve(this.endpoint(endpoint, args))
                    }

                    if (returnFirstElement && data.length > 0) {
                        return resolve(data[0]);
                    }

                    return resolve(data);
                })
                .catch((err: any) => {
                    reject(err);
                })
        })
    }

    /** @ignore */
    private getTimestamp() {
        return moment().utc().format('YYYYMMDDHHmmss');
    }

    /** @ignore */
    private getSignature(method: string) {
        return md5(`${this.options['devId']}${method}${this.options['authKey']}${this.getTimestamp()}`)
    }

    /** @ignore */
    private setSession(): string {
        let response = sr('GET', `${this.getServiceUrl()}/createsessionJson/${this.options['devId']}/${this.getSignature('createsession')}/${this.getTimestamp()}`);
        let body = JSON.parse(response.body.toString());

        if (body['ret_msg'].indexOf('Exception while validating developer access') > -1) {
            throw new UnauthorizedDeveloper('Invalid developer id/auth key.');
        }

        this.sessionCache = {
            sessionId: body['session_id'],
            createdAt: this.getTimestamp(),
            data: body
        };

        this.saveSessionCache();

        return this.sessionCache['sessionId'];
    }

    /** @ignore */
    private saveSessionCache() {
        fs.writeFileSync(path.resolve(__dirname, 'cache', 'session.json'), JSON.stringify(this.sessionCache));
    }

    /** @ignore */
    private getSession(): string {
        if (this.sessionCache['sessionId'] == undefined || this.sessionCache['sessionId'] == null || this.sessionCache['sessionId'].length < 1) {
            return this.setSession();
        }

        return this.sessionCache['sessionId'];
    }

    /** @ignore */
    private buildUrl(method: string, player?: any, lang?: number, matchId?: number, champId?: number, queue?: number, tier?: number, season?: number, platform?: number) {
        let session = this.getSession();
        let baseUrl = `${this.getServiceUrl()}/${method}Json/${this.options['devId']}/${this.getSignature(method)}/${session}/${this.getTimestamp()}`;

        if (platform) {
            baseUrl += `/${platform}`;
        }

        if (player) {
            baseUrl += `/${player}`;
        }

        if (champId) {
            baseUrl += `/${champId}`;
        }

        if (lang) {
            baseUrl += `/${lang}`;
        }

        if (matchId) {
            baseUrl += `/${matchId}`;
        }

        if (queue) {
            baseUrl += `/${queue}`;
        }

        if (tier) {
            baseUrl += `/${tier}`;
        }

        if (season) {
            baseUrl += `/${season}`;
        }

        return baseUrl;
    }

    /** @ignore */
    private makeRequest(url: string) {
        return rp(url).then((r: any) => {
            return r;
        });
    }

    /** @ignore */
    private setupModule() {
        try {
            let data = fs.readFileSync(path.resolve(__dirname, 'cache', 'session.json'));
            this.sessionCache = JSON.parse(data.toString());
        } catch (err) {
            if (err.code == 'ENOENT') {
                fs.mkdirSync(path.resolve(__dirname, 'cache'), { recursive: true})
                fs.writeFileSync(path.resolve(__dirname, 'cache', 'session.json'), JSON.stringify(DefaultSessionCache));
                return;
            }
            
            throw new Error(err);
        }
    }
}
