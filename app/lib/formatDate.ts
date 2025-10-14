import { formatDate as formatDateUtil } from '~/utils/dateUtils';

export function formatDate(dateString: string) {
  // Use the new date-fns implementation while maintaining the same API
  return formatDateUtil(dateString, 'MMMM d, yyyy', 'UTC');
}
