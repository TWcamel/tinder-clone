const arrayEquailty = (a: any[], b: any[]) => {
    if (a.length !== b.length) {
        return false;
    }

    a.sort();
    b.sort();

    a.every((item, index) => {
        return item === b[index];
    });

    return true;
};

export { arrayEquailty };
