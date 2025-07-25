import { format, isThisWeek, isThisYear, isToday, isYesterday } from 'date-fns';

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
