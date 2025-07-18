import { DateTime } from 'luxon';

const timeZone = 'Asia/Kolkata';

/**
 * Gets the current shift letter (A, B, or C) based on the current time in IST.
 */
export const getCurrentShift = () => {
  const nowInIST = DateTime.now().setZone(timeZone);
  const currentHour = nowInIST.hour;

  if (currentHour >= 6 && currentHour < 14) return 'A'; // 6:00 AM to 1:59 PM IST
  if (currentHour >= 14 && currentHour < 22) return 'B'; // 2:00 PM to 9:59 PM IST
  return 'C'; // 10:00 PM to 5:59 AM IST
};