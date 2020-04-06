import Util from './util/util';
import { DefaultOptions, DefaultSessionCache } from './util/constants';
import fs from 'promise-fs';
import * as path from 'path';
import moment from 'moment';
import md5 from 'md5';
import rp from 'request-promise';
import sr from 'sync-request';

export default class API {
    private serviceUrl: string = 'http://api.paladins.com/paladinsapi.svc';
    private sessionCache: { [key: string]: any} = {};

    constructor(private options: { [key: string]: any} = { }) {
        this.options = Util.mergeDefaults(DefaultOptions, options);

        this.setupModule()
    }

    public getServiceUrl(): string {
        return this.serviceUrl;
    }

    /**
     * Get a player and their details.
     *
     * @param {number} player
     * @returns {Promise}
     * @memberof API
     */
    public getPlayer(player: number) {
        return this.endpoint("getplayer", [player]);
    }

    public getDataUsage(): Promise<any> {
        return this.endpoint('getdataused', []);
    }

    private endpoint(endpoint: string, args: Array<any>): Promise<any> {
        let fArgs = <any>[endpoint].concat(args);
        let url = this.buildUrl.apply(this, fArgs);

        return new Promise((resolve, reject) => {
            this.makeRequest(url)
                .then((data: any) => {
                    data = JSON.parse(data);

                    if (data[0]['ret_msg'] != null && data[0]['ret_msg'].toLowerCase() == 'invalid session id.') {
                        this.setSession();
                        resolve(this.endpoint(endpoint, args))
                    }

                    resolve(data);
                })
                .catch((err: any) => {
                    reject(err);
                })
        })
    }

    private getTimestamp() {
        return moment().utc().format('YYYYMMDDHHmmss');
    }

    private getSignature(method: string) {
        return md5(`${this.options['devId']}${method}${this.options['authKey']}${this.getTimestamp()}`)
    }

    private setSession(): string {
        let response = sr('GET', `${this.getServiceUrl()}/createsessionJson/${this.options['devId']}/${this.getSignature('createsession')}/${this.getTimestamp()}`);
        let body = JSON.parse(response.body.toString());
        this.sessionCache = {
            sessionId: body.session_id,
            createdAt: this.getTimestamp(),
            data: body
        };

        this.saveSessionCache();

        return this.sessionCache['sessionId'];
    }

    private saveSessionCache() {
        fs.writeFileSync(path.resolve(__dirname, 'cache', 'session.json'), JSON.stringify(this.sessionCache));
    }

    private getSession(): string {
        if (this.sessionCache['sessionId'] == undefined || this.sessionCache['sessionId'] == null) {
            return this.setSession();
        }

        return this.sessionCache['sessionId'];
    }

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

    private makeRequest(url: string) {
        return rp(url).then((r: any) => {
            return r;
        });
    }

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
