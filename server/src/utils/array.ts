export const ArrayUtils = {
    /**
     * @description
     * Returns the first element of an array.
     *
     * @param {Array} array
     * @returns {any}
     */
    first(array) {
        return array[0];
    },

    /**
     * @description
     * Returns the last element of an array.
     *
     * @param {Array} array
     * @returns {any}
     */
    last(array) {
        return array[array.length - 1];
    },

    /**
    * @description
    * Returns the index of the first element of an array.
    *
    * @param {Array} array
    * @returns {number}

    * @example
    * const array = [1, 2, 3];
    *
    * array.firstIndex(); // 0
    */
    firstIndex(array) {
        return 0;
    },

    /**
    * @description
    * Returns the index of the last element of an array.
    *
    * @param {Array} array
    * @returns {number}

    * @example
    * const array = [1, 2, 3];
    *
    * array.lastIndex(); // 2
    */
    lastIndex(array) {
        return array.length - 1;
    },

    /**
    * @description
    * Returns the length of an array.
    *
    * @param {Array} array
    * @returns {number}

    * @example
    * const array = [1, 2, 3];
    *
  kj    * array.length(); //3
    */
    length(array) {
        return array.length;
    },

    /**
    * @description
    * Returns the order by which an array is sorted by ASCII.
    *
    * @param {Array} Array
    * @returns {Array}

    * @example
    * const array = [1, 2, 3];
    *
    * array.sort(); // [1, 2, 3]
    */
    sort(array) {
        return array.sort();
    },

    /**
    * @description
    * Returns the order by which an array is sorted by ASCII.
    *
    * @param {Array} Array
    * @returns {Array}

    * @example
    * const array = [ 'a', 'b', 'c' ];
    *
    * array.sort(); // [ 'a', 'b', 'c' ]
    */
    sortBy(array, fn) {
        return array.sort(fn);
    },

    /**
    * @description
    * Returns the order by which an array is sorted by localeCompare.
    *
    * @param {Array} Array
    * @returns {Array}

    * @example
    * const array = [ 'a', 'b', 'c' ];
    *
    * array.sort(); // [ 'a', 'b', 'c' ]
    */
    sortByLocale(array) {
        return array.sort((a, b) => a.localeCompare(b));
    },
};
