import moment from "moment";

const formatDate = (date: Date) => {
    const inputDate = moment(date);
    const today = moment();
    const yesterday = moment().subtract(1, 'day');

    if (inputDate.isSame(today, 'day')) {
        // Date is today: return time in AM/PM format
        return inputDate.format('h:mm A');
    } else if (inputDate.isSame(yesterday, 'day')) {
        // Date is yesterday: return 'Yesterday'
        return 'Yesterday';
    } else {
        // Date is before yesterday: return date in 'MMM DD' format
        return inputDate.format('MMM DD');
    }
}

export default formatDate;