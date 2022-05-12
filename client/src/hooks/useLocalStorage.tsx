import { useEffect, useState } from 'react';

const PREFIX = 'tinder-clone-';

const useLocalStorage = (key: string, initialValue?: any) => {
    const prefixedKey = PREFIX + key;

    const [value, setValue] = useState(() => {
        const jsonValue = localStorage.getItem(prefixedKey) || null;
        if (jsonValue !== null) return JSON.parse(jsonValue);
        return typeof initialValue === 'function'
            ? initialValue()
            : initialValue;
    });

    useEffect(() => {
        localStorage.setItem(prefixedKey, JSON.stringify(value));
    }, [prefixedKey, value]);

    return [value, setValue];
};

export default useLocalStorage;
