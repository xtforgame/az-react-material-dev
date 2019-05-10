import moment from 'moment';

// const dateDisplayFormat = 'YYYY/MM/DD';
export const dateDisplayFormat = 'll';

// const timeDisplayFormat = 'HH:mm';
export const timeDisplayFormat = 'LT';

// const dateTimeDisplayFormat = 'YYYY/MM/DD HH:mm';
export const dateTimeDisplayFormat = 'lll';

export const timeFormat = 'YYYY-MM-DD[T]HH:mm:ss.SSSZZ';

export const getDateDisplayFuncFromProps = props => (date, invalidLabel) => ((date === null) ? invalidLabel : moment(date).format(dateDisplayFormat));

export const getTimeDisplayFuncFromProps = props => (date, invalidLabel) => ((date === null) ? invalidLabel : moment(date).format(timeDisplayFormat));

export const getDateTimeDisplayFuncFromProps = props => (date, invalidLabel) => ((date === null) ? invalidLabel : moment(date).format(dateTimeDisplayFormat));
