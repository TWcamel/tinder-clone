const arrayEqualty = (a: any[], b: any[]) => {
    if (a.length !== b.length) {
        return false;
    }

    a.sort() && b.sort();

    return a.every((item, index) => {
        return item === b[index];
    });
};

const removeItem = (array: any[], item: any) => {
    const index = array.indexOf(item);
    if (index === 0 && array.length === 1) {
        return [];
    } else if (index > -1) {
        array.splice(index, 1);
    }
    return array;
};

const stringToArray = (str: string) => {
    return str.replace(/"/g, '').trim();
};

const arrayIsEmpty = (array: any[]) => {
    return Array.isArray(array) && array.length === 0;
};

const fileArrayIsEmpty = (array: File[]) => {
    return Array.isArray(array) && array.length === 1 && array[0].name === '';
};

const twoObjOfArrayEqualty = (a: object[], b: object[]) => {
    if (a.length !== b.length) {
        return false;
    }

    Object.keys(a[0])
        .sort()
        .forEach((key) => {
            if (Object.keys(b[0]).includes(key)) return false;
        });

    return true;
};

const arrayFull = (array: any[], size: number) => {
    return Array.isArray(array) && array.length === size;
};

export {
    arrayEqualty,
    removeItem,
    stringToArray,
    arrayIsEmpty,
    fileArrayIsEmpty,
    twoObjOfArrayEqualty,
    arrayFull,
};
