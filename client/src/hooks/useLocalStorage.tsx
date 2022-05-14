import { useEffect, useState } from 'react';

const PREFIX = 'tinder-clone-';

const setKeyIfNotExists: (key: string, value: any) => void = (key, value) => {
    if (localStorage.getItem(key) === null) {
        localStorage.setItem(key, value);
    }
};

const updateLocalStorage: (key: string, value: any) => void = (key, value) => {
    localStorage.setItem(key, value);
};

const useLocalStorage = (
    key: string,
    initialValue?: Function | [] | string,
) => {
    const prefixedKey = PREFIX + key;

    const [value, setValue] = useState(() => {
        const jsonValue: string | null = localStorage.getItem(prefixedKey);
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

export default useLocalStorage;
