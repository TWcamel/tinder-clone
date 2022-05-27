import Config from '../config/config';

const PREFIX = Config.APP_PREFIX;

const deleteLocalStorage: (key: string) => void = (key) => {
    const prefixedKey = PREFIX + key;
    localStorage.removeItem(prefixedKey);
};

export { deleteLocalStorage };
