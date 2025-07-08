// File: lib/date-helpers.js
import { getHours } from 'date-fns';

/**
 * Determines the current shift based on the current time.
 * @returns {'A' | 'B' | 'C'} The current shift letter.
 */
export const getCurrentShift = () => {
    const currentHour = getHours(new Date());
    if (currentHour >= 6 && currentHour < 14) return 'A'; // 6:00 AM to 1:59 PM
    if (currentHour >= 14 && currentHour < 22) return 'B'; // 2:00 PM to 9:59 PM
    return 'C'; // 10:00 PM to 5:59 AM
};