import Util from './util/util';
import { DefaultOptions, DefaultSessionCache } from './util/constants';
import fs from 'promise-fs';
import * as path from 'path';
import moment from 'moment';
import md5 from 'md5';
import rp from 'request-promise';
import sr from 'sync-request';
import { NotFoundError, PrivateProfileError, UnauthorizedDeveloper } from './errors';

export default class API {
    private serviceUrl: string = 'http://api.paladins.com/paladinsapi.svc';
    private sessionCache: { [key: string]: any} = {};

    constructor(private options: { [key: string]: any} = { }) {
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
     * Get a player and their details.
     *
     * @param {number} player
     * @returns {Promise}
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
     * Get the current data usage.
     *
     * @returns {Promise<any>}
     * @memberof API
     */
    public getDataUsage(): Promise<any> {
        return this.endpoint('getdataused', [], true);
    }

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

    private getTimestamp() {
        return moment().utc().format('YYYYMMDDHHmmss');
    }

    private getSignature(method: string) {
        return md5(`${this.options['devId']}${method}${this.options['authKey']}${this.getTimestamp()}`)
    }

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

    private saveSessionCache() {
        fs.writeFileSync(path.resolve(__dirname, 'cache', 'session.json'), JSON.stringify(this.sessionCache));
    }

    private getSession(): string {
        if (this.sessionCache['sessionId'] == undefined || this.sessionCache['sessionId'] == null || this.sessionCache['sessionId'].length < 1) {
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
