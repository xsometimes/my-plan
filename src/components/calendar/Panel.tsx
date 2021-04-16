import React from 'react';
import { useHistory } from 'react-router-dom';
import { getDay, getDaysOfMonth, getTodayInfo } from '../../utils/date';
import { cellType, week } from '../../common/constant';

// 今天信息
const {  year: thisYear, month: thisMonth, date: today } = getTodayInfo();

/**
 * 生成跳转路径：若为周日，跳转至“周报”，否则跳转至todoList
 * @param year 
 * @param month 
 * @param date 
 * @returns 跳转路径
 */
const generateUrl = (year: number, month: number, date: number): string => {
  const day = getDay(year, month, date);
  return day === 0 ? `./weeklyReport/${year}-${month}-${date}` : `./todoList/${year}-${month}-${date}`
}

const Panel = React.memo(({ year, month }: { year: number, month: number }) => {

  const day = getDay(year, month, 1); // 获取该年该月第一天是周几

  // 首空心格子
  const emptyCells = day !== 0 ? day - 1 : 6;
  const emptyCellsArr = new Array(emptyCells);
  emptyCellsArr.fill(cellType.EMPTY);

  // 当月多少天的格子
  const solidCells = getDaysOfMonth(year, month);
  const solidCellsArr = new Array(solidCells);
  solidCellsArr.fill(cellType.SOLID);

  const history = useHistory()
  function handleJump (url: string) {
    history.push(url)
  }

  return (<div className="calendar-panel">
    { week.map((wItem, wIdx) => (<div className="cell cell-week" key={wIdx}>{wItem}</div>)) }
    { emptyCellsArr.map((eItem, eIdx) => (<div className="cell cell-empty" key={8 + eIdx}></div>)) }
    { solidCellsArr.map((sItem, sIdx) => (<div
        className={`cell cell-date ${year === thisYear && month === thisMonth && (sIdx + 1) === today ? 'blink' : ''}`} 
        key={7 + emptyCells + 1 + sIdx}
        onClick={() => { handleJump(generateUrl(year, month, sIdx+1)) }}>{sIdx + 1}</div>)) }
  </div>)
})

export default Panel;
