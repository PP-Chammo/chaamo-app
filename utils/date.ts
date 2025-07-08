import { format, isThisWeek, isThisYear, isToday, isYesterday } from 'date-fns';

export const formatTime = (time: Date) => {
  const date = new Date(time);

  if (isToday(date)) return format(date, 'HH:mm');
  if (isYesterday(date)) return 'Yesterday';
  if (isThisWeek(date)) return format(date, 'EEEE');
  if (isThisYear(date)) return format(date, 'MMM d');
  return format(date, 'MMM d, yyyy');
};
