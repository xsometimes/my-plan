import {getTodayInfo} from '../utils/date';

export const calendarMode = {
  YEAR: 'year',
  MONTH: 'month'
}

export const calendarInitialConfig = () => {
  const { year, month } = getTodayInfo();
  return {
    mode: calendarMode.MONTH,
    year,
    month
  }
}

// 格子类型：空心、实心
export const cellType = {
  EMPTY: 0,
  SOLID: 1
}

export const week = ['一', '二', '三', '四', '五', '六', '日'];
