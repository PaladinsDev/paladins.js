/** @ignore *//** */
const has = (o: any, k: any) => Object.prototype.hasOwnProperty.call(o, k);

export default class Util {
    public static mergeDefaults(defaultOptions: { [key: string]: any}, givenOptions: { [key: string]: any}): { [key: string]: any} {
        if (!givenOptions) {
            return defaultOptions;
        }

        for (let key in defaultOptions) {
            if (!has(givenOptions, key) || givenOptions[key] == undefined) {
                givenOptions[key] = defaultOptions[key]
            } else if (givenOptions[key] === Object(givenOptions[key])) {
                givenOptions[key] = Util.mergeDefaults(defaultOptions[key], givenOptions[key]);
            }
        }
        
        return givenOptions;
    }
}