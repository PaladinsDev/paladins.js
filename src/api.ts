export default class API {
    private serviceUrl: string = 'http://api.paladins.com/paladinsapi.svc';

    public getServiceUrl(): string {
        return this.serviceUrl;
    }
}
