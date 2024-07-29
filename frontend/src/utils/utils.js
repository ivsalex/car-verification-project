import moment from 'moment';

export function formatTimeStamp(timestamp) {
    const date = new Date(timestamp);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = (date.getUTCFullYear()).toString().padStart(2, '0');

    return `${day}.${month}.${year}`;
}

export const isExpired = (date) => {
    if (!date) return false;
    const expirationDate = moment(date);
    const today = moment().startOf('day');
    return expirationDate.isBefore(today);
};

export function countRemainingDays(expirationDate) {
    const expiration = new Date(expirationDate);
    const today = new Date();

    const differenceMs = expiration - today;

    const daysRemaining = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));

    return daysRemaining;
}

export function formatLicensePlate(plateNumber) {
    if (!plateNumber) return '';

    plateNumber = plateNumber.replace(/\s/g, '');

    return plateNumber.replace(/([A-Z]+)([0-9]+)/g, '$1 $2 ');
}
