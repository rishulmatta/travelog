const dateFormatter = function (dte) {
    if (!dte) {
        return "";
    }
    let date;
    if (typeof dte != 'object') {
        date = new Date(dte).toISOString();
    } else {
        date = dte.toISOString();
    }

    let indexOfT = date.indexOf("T");
    return date.substring(0, indexOfT);
}

export const computeDaysRemaining = function (end, start=new Date()) {
    if (!end) {
        return "";
    }
    if (typeof end == 'string') {
        end = new Date(end);
    }
    let timeDiff = end.getTime() - start.getTime();
    let daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

    return daysRemaining > 0 ? daysRemaining : "";
}

export const isEndGreaterStart = function (end, start=new Date()) {
    if (!end) {
        return false;
    }
    if (typeof end == 'string') {
        end = new Date(end);
    }

    if (typeof start == 'string') {
        start = new Date(start);
    }
    let timeDiff = end.getTime() - start.getTime();

    if (timeDiff < 0) {
        return false
    }

    return true;
}

export default dateFormatter;