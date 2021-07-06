import axios from 'axios';
import md5 from 'md5';
import moment from 'moment';
import * as path from 'path';
import fs from 'promise-fs';
import { NotFoundError, PrivateProfileError, UnauthorizedDeveloper } from './errors';
import * as ApiResponse from './util/apiResponse';
import { DefaultOptions, DefaultSessionCache } from './util/constants';
import { Portals } from './util/enumerations';
import Util from './util/util';

export class API {
    /** @ignore */
    private serviceUrl: string = 'https://api.paladins.com/paladinsapi.svc';
    /** @ignore */
    private sessionCache: { [key: string]: any } = {};

    constructor(/** @ignore */private options: { [key: string]: any } = {}) {
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
     * @returns {Promise<ApiResponse.GetMatchIDSByQueue>}
     * @memberof API
     */
    public async getMatchIdsByQueue(hour: string, date: any, queue: number) {
        const url = `${this.getServiceUrl()}/getmatchidsbyqueueJson/${this.options['devId']}/${this.getSignature('getmatchidsbyqueue')}/${this.getSession()}/${this.getTimestamp()}/${queue}/${date}/${hour}`

        try {
            const { data } = await axios.get<ApiResponse.GetMatchIDSByQueue>(url)
            if (data.length > 0 && data[0]['ret_msg'] != null && data[0]['ret_msg'].toLowerCase() == 'invalid session id.') {
                this.setSession();
                this.getMatchIdsByQueue(hour, date, queue)
            }
            return data

        } catch (err) {
            return Promise.reject(err)
        }
    }

    /**
     * Get all the champions currently in the game.
     *
     * @returns {Promise<ApiResponse.GetChampions>}
     * @memberof API
     */
    public getChampions() {
        return this.endpoint<ApiResponse.GetChampions>('getchampions', [null, this.options['languageId']]);
    }

    /**
     * Get the cards for the requested champion.
     *
     * @param {number} championId
     * @returns {Promise<ApiResponse.GetChampionCards>}
     * @memberof API
     */
    public getChampionCards(championId: number) {
        return this.endpoint<ApiResponse.GetChampionCards>('getchampioncards', [null, this.options['languageId'], null, championId]);
    }

    /**
     * Get all the skins associated with the champion.
     *
     * @param {number} championId
     * @returns {Promise<ApiResponse.GetChampionSkins>}
     * @memberof API
     */
    public getChampionSkins(championId: number) {
        return this.endpoint<ApiResponse.GetChampionSkins>('getchampionskins', [null, this.options['languageId'], null, championId]);
    }

    /**
     * Get all the items available for purchase in the game.
     *
     * @returns {Promise<ApiResponse.GetItems>}
     * @memberof API
     */
    public getItems() {
        return this.endpoint<ApiResponse.GetItems>('getitems', [null, this.options['languageId']]);
    }

    /**
     * Get a player and their details.
     *
     * @param {number} playerId
     * @returns {Promise<ApiResponse.GetPlayer>}
     * @memberof API
     */
    public async getPlayer(playerId: number): Promise<ApiResponse.GetPlayer> {
        const data = await this.endpoint<ApiResponse.GetPlayer[]>('getplayer', [playerId])
        const player = data[0]
        if (!player) {
            return Promise.reject(new NotFoundError('No profiles were found with the given criteria.'));
        }

        if (player['ret_msg'] && player['ret_msg'].toLowerCase().indexOf('player privacy flag') > -1) {
            return Promise.reject(new PrivateProfileError('Player profile is currently set to private.'));
        }

        return player


    }

    /**
     * Get player information for a batch of players.
     *
     * @param {number[]} playerIds
     * @returns {Promise<ApiResponse.GetPlayerBatch>}
     * @memberof API
     */
    public getPlayerBatch(playerIds: number[]) {
        // TODO: Remove those with 0 in this.
        return this.endpoint<ApiResponse.GetPlayerBatch>('getplayerbatch', [playerIds.join(',')]);
    }

    /**
     * Get an array of players with the requested name.
     * 
     * Will be removed in future releases. Please use {@link API.searchPlayers} for searching.
     *
     * @deprecated
     * @param {string} name
     * @returns {Promise<ApiResponse.GetPlayerIDByName>}
     * @memberof API
     */
    public getPlayerIdByName(name: string): Promise<ApiResponse.GetPlayerIDByName> {
        return this.endpoint<ApiResponse.GetPlayerIDByName>('getplayeridbyname', [name]);
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
        return this.endpoint<any>('getplayeridbyportaluserid', [name, null, null, null, null, null, null, platform]);
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
        return this.endpoint<any>('getplayeridsbygamertag', [name, null, null, null, null, null, null, platform]);
    }

    /**
     * Get player id info for Xbox and Switch.
     *
     * @param {string} name
     * @returns {Promise<any>}
     * @memberof API
     */
    public getPlayerIdInfoForXboxAndSwitch(name: string): Promise<any> {
        return this.endpoint<any>('getplayeridinfoforxboxandswitch', [name])
    }

    /**
     * Get all the relationships for the requested player, includes both blocked and friends.
     *
     * @param {number} playerId
     * @returns {Promise<ApiResponse.GetPlayerRelationships>}
     * @memberof API
     */
    public getPlayerRelationships(playerId: number) {
        return this.endpoint<ApiResponse.GetPlayerRelationships>('getfriends', [playerId]);
    }

    /**
     * Get all the champion ranks for the requested player.
     *
     * @param {number} playerId
     * @returns {Promise<ApiResponse.GetPlayerChampionRanks>}
     * @memberof API
     */
    public getPlayerChampionRanks(playerId: number) {
        return this.endpoint<ApiResponse.GetPlayerChampionRanks>('getchampionranks', [playerId]);
    }

    /**
     * Get all the champion loadouts for the requested player.
     *
     * @param {number} playerId
     * @returns {Promise<ApiResponse.GetPlayerLoadouts>}
     * @memberof API
     */
    public getPlayerLoadouts(playerId: number) {
        return this.endpoint<ApiResponse.GetPlayerLoadouts>('getplayerloadouts', [playerId, this.options['languageId']]);
    }

    /**
     * Get the current status of the player.
     *
     * @param {number} playerId
     * @returns {Promise<ApiResponse.GetPlayerStatus>}
     * @memberof API
     */
    public getPlayerStatus(playerId: number): Promise<ApiResponse.GetPlayerStatus> {
        return this.endpoint<ApiResponse.GetPlayerStatus>('getplayerstatus', [playerId], true);
    }

    /**
     * Get the match history of the requested player.
     *
     * @param {number} playerId
     * @returns {Promise<ApiResponse.GetPlayerMatchHistory>}
     * @memberof API
     */
    public getPlayerMatchHistory(playerId: number): Promise<ApiResponse.GetPlayerMatchHistory> {
        return this.endpoint<ApiResponse.GetPlayerMatchHistory>('getmatchhistory', [playerId]);
    }

    /**
     * Get the queue stats of a player.
     *
     * @param {number} playerId
     * @param {number} queueId
     * @returns {Promise<ApiResponse.GetPlayerQueueStats>}
     * @memberof API
     */
    public getPlayerQueueStats(playerId: number, queueId: number) {
        return this.endpoint<ApiResponse.GetPlayerQueueStats>('getqueuestats', [playerId, null, null, null, queueId]);
    }

    /**
     * Get details on multiple matches
     *
     * @param {number[]} matchIds
     * @returns {Promise<ApiResponse.GetMatchModeDetailsBatch>} 
     * @memberof API
     */
    public async getMatchModeDetailsBatch(matchIds: number[]): Promise<ApiResponse.GetMatchModeDetailsBatch> {
        try {
            const data = await this.endpoint<any>('getmatchdetailsbatch', [matchIds.join(',')])
            let sorted: { [key: string]: any[] } = {}

            data.forEach((matchPlayer: any) => {
                if (sorted[matchPlayer['Match']]) {
                    sorted[matchPlayer['Match']].push(matchPlayer);
                } else {
                    sorted[matchPlayer['Match']] = [];
                    sorted[matchPlayer['Match']].push(matchPlayer);
                }
            });

            return sorted
        }
        catch (err) {
            return Promise.reject(err);
        }
    }

    /**
     * Get match details from an ended match.
     *
     * @param {number} matchId
     * @returns {Promise<ApiResponse.GetMatchDetails>}
     * @memberof API
     */
    public getMatchDetails(matchId: number) {
        return this.endpoint<ApiResponse.GetMatchDetails>('getmatchdetails', [null, null, matchId]);
    }

    /**
     * Get basic info for a live, active match.
     *
     * @param {number} matchId
     * @returns {Promise<ApiResponse.GetActiveMatchDetails>}
     * @memberof API
     */
    public getActiveMatchDetails(matchId: number) {
        return this.endpoint<ApiResponse.GetActiveMatchDetails>('getmatchplayerdetails', [null, null, matchId]);
    }

    /**
     * Get all the current bounty store info.
     * 
     * @returns {Promise<ApiResponse.GetBountyItems>}
     * @memberof API
     */
    public getBountyItems() {
        return this.endpoint<ApiResponse.GetBountyItems>('getbountyitems', [], false);
    }

    /**
     * Get the current data usage.
     *
     * @returns {Promise<ApiResponse.GetDataUsage>}
     * @memberof API
     */
    public getDataUsage(): Promise<ApiResponse.GetDataUsage> {
        return this.endpoint<ApiResponse.GetDataUsage>('getdataused', [], true);
    }

    /**
     * Do a general player search that returns more detail information on the players.
     *
     * @param {string} name 
     * @returns {Promise<ApiResponse.SearchPlayers>}
     * @memberof API
     */
    public async searchPlayers(name: string) {
        try {
            const data = await this.endpoint<ApiResponse.SearchPlayers>('searchplayers', [name])
            data.forEach((player: any) => {
                player['portal_name'] = Portals[player['portal_id']];
            });
            return data
        } catch (err) {
            return Promise.reject(err)
        }
    }

    /** @ignore */
    private async endpoint<T>(endpoint: string, args: Array<any>, returnFirstElement: boolean = false): Promise<T> {
        let fArgs = <any>[endpoint].concat(args);
        let url = await this.buildUrl.apply(this, fArgs);

        try {
            const { data } = await axios.get(url)
            if (data.length > 0 && data[0]['ret_msg'] != null && data[0]['ret_msg'].toLowerCase() == 'invalid session id.') {
                await this.setSession();
                return this.endpoint(endpoint, args)
            }
            if (returnFirstElement && data.length > 0) {
                return data[0]
            }
            return data
        } catch (err) {
            return Promise.reject(err)
        }

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
    private async setSession(): Promise<string> {
        const url = `${this.getServiceUrl()}/createsessionJson/${this.options['devId']}/${this.getSignature('createsession')}/${this.getTimestamp()}`
        const response = await axios.get(url)
        let body = response.data

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
    private async getSession(): Promise<string> {
        if (this.sessionCache['sessionId'] == undefined || this.sessionCache['sessionId'] == null || this.sessionCache['sessionId'].length < 1) {
            return await this.setSession();
        }

        return this.sessionCache['sessionId'];
    }

    /** @ignore */
    private async buildUrl(method: string, player?: any, lang?: number, matchId?: number, champId?: number, queue?: number, tier?: number, season?: number, platform?: number) {
        let session = await this.getSession();
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
    private setupModule() {
        try {
            let data = fs.readFileSync(path.resolve(__dirname, 'cache', 'session.json'));
            this.sessionCache = JSON.parse(data.toString());
        } catch (err) {
            if (err.code == 'ENOENT') {
                fs.mkdirSync(path.resolve(__dirname, 'cache'), { recursive: true })
                fs.writeFileSync(path.resolve(__dirname, 'cache', 'session.json'), JSON.stringify(DefaultSessionCache));
                return;
            }

            throw new Error(err);
        }
    }
}
