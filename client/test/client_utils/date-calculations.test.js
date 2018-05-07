import dateFormatter, {
    computeDaysRemaining,
    isEndGreaterStart
} from 'client_utils/date-calculations';

function dateHelper(dte, afterDays) {
    var clone = new Date(dte.getTime());
    return new Date(clone.setDate(clone.getDate() + afterDays));
}

describe('dateFormatter', () => {
    it('should return empty string for falsey value', () => {
        ["", false, undefined, null].forEach((value) => {
            let returnVal = dateFormatter(value);
            expect(returnVal).toBe("");
        });
    });

    it('should not return time stamp', () => {
        let returnVal = dateFormatter(new Date());
        expect(returnVal.indexOf('Z')).toBe(-1);
        expect(returnVal.indexOf(':')).toBe(-1);
        expect(returnVal.indexOf('T')).toBe(-1);
    });
});

describe('computeDaysRemaining', () => {
    it('should return 2 for a date after 2 days', () => {
        let presentDate = new Date();
        let futureDate = dateHelper(presentDate, 2);
        let returnVal = computeDaysRemaining(futureDate, presentDate);
        expect(returnVal).toBe(2);
    });

    it('should return 3 for a date after 3 days only end date passed', () => {
        let presentDate = new Date();
        let futureDate = dateHelper(presentDate, 3);
        let returnVal = computeDaysRemaining(futureDate);
        expect(returnVal).toBe(3);
    });

    it('should return "" for a date before 2 days', () => {
        let presentDate = new Date();
        let futureDate = dateHelper(presentDate, 2);
        let returnVal = computeDaysRemaining(presentDate, futureDate);
        expect(returnVal).toBe("");
    });

    it('should return "" for a same date', () => {
        let presentDate = new Date();
        let returnVal = computeDaysRemaining(presentDate, presentDate);
        expect(returnVal).toBe("");
    });
});

describe('isEndGreaterStart', () => {
    it('should return true for greater date', () => {
        let dte = new Date();
        expect(isEndGreaterStart(dateHelper(dte, 2), dte)).toBe(true);
    });

    it('should return true for only end date and by default compare with present', () => {
        let dte = new Date();
        expect(isEndGreaterStart(dateHelper(dte, 2))).toBe(true);

    });

    it('should return false for lesser date', () => {
        let dte = new Date();
        expect(isEndGreaterStart(dte, dateHelper(dte, 2))).toBe(false);
    });

    it('should return false for empty end date', () => {
        let dte = new Date();
        expect(isEndGreaterStart("", dateHelper(dte, 2))).toBe(false);
    });

});