import Config from '../config/config';

const PREFIX = Config.APP_PREFIX;

const deleteLocalStorage: (key: string) => void = (key) => {
    const prefixedKey = PREFIX + key;
    localStorage.removeItem(prefixedKey);
};

const getLocalStorage: (key: string) => string | null | undefined = (key) => {
    const prefixedKey = PREFIX + key;
    const item = localStorage.getItem(prefixedKey);
    return JSON.parse(item ?? 'null');
};

export { deleteLocalStorage, getLocalStorage };
