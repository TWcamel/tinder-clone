export default {
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

    getCurrentTime: () => {
        return new Date().toLocaleString();
    },

    tomorrow: () => {
        return new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    },
};
