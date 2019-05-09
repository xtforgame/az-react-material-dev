import moment from 'moment';

// const diaplayFormat = 'YYYY/MM/DD HH:mm';
export const diaplayFormat = 'lll';

export const timeFormat = 'YYYY-MM-DD[T]HH:mm:ss.SSSZZ';

export const getDateTimeDisplayFuncFromProps = props => (date, invalidLabel) => ((date === null) ? invalidLabel : moment(date).format(diaplayFormat));
