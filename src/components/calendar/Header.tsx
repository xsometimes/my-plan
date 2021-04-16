import React, { useState, useEffect } from 'react';
import { useChange } from '../../utils/hooks/form';
import {getTodayInfo} from '../../utils/date';
import EventType from '../../common/eventType';
import { calendarMode } from '../../common/constant';

// @ts-ignore
const Bus = React.bus;
const { year: thisYear, month: thisMonth } = getTodayInfo();

/**
 * 年份选择
 * @param param0 { 当前年份 }
 * @returns 
 */
const YearSelect = React.memo(({ year }: { year: number }) => {

  const years: number[] = []
  for (let i = thisYear; i >= thisYear - 10; i--) {
    years.unshift(i);
  }

  const { value: yearSelected, setValue: setYear} = useChange(year);

  const handleChange = e => {
    setYear(e.target.value);
    Bus.emit(EventType.YEAR_CHANGE, {
      year: ~~e.target.value
    });
  }

  return (<select className="common-select" value={yearSelected} onChange={handleChange}>
    {
      years.map((year, index) => <option value={year} key={index}>{year}年</option>)
    }
  </select>)
})

/**
 * 月份选择
 * @param param0 { 当前月份 }
 * @returns 
 */
const MonthSelect = React.memo(({ month }: { month: number }) => {
  const months: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const { value: monthSelected, setValue: setMonth} = useChange(month);

  const handleChange = e => {
    setMonth(e.target.value);
    Bus.emit(EventType.MONTH_CHANGE, {
      month: ~~e.target.value
    });
  }

  return (<select className="common-select" value={monthSelected} onChange={handleChange}>
    {
      months.map((month, index) => <option key={index} value={month}>{month}月</option>)
    }
  </select>)
})

/**
 * 模式切换，年/月 视图的展开
 * @returns 
 */
const ModeSwitch = React.memo(({ initialMode }: { initialMode: string }) => {
  const [mode, setMode] = useState(initialMode)

  const handleClick = (m: string) => {
    setMode(m);
    Bus.emit(EventType.MODE_CHANGE, m);
  }

  return (<div className="mode-switch">
    <div className={`btn ${mode === calendarMode.MONTH ? 'active' : ''}`} onClick={() => handleClick(calendarMode.MONTH)}>月</div>
    <div className={`btn ${mode === calendarMode.YEAR ? 'active' : ''}`} onClick={() =>handleClick(calendarMode.YEAR)}>年</div>
  </div>)
})

function CalendarHeader () {

  const [flag, setFlag] = useState(true);

  const [conditions, setConditions] = useState({
    mode: calendarMode.MONTH,
    year: thisYear,
    month: thisMonth,
  })

  const changeConditions = (newCondition: object) => {
    const curConditions = { ...conditions, ...newCondition }
    setConditions(curConditions)
    Bus.emit(EventType.CONDITION_CHANGE, curConditions)
  }

  useEffect(() => {
    const toggleShowMonth = (mode: string) => {
      setFlag(mode === 'month');
      changeConditions({ mode })
    }

    Bus.on(EventType.MODE_CHANGE, toggleShowMonth);

    return () => {
      Bus.off(EventType.MODE_CHANGE, toggleShowMonth);
    }
  })

  useEffect(() => {
    Bus.on(EventType.MONTH_CHANGE, changeConditions);

    return () => {
      Bus.off(EventType.MONTH_CHANGE, changeConditions);
    }
  })

  useEffect(() => {
    Bus.on(EventType.YEAR_CHANGE, changeConditions);

    return () => {
      Bus.off(EventType.YEAR_CHANGE, changeConditions);
    }
  })


  return (<div className="calendar-header">
    <YearSelect year={conditions.year} />
    {flag && <MonthSelect month={conditions.month} />}
    <ModeSwitch initialMode={conditions.mode} />
  </div>)
}

export default CalendarHeader;
