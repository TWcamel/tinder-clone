export default {
    /**
     * @description
     * Returns the first element of an array.
     *
     * @param {Array<any>} array
     * @returns {any}
     */
    first(array: Array<any>): any {
        return array[0];
    },

    /**
     * @description
     * Returns the last element of an array.
     *
     * @param {Array<any>} array
     * @returns {any}
     */
    last(array: Array<any>): any {
        return array[array.length - 1];
    },

    /**
    * @description
    * Returns the index of the first element of an array.
    *
    * @param {Array<any>} array
    * @returns {number}

    * @example
    * const array = [1, 2, 3];
    *
    * array.firstIndex(); // 0
    */
    firstIndex(array: Array<any>): number {
        return 0;
    },

    /**
    * @description
    * Returns the index of the last element of an array.
    *
    * @param {Array<any>} array
    * @returns {number}

    * @example
    * const array = [1, 2, 3];
    *
    * array.lastIndex(); // 2
    */
    lastIndex(array: Array<any>): number {
        return array.length - 1;
    },

    /**
    * @description
    * Returns the length of an array.
    *
    * @param {Array<any>} array
    * @returns {number}

    * @example
    * const array = [1, 2, 3];
    *
  kj    * array.length(); //3
    */
    length(array: Array<any>): number {
        return array.length;
    },

    /**
    * @description
    * Returns the order by which an array is sorted by ASCII.
    *
    * @param {Array<any>} array
    * @returns {Array<any>}

    * @example
    * const array = [1, 2, 3];
    *
    * array.sort(); // [1, 2, 3]
    */
    sort(array: Array<any>): Array<any> {
        return array.sort();
    },

    /**
    * @description
    * Returns the order by which an array is sorted by ASCII.
    *
    * @param {Array<any>} array
    * @returns {Array<any>}

    * @example
    * const array = [ 'a', 'b', 'c' ];
    *
    * array.sort(); // [ 'a', 'b', 'c' ]
    */
    sortBy(array: Array<any>, fn: any): Array<any> {
        return array.sort(fn);
    },

    /**
    * @description
    * Returns the order by which an array is sorted by localeCompare.
    *
    * @param {Array<any>} array
    * @returns {Array<any>}

    * @example
    * const array = [ 'a', 'b', 'c' ];
    *
    * array.sort(); // [ 'a', 'b', 'c' ]
    */
    sortByLocale(array: Array<any>): Array<any> {
        return array.sort((a, b) => a.localeCompare(b));
    },

    /**
    * @description
    * Returns the privided object is an array.
    *
    * @param {any} obj
    * @returns {boolean}

    * @example
    * const array = [1, 2, 3];
    *
    * Array.isArray(array); // true
    */
    isArray(obj: any): boolean {
        return obj && typeof obj === 'object' && obj.constructor === Array;
    },

    /**
    * @description
    * Returns the privided string as an array that removes '[' and ']'.
    *
    * @param {string} str
    * @returns {Array<any>}

    * @example
    * const array = '[1, 2, 3]';
    *
    * array.toArray(); // [1, 2, 3]
    */
    toArray(str: string): Array<any> {
        return str.replace(/[\[\]]/g, '').split(',');
    },
};
