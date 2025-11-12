import { differenceInYears, format, formatISO, isValid, parse, parseISO, subYears } from 'date-fns';
import { formatInTimeZone, fromZonedTime, toZonedTime } from 'date-fns-tz';

/**
 * Default timezone for the application
 */
const DEFAULT_TIMEZONE = 'America/New_York';

/**
 * Format a date string for display (replaces the old formatDate function)
 * @param dateString - ISO date string or date string
 * @param pattern - Optional format pattern, defaults to 'MMMM d, yyyy'
 * @param timeZone - Optional timezone, defaults to UTC
 */
export function formatDate(
  dateString: string,
  pattern: string = 'MMMM d, yyyy',
  timeZone: string = 'UTC',
): string {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) {
      return 'Invalid Date';
    }

    if (timeZone === 'UTC') {
      return format(date, pattern);
    }

    return formatInTimeZone(date, timeZone, pattern);
  } catch {
    return 'Invalid Date';
  }
}

/**
 * Format a timestamp for email templates and notifications
 * @param timestamp - ISO timestamp string or Date object
 * @param timeZone - Timezone for display, defaults to America/New_York
 */
export function formatSubmittedDate(
  timestamp: string | Date,
  timeZone: string = DEFAULT_TIMEZONE,
): string {
  try {
    const date = typeof timestamp === 'string' ? parseISO(timestamp) : timestamp;

    if (!isValid(date)) {
      return 'Invalid Date';
    }

    return formatInTimeZone(date, timeZone, "MMMM d, yyyy 'at' h:mm a zzz");
  } catch {
    return 'Invalid Date';
  }
}

/**
 * Calculate age from date of birth
 * @param dateOfBirth - Date of birth as string (YYYY-MM-DD) or Date object
 * @param referenceDate - Optional reference date, defaults to today
 */
export function calculateAge(dateOfBirth: string | Date, referenceDate?: Date): number {
  try {
    const birthDate =
      typeof dateOfBirth === 'string' ? parse(dateOfBirth, 'yyyy-MM-dd', new Date()) : dateOfBirth;

    const refDate = referenceDate || new Date();

    if (!isValid(birthDate) || !isValid(refDate)) {
      return 0;
    }

    return differenceInYears(refDate, birthDate);
  } catch {
    return 0;
  }
}

/**
 * Validate if someone is at least a certain age
 * @param dateOfBirth - Date of birth as string (YYYY-MM-DD)
 * @param minimumAge - Minimum required age
 */
export function isValidAge(dateOfBirth: string, minimumAge: number = 18): boolean {
  try {
    const age = calculateAge(dateOfBirth);
    return age >= minimumAge;
  } catch {
    return false;
  }
}

/**
 * Get the maximum allowed date for date of birth input
 * @param minimumAge - Minimum age requirement
 */
export function getMaxBirthDate(minimumAge: number = 18): string {
  try {
    const maxDate = subYears(new Date(), minimumAge);
    return format(maxDate, 'yyyy-MM-dd');
  } catch {
    return format(subYears(new Date(), 18), 'yyyy-MM-dd');
  }
}

/**
 * Get today's date in YYYY-MM-DD format for input max values
 */
export function getTodayInputFormat(): string {
  try {
    return format(new Date(), 'yyyy-MM-dd');
  } catch {
    return format(new Date(), 'yyyy-MM-dd');
  }
}

/**
 * Create an ISO timestamp for database storage
 * @param date - Optional date, defaults to now
 */
export function createTimestamp(date?: Date): string {
  try {
    const targetDate = date || new Date();
    return formatISO(targetDate);
  } catch {
    return formatISO(new Date());
  }
}

/**
 * Format date for RSS feed
 * @param date - Date string or Date object
 */
export function formatRSSDate(date: string | Date): string {
  try {
    const targetDate = typeof date === 'string' ? parseISO(date) : date;

    if (!isValid(targetDate)) {
      return formatISO(new Date());
    }

    return formatISO(targetDate);
  } catch {
    return formatISO(new Date());
  }
}

/**
 * Convert a date to a specific timezone
 * @param date - Date to convert
 * @param timeZone - Target timezone
 */
export function convertToTimeZone(date: Date, timeZone: string = DEFAULT_TIMEZONE): Date {
  try {
    return toZonedTime(date, timeZone);
  } catch {
    return date;
  }
}

/**
 * Convert a zoned time to UTC
 * @param date - Date in specific timezone
 * @param timeZone - Source timezone
 */
export function convertToUTC(date: Date, timeZone: string = DEFAULT_TIMEZONE): Date {
  try {
    return fromZonedTime(date, timeZone);
  } catch {
    return date;
  }
}

/**
 * Format a date for display in a specific locale
 * @param date - Date to format
 * @param locale - Locale string, defaults to 'en-US'
 * @param options - Intl.DateTimeFormatOptions
 */
export function formatDateLocale(
  date: string | Date,
  locale: string = 'en-US',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  },
): string {
  try {
    const targetDate = typeof date === 'string' ? parseISO(date) : date;

    if (!isValid(targetDate)) {
      return 'Invalid Date';
    }

    return targetDate.toLocaleDateString(locale, options);
  } catch {
    return 'Invalid Date';
  }
}

/**
 * Check if a date string is in valid format for form inputs
 * @param dateString - Date string to validate
 * @param format - Expected format, defaults to 'yyyy-MM-dd'
 */
export function isValidDateString(
  dateString: string,
  formatString: string = 'yyyy-MM-dd',
): boolean {
  try {
    const parsedDate = parse(dateString, formatString, new Date());
    return isValid(parsedDate);
  } catch {
    return false;
  }
}
