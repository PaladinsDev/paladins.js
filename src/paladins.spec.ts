import API from './paladins';

let api = new API();

test('api service url should be present and set', () => {
    expect(api.getServiceUrl()).toBe('http://api.paladins.com/paladinsapi.svc');
});