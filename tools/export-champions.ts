import { API } from '../src/api';

let api = new API({
    devId: process.env.DEV_ID,
    authKey: process.env.AUTH_KEY
});