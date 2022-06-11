import Config from '../config/config';

const PREFIX = Config.APP_PREFIX;
const DEBUG = Config.DEBUG_FLAG;

const deleteLocalStorage: (key: string) => void = (key) => {
    const prefixedKey = PREFIX + key;
    localStorage.removeItem(prefixedKey);
};

const getLocalStorage: (key: string) => string = (key) => {
    const prefixedKey = PREFIX + key;
    const item = localStorage.getItem(prefixedKey);
    if (DEBUG)
        console.log(
            `getLocalStorage: ${prefixedKey} = ${item?.substring(0, 50)}`,
        );
    if (item != null && item.length && item !== 'undefined')
        return JSON.parse(item);
};

const clearAllLocalStorage: () => void = () => {
    localStorage.clear();
};

export { deleteLocalStorage, getLocalStorage, clearAllLocalStorage };
