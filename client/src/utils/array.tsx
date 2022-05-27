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
    console.log(array);
    const index = array.indexOf(item);
    console.log(index, array.length );
    if (index === 0 && array.length === 1) {
        return [];
    } else if (index > -1) {
        array.splice(index, 1);
    }
    return array;
};

export { arrayEqualty, removeItem };
