/**
 * Safe Local Date Utilities
 * Ensures date comparisons and strings don't drift across timezones.
 */

export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function getTodayKey(): string {
  return formatDateKey(new Date());
}

export function formatDisplayDate(dateInput: Date | string): string {
  const d = typeof dateInput === 'string' ? parseDateKey(dateInput) : dateInput;
  return d.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function formatShortDate(dateInput: Date | string): string {
  const d = typeof dateInput === 'string' ? parseDateKey(dateInput) : dateInput;
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric'
  });
}

export function getWeekdayLabel(dateInput: Date | string): string {
  const d = typeof dateInput === 'string' ? parseDateKey(dateInput) : dateInput;
  return d.toLocaleDateString(undefined, { weekday: 'short' });
}

export function addDays(date: Date, days: number): Date {
  const copy = new Date(date.getTime());
  copy.setDate(copy.getDate() + days);
  return copy;
}

export function subtractDays(date: Date, days: number): Date {
  return addDays(date, -days);
}

/**
 * Returns date keys for the past N days ending today (inclusive)
 */
export function getPastNDaysKeys(n: number = 7): string[] {
  const keys: string[] = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = subtractDays(today, i);
    keys.push(formatDateKey(d));
  }
  return keys;
}

/**
 * Get all dates in a month grid including leading blanks from the previous month
 */
export function getMonthCalendarGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Sunday = 0, Monday = 1, etc.
  const startDayOfWeek = firstDay.getDay(); 
  const totalDays = lastDay.getDate();

  const days: { date: Date; dateKey: string; isCurrentMonth: boolean }[] = [];

  // Pad previous month's trailing days
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const prevDate = new Date(year, month, -i);
    days.push({
      date: prevDate,
      dateKey: formatDateKey(prevDate),
      isCurrentMonth: false
    });
  }

  // Current month days
  for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
    const curDate = new Date(year, month, dayNum);
    days.push({
      date: curDate,
      dateKey: formatDateKey(curDate),
      isCurrentMonth: true
    });
  }

  // Pad next month days to complete 35 or 42 grid cells
  const remainingCells = (7 - (days.length % 7)) % 7;
  for (let i = 1; i <= remainingCells; i++) {
    const nextDate = new Date(year, month + 1, i);
    days.push({
      date: nextDate,
      dateKey: formatDateKey(nextDate),
      isCurrentMonth: false
    });
  }

  return days;
}
