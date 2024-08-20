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

export function renderDurationText(selectedDuration) {
    if (selectedDuration === 'today') {
        return "Astăzi";
    } else if (selectedDuration === '1week') {
        return "7 zile";
    } else if (selectedDuration === '2weeks') {
        return "14 zile";
    } else if (selectedDuration === 'month') {
        return "30 zile";
    } else {
        return "";
    }
};

export function renderTypeText(selectedType) {
    if (selectedType === 'checkup') {
        return "ITP-ul";
    } else if (selectedType === 'vignette') {
        return "Rovinieta";
    } else if (selectedType === 'insurance') {
        return "RCA-ul";
    } else {
        return "";
    }
};

export function disableButton(lastNotificationDate) {
    const now = new Date();
    const todayDate = now.toLocaleDateString();

    const notif = new Date(lastNotificationDate);
    const notifDate = notif.toLocaleDateString();

    if (notifDate === todayDate) {
        return true;
    }
}
