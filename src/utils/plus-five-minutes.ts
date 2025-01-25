export function getDatePlusFiveMinutes(): Date {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 5);
  return now;
}
