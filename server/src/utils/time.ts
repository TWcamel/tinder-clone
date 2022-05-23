export const Time = {
    getDate: (date: Date) => {
        return date.getDate();
    },

    convertTZ: (date, tzString) => {
        return new Date(
            (typeof date === 'string' ? new Date(date) : date).toLocaleString(
                'en-US',
                { timeZone: tzString },
            ),
        );
    },

    convertToLocal: (date) => {
        return date.toLocaleString();
    },
};
