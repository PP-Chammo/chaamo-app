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

export const formatDate = (time: string) => {
  const date = new Date(time);

  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  if (isThisWeek(date)) return format(date, 'EEEE');
  if (isThisYear(date)) return format(date, 'MMM d');
  return format(date, 'MMM d, yyyy');
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

  return `${days}d ${hours}h`;
};
