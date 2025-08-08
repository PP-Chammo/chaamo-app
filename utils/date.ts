import {
  differenceInHours,
  format,
  isThisWeek,
  isThisYear,
  isToday,
  isYesterday,
  parseISO,
} from 'date-fns';

export const formatTime = (time: string) => {
  const date = new Date(time);

  if (isToday(date)) return format(date, 'HH:mm');
  if (isYesterday(date)) return 'Yesterday';
  if (isThisWeek(date)) return format(date, 'EEEE');
  if (isThisYear(date)) return format(date, 'MMM d');
  return format(date, 'MMM d, yyyy');
};

export const formatDate = (
  date: string | Date,
  formatString: string = 'dd/MM/yyyy',
): string => {
  const inputDate = typeof date === 'string' ? new Date(date) : date;

  switch (formatString) {
    case 'dd/MM/yyyy':
      return format(inputDate, 'dd/MM/yyyy');
    case 'friendly':
      if (isToday(inputDate)) return 'Today';
      if (isYesterday(inputDate)) return 'Yesterday';
      if (isThisWeek(inputDate)) return format(inputDate, 'EEEE');
      if (isThisYear(inputDate)) return format(inputDate, 'MMM d');
      return format(inputDate, 'MMM d, yyyy');
    case 'time':
      if (isToday(inputDate)) return format(inputDate, 'HH:mm');
      if (isYesterday(inputDate)) return 'Yesterday';
      if (isThisWeek(inputDate)) return format(inputDate, 'EEEE');
      if (isThisYear(inputDate)) return format(inputDate, 'MMM d');
      return format(inputDate, 'MMM d, yyyy');
    default:
      return format(inputDate, formatString);
  }
};

export const formatDateInput = (value: string) => {
  const digits = value.replace(/\D/g, '');
  const limited = digits.substring(0, 8);
  let result = '';
  if (limited.length <= 2) {
    result = limited;
  } else if (limited.length <= 4) {
    result = `${limited.slice(0, 2)}/${limited.slice(2)}`;
  } else {
    result = `${limited.slice(0, 2)}/${limited.slice(2, 4)}/${limited.slice(4)}`;
  }
  return result;
};

export const formatElapsedTime = (dateInput: string | Date): string => {
  const now = new Date();
  const inputDate =
    typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;

  const totalHours = differenceInHours(inputDate, now);
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;

  if (days > 0) {
    return `${days}d ${hours}h ago`;
  }
  return `${hours}h ago`;
};
