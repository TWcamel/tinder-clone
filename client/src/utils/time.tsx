import moment from 'moment';

const convertToLocalTimeZone = (time: Date) => {
    return time.toLocaleString();
};

const utcToCst = (time: Date) => {
    return new Date(`${time}`).toLocaleString('en-US', {
        timeZone: 'CST',
    });
};

const getLocalTimeBrief = (time: Date) => {
    return moment(time).format('MMM DD HH:mm');
};

export { convertToLocalTimeZone, utcToCst, getLocalTimeBrief };
