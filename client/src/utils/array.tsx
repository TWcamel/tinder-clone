const arrayEqualty = (a: any[], b: any[]) => {
    if (a.length !== b.length) {
        return false;
    }

    a.sort() && b.sort();

    return a.every((item, index) => {
        return item === b[index];
    });
};

export { arrayEqualty };
