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
        return new Date(new Date().setHours(24, 0, 0, 0));
    },

    now: () => {
        return new Date();
    },
};
