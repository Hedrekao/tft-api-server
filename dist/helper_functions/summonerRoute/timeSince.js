const timeSince = (epoch) => {
    let seconds = Math.floor((new Date().getTime() - epoch) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) {
        const rounded = Math.floor(interval);
        if (rounded == 1) {
            return rounded + 'year';
        }
        return rounded + ' years';
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        const rounded = Math.floor(interval);
        if (rounded == 1) {
            return rounded + 'month';
        }
        return rounded + ' months';
    }
    interval = seconds / 86400;
    if (interval > 1) {
        const rounded = Math.floor(interval);
        if (rounded == 1) {
            return rounded + 'day';
        }
        return rounded + ' days';
    }
    interval = seconds / 3600;
    if (interval > 1) {
        const rounded = Math.floor(interval);
        if (rounded == 1) {
            return rounded + 'hour';
        }
        return rounded + ' hours';
    }
    interval = seconds / 60;
    if (interval > 1) {
        const rounded = Math.floor(interval);
        if (rounded == 1) {
            return rounded + 'minute';
        }
        return rounded + ' minute';
    }
    const rounded = Math.floor(interval);
    if (rounded == 1) {
        return rounded + 'second';
    }
    return rounded + ' seconds';
};
export default timeSince;
