import Util from './util/util';
import { DefaultOptions } from './util/constants';

export default class API {
    private serviceUrl: string = 'http://api.paladins.com/paladinsapi.svc';

    constructor(private options = {}) {
        this.options = Util.mergeDefaults(DefaultOptions, options);
    }

    public getServiceUrl(): string {
        return this.serviceUrl;
    }
}
