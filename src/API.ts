import moment from "moment";
import md5 from "md5";
import { Cache } from "cache-driver";

const rp = require("request-promise");
const request = require("request");
const sr = require("sync-request");

export class API {
    private static instance: API;

    private cache: Cache|null = null;
    private apiUrl: string = "http://api.paladins.com/paladinsapi.svc";
    private sessionCacheId: string = "paladinsjs.sessionId";

    constructor(private devId: string, private authKey: string, cache?: Cache, private languageId?: number) {
        if (cache) {
            this.cache = cache;
        }
        
        if (!languageId) {
            this.languageId = 1;
        }
    }

    public static getInstance(devId: string, authKey: string, cache?: Cache, languageId?: number) {
        if (!this.instance) {
            this.instance = new API(devId, authKey, cache, languageId);
        }

        return this.instance;
    }

    /**
     * Get the top 50 most watched/recent matches.
     *
     * @return any
     */
    public getTopMatches() {
        return this.endpoint("gettopmatches", []);
    }

    public getMatchIdsByQueue(hour: string, date: any, queue: number = 424) {
        return this.makeRequest(`${this.apiUrl}/getmatchidsbyqueueJson/${this.devId}/${this.getSignature("getmatchidsbyqueue")}/${this.getSession()}/${this.getTimestamp()}/{queue}/{date}/{hour}`);
    }

    /**
     * Get all the champions for the game.
     *
     * @return any
     */
    public getChampions() {
        return this.endpoint("getchampions", [null, this.languageId]);
    }

    /**
     * Get all the available cards for the requested champion.
     *
     * @param number championId
     * @return any
     */
    public getChampionCards(championId: number) {
        return this.endpoint("getchampioncards", [null, this.languageId, null, championId]);
    }

    /**
     * Get all the available skins for the requested champion.
     *
     * @param number championId
     * @return any
     */
    public getChampionSkins(championId: number) {
        return this.endpoint("getchampionskins", [null, this.languageId, null, championId]);
    }

    /**
     * Get all the available in game items.
     *
     * @return any
     */
    public getItems() {
        return this.endpoint("getitems", [null, this.languageId]);
    }

    /**
     * Get a player and their details from the API.
     *
     * @param number player
     * @return any
     */
    public getPlayer(player: number) {
        return this.endpoint("getplayer", [player]);
    }

    /**
     * Get an array of players with the requested name.
     *
     * @param string name
     * @return any
     */
    public getPlayerIdByName(name: string) {
        return this.endpoint("getplayeridbyname", [name]);
    }

    /**
     * Get a player from PC or PSN. Does not work with Xbox or Switch.
     *
     * @param string name
     * @param number platform
     * @return any
     */
    public getPlayerIdByPortalUserId(name: string, platform: number) {
        return this.endpoint("getplayeridbyportaluserid", [name, null, null, null, null, null, null, platform]);
    }

    /**
     * Get player ids by the gamertag.
     *
     * @param string name
     * @param number platform
     * @return any
     */
    public getPlayerIdsByGamertag(name: string, platform: number) {
        return this.endpoint("getplayeridsbygamertag", [name, null, null, null, null, null, null, platform]);
    }

    /**
     * Get player id info for Xbox and Switch.
     *
     * @param string name
     * @return any
     */
    public getPlayerIdInfoForXboxAndSwitch(name: string) {
        return this.endpoint("getplayeridinfoforxboxandswitch", [name]);
    }

    /**
     * Get all the friends for the requested player.
     *
     * @param number playerId
     * @return any
     */
    public getPlayerFriends(playerId: number) {
        return this.endpoint("getfriends", [playerId]);
    }

    /**
     * Get all the champion ranks for the requested player.
     *
     * @param number playerId
     * @return any
     */
    public getPlayerChampionRanks(playerId: number) {
        return this.endpoint("getchampionranks", [playerId]);
    }

    /**
     * Get all the champion loadouts for the requested player.
     *
     * @param number playerId
     * @return any
     */
    public getPlayerLoadouts(playerId: number)
    {
        return this.endpoint("getplayerloadouts", [playerId, this.languageId]);
    }

    /**
     * Get the current status of the player.
     *
     * @param number playerId
     * @return any
     */
    public getPlayerStatus(playerId: number)
    {
        return this.endpoint("getplayerstatus", [playerId]);
    }

    /**
     * Get the match history of the requested player.
     *
     * @param number playerId
     * @return any
     */

    public getPlayerMatchHistory(playerId: number)
    {
        return this.endpoint("getmatchhistory", [playerId]);
    }

    /**
     * Get the information for an ended match.
     *
     * @param number matchId
     * @return any
     */

    public getMatchModeDetails(matchId: number)
    {
        return this.endpoint("getmodedetails", [matchId]);
    }

    /**
     * Get match details from an ended match.
     *
     * @param number matchId
     * @return any
     */
    public getMatchDetails(matchId: number)
    {
        return this.endpoint("getmatchdetails", [null, null, matchId]);
    }

    /**
     * Get some basic info for a live/active match.
     *
     * @param number matchId
     * @return any
     */
    public getActiveMatchDetails(matchId: number)
    {
        return this.endpoint("getmatchplayerdetails", [null, null, matchId]);
    }

    /**
     * Show the current usage and usage limits for the API.
     *
     * @return any
     */
    public getDataUsage() {
        return this.endpoint("getdataused", []);
    }

    /**
     * 
     * @param string endpoint
     * @param Array<any> args 
     */
    public endpoint(endpoint: string, args: Array<any>) {
        let fArgs = <any>[endpoint].concat(args);
        let url = this.buildUrl.apply(this, fArgs);

        return this.makeRequest(url);
    }

    /**
     * Get the current session id, or set it if it's not set.
     *
     * @return string
     */
    private getSession(): string {
        if (this.cache) {
            if (this.cache.has(this.sessionCacheId)) {
                return this.cache.get(this.sessionCacheId);
            } else {
                let response = sr("GET", `${this.apiUrl}/createsessionJson/${this.devId}/${this.getSignature("createsession")}/${this.getTimestamp()}`);
                let body = JSON.parse(response.body.toString());

                this.cache.save(this.sessionCacheId, body.session_id, 12);

                return body.session_id;
            }
        } else {
            console.warn("No cache driver exists. This will create a new session on each request. Please enable a cache driver.");

            let response = sr("GET", `${this.apiUrl}/createsessionJson/${this.devId}/${this.getSignature("createsession")}/${this.getTimestamp()}`);
            let body = JSON.parse(response.body.toString());

            return body.session_id;
        }
    }

    /**
     * Get the current timestamp in a simple format for API calls.
     *
     * @return string
     */
    private getTimestamp() {
        return moment().utc().format("YYYYMMDDHHmmss");
    }

    /**
     * Get the authorization signature for the API calls.
     *
     * @param string method
     * @return string
     */

    private getSignature(method: string) {
        return md5(`${this.devId}${method}${this.authKey}${this.getTimestamp()}`);
    }

    /**
     * Build the proper URL for a variety of methods.
     *
     * @param string method
     * @param any player
     * @param number lang
     * @param number match_id
     * @param number champ_id
     * @param number queue
     * @param number tier
     * @param number season
     * @param number platform
     * @return string
     * 
     */
    private buildUrl(method: string, player?: any, lang?: number, matchId?: number, champId?: number, queue?: number, tier?: number, season?: number, platform?: number) {
        let session = this.getSession();
        let baseUrl = `${this.apiUrl}/${method}Json/${this.devId}/${this.getSignature(method)}/${session}/${this.getTimestamp()}`;

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

    /**
     * Makes the request to the API and error checks it as well.
     *
     * @param string url
     * @return any
     * 
     */

    private makeRequest(url: string) {
        return rp(url).then((r: any) => {
            return r;
        });
    }
}
