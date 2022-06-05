import { useEffect, useState } from 'react';
import Config from '../config/config';

const PREFIX = Config.APP_PREFIX;

const useLocalStorage = (
    key: string,
    initialValue?: Function | [] | string,
) => {
    const prefixedKey = PREFIX + key;

    const [value, setValue] = useState(() => {
        const jsonValue: any = localStorage.getItem(prefixedKey);
        if (jsonValue !== null && jsonValue !== 'undefined') {
            return JSON.parse(jsonValue);
        }
        return typeof initialValue === 'function'
            ? initialValue()
            : initialValue;
    });

    useEffect(() => {
        updateLocalStorage(prefixedKey, JSON.stringify(value));
    }, [prefixedKey, value]);

    return [value, setValue];
};

const setKeyIfNotExists: (key: string, value: any) => void = (key, value) => {
    if (localStorage.getItem(key) === null) {
        localStorage.setItem(key, value);
    }
};

const updateLocalStorage: (key: string, value: any) => void = (key, value) => {
    localStorage.setItem(key, value);
};

export default useLocalStorage;
