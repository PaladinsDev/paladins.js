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

    public getTopMatches() {
        return this.endpoint("gettopmatches", []);
    }

    public getMatchIdsByQueue(hour: string, date: any, queue: number = 424) {
        return this.makeRequest(`${this.apiUrl}/getmatchidsbyqueueJson/${this.devId}/${this.getSignature("getmatchidsbyqueue")}/${this.getSession()}/${this.getTimestamp()}/${queue}/${date}/${hour}`);
    }

    public getChampions() {
        return this.endpoint("getchampions", [null, this.languageId]);
    }

    public getChampionCards(championId: number) {
        return this.endpoint("getchampioncards", [null, this.languageId, null, championId]);
    }

    public getChampionSkins(championId: number) {
        return this.endpoint("getchampionskins", [null, this.languageId, null, championId]);
    }

    public getItems() {
        return this.endpoint("getitems", [null, this.languageId]);
    }

    public getPlayer(player: number) {
        return this.endpoint("getplayer", [player]);
    }

    public getPlayerIdByName(name: string) {
        return this.endpoint("getplayeridbyname", [name]);
    }

    public getPlayerIdByPortalUserId(name: string, platform: number) {
        return this.endpoint("getplayeridbyportaluserid", [name, null, null, null, null, null, null, platform]);
    }

    public getPlayerIdsByGamertag(name: string, platform: number) {
        return this.endpoint("getplayeridsbygamertag", [name, null, null, null, null, null, null, platform]);
    }

    public getPlayerIdInfoForXboxAndSwitch(name: string) {
        return this.endpoint("getplayeridinfoforxboxandswitch", [name]);
    }

    public getPlayerFriends(playerId: number) {
        return this.endpoint("getfriends", [playerId]);
    }

    public getPlayerChampionRanks(playerId: number) {
        return this.endpoint("getchampionranks", [playerId]);
    }

    public getPlayerLoadouts(playerId: number)
    {
        return this.endpoint("getplayerloadouts", [playerId, this.languageId]);
    }

    public getPlayerStatus(playerId: number)
    {
        return this.endpoint("getplayerstatus", [playerId]);
    }

    public getPlayerMatchHistory(playerId: number)
    {
        return this.endpoint("getmatchhistory", [playerId]);
    }

    public getMatchModeDetails(matchId: number)
    {
        return this.endpoint("getmodedetails", [matchId]);
    }

    public getMatchDetails(matchId: number)
    {
        return this.endpoint("getmatchdetails", [null, null, matchId]);
    }

    public getActiveMatchDetails(matchId: number)
    {
        return this.endpoint("getmatchplayerdetails", [null, null, matchId]);
    }

    public getDataUsage() {
        return this.endpoint("getdataused", []);
    }

    public endpoint(endpoint: string, args: Array<any>) {
        let fArgs = <any>[endpoint].concat(args);
        let url = this.buildUrl.apply(this, fArgs);

        console.log(url);

        return this.makeRequest(url);
    }

    private getSession() {
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

    private getTimestamp() {
        return moment().utc().format("YYYYMMDDHHmmss");
    }

    private getSignature(method: string) {
        return md5(`${this.devId}${method}${this.authKey}${this.getTimestamp()}`);
    }

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

    private makeRequest(url: string) {
        return rp(url).then((r: any) => {
            return r;
        });
    }
}