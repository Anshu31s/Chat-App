import { useCallback } from 'react';

export function DateTimeFormatter() {
  const formatDate = useCallback((dateInput) => {
    if (!dateInput) return '';

    const date = new Date(dateInput);
    const now = new Date();

    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const pad = (n) => (n < 10 ? '0' + n : n);

    const hours = date.getHours();
    const minutes = pad(date.getMinutes());
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = pad(hours % 12 || 12);
    const timeString = `${formattedHours}:${minutes} ${ampm}`;

    if (isToday) {
      return timeString;
    } else {
      const day = pad(date.getDate());
      const month = pad(date.getMonth() + 1); // months are 0-indexed
      const year = String(date.getFullYear()).slice(-2);
      return `${day}/${month}/${year} ${timeString}`;
    }
  }, []);

  return { formatDate };
}
