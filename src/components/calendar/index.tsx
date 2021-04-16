import React, { useEffect, useState } from 'react';
import CalendarHeader from './Header';
import CalendarPanel from './Panel';
import EventType from '../../common/eventType';
import { calendarInitialConfig } from '../../common/constant';
import './index.less';

// @ts-ignore
const Bus = React.bus;

function Calendar () {

  const [filter, setFilter] = useState(calendarInitialConfig())

  useEffect(() => {
    const handleChange = payload => {
      setFilter({...payload})
    }

    Bus.on(EventType.CONDITION_CHANGE, handleChange);

    return () => {
      Bus.off(EventType.CONDITION_CHANGE, handleChange)
    }
  }, [])

  return (<div className="calendar">
    <CalendarHeader />
    <CalendarPanel year={filter.year} month={filter.month} />
  </div>)
}

export default Calendar;
