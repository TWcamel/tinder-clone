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
    return str
        .replace(/"/g, '')
        .replace('[', '')
        .replace(']', '')
        .split(',')
        .map((item) => item.trim());
};

export { arrayEqualty, removeItem, stringToArray };
