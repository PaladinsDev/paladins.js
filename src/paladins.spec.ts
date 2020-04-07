import API from './paladins';
import { PrivateProfileError, NotFoundError } from './errors';

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

test('player profile should throw not found error', async () => {
    try {
        await api.getPlayer(999999999999);
        expect(true).toBe(false);
    } catch (err) {
        expect(err.name).toBe(NotFoundError.name);
    }
});

test('player status should be offline', async () => {
    try {
        let status = await api.getPlayerStatus(9190374);

        expect(status['status']).toBe(0);
    } catch (err) {
        console.error(err);
    }
});