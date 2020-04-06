import API from './paladins';
import { PrivateProfileError } from './errors';

let api = new API({
    devId: process.env.DEV_ID,
    authKey: process.env.AUTH_KEY
});

test('api service url should be present and set', () => {
    expect(api.getServiceUrl()).toBe('http://api.paladins.com/paladinsapi.svc');
});

test('player profile should throw private profile error', async () => {
    try {
        await api.getPlayer(15321771);
        expect(true).toBe(false);
    } catch (err) {
        expect(err.name).toBe(PrivateProfileError.name);
    }
});