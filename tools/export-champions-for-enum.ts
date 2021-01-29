import { API } from '../src/api';
import fs from 'fs';

let api = new API({
    devId: process.env.DEV_ID,
    authKey: process.env.AUTH_KEY
});

api.getChampions().then((data: any) => {
    let champs = '';
    
    data.forEach((champ: any) => {
        champs += `${champ.Name} = ${champ.id}\n`;
    });
    
    fs.writeFileSync('./tools/data/export-champions-for-enum.txt', champs);
})