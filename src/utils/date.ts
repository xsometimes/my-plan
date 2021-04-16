/**
 * 获取当月的天数
 * @param year 
 * @param month 
 * @returns number 天数
 */
export function getDaysOfMonth(year: number, month: number) {
  const d = new Date(year, month, 0);
  return d.getDate()
}

/**
 * 获取某一天是周几
 * @param year 
 * @param month 
 * @param date 
 * @returns number 周几
 */
export function getDay(year: number, month: number, date: number) {
  const d = new Date(`${year}-${month}-${date}`);
  return d.getDay()
}

export function getTodayInfo() {
  const d = new Date();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  const date = d.getDate();

  const daysOfThisMonth = getDaysOfMonth(year, month)

  return {
    year, // 年份
    month, // 月份
    date, // 几号
    daysOfThisMonth, // 这个月几天
    today: d.toLocaleDateString(), // 几年几月几日
    day: d.getDay(), // 周几
    timeStamp: d.getTime() // 时间戳
  }
}
