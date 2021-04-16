import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import EditGrid, { GridEmit } from '../../components/editGrid/index';
import { useIndexedDBStore } from '../../utils/hooks/useIndexeddb';
import { useDebounce } from '../../utils/hooks/debounce-throttle'; 
import EventType from '../../common/eventType';
import { WeeklyEntity } from '../../types/weeklyReport';
import './index.less';

// @ts-ignore
const Bus = React.bus

const gridCommonProps = {
  className: ['cell'],
  inputType: 'textArea'
}

const WeeklyReport: React.FC  = () => {

  const { getOneByIndex, add, update, deleteById } = useIndexedDBStore<WeeklyEntity>('weeklyReport');

  // 获取、处理日期
  const { date } = useParams<any>();
  const createDate = date.split('-').join('/');

  const [flag, setFlag] = useState(true); // 该周报是否新增

  // 空白周报数据
  const emptyReport = {
    id: '',
    plan: '',
    pNote: '',
    evaluation: '',
    eNote: '',
    cause: '',
    caNote: '',
    conclusion: '',
    coNote: '',
    nextGoals: '',
    gNote: '',
    remarks: '',
    rNote: '',
    createDate
  }

  // “引用”保存周报数据，不用于页面re-render，仅用于最后的保存
  const reportRef = useRef<WeeklyEntity>(emptyReport);

  // 设置初始周报数据
  const [initialReport, setInitialReport] = useState<WeeklyEntity>(emptyReport);
  useEffect(() => {
    getOneByIndex('createDate', createDate).then((res: WeeklyEntity | undefined) => {
      if (res) {
        setFlag(false);
        setInitialReport(res);
        reportRef.current = res;
      }
    })
  }, [])

  useEffect(() => {
    const handleChange = (payload: GridEmit) => {
      const { editId, value } = payload;
      reportRef.current[editId] = value
    }

    Bus.on(EventType.GRID_VALUE_CHANGE, handleChange)

    return () => {
      Bus.off(EventType.GRID_VALUE_CHANGE, handleChange)
    }
  }, [])

  // 保存，useDebounce禁止保存多次
  const handleSave = useDebounce(() => {
    if (flag) {
      reportRef.current.id = `${new Date().getTime()}`;
      add(reportRef.current)
    } else {
      update(reportRef.current)
    }
  }, 1000, [add, update])

  const handleClear = useDebounce(() => {
    setInitialReport(emptyReport);
    setFlag(true);
    const reportId = reportRef.current.id;
    console.log(reportId)
    reportId && deleteById(reportId);
    reportRef.current = emptyReport;
  }, 1000, [setFlag, setInitialReport, deleteById])

  return <div className="weekly-report myplan-container">
    <div className="weekly-report-container table-fixed">
      <div className="row table-row-header">
        <div className="cell table-col-header">项目</div>
        <div className="cell">内容</div>
        <div className="cell">备注</div>
      </div>
      <div className="row">
        <div className="cell table-col-header">回顾目标</div>
        <EditGrid initialVal={initialReport.plan} editId="plan" {...gridCommonProps} />
        <EditGrid initialVal={initialReport.pNote} editId="pNote" {...gridCommonProps} />
      </div>
      <div className="row">
        <div className="cell table-col-header">评估结果</div>
        <EditGrid initialVal={initialReport.evaluation} editId="evaluation" {...gridCommonProps} />
        <EditGrid initialVal={initialReport.eNote} editId="eNote" {...gridCommonProps} />
      </div>
      <div className="row">
        <div className="cell table-col-header">分析原因</div>
        <EditGrid initialVal={initialReport.cause} editId="cause" {...gridCommonProps} />
        <EditGrid initialVal={initialReport.caNote} editId="caNote" {...gridCommonProps} />
      </div>
      <div className="row">
        <div className="cell table-col-header">总结经验</div>
        <EditGrid initialVal={initialReport.conclusion} editId="conclusion" {...gridCommonProps} />
        <EditGrid initialVal={initialReport.coNote} editId="coNote" {...gridCommonProps} />
      </div>
      <div className="row">
        <div className="cell table-col-header">工作计划</div>
        <EditGrid initialVal={initialReport.nextGoals} editId="nextGoals" {...gridCommonProps} />
        <EditGrid initialVal={initialReport.gNote} editId="gNote" {...gridCommonProps} />
      </div>
      <div className="row">
        <div className="cell table-col-header">工作备注</div>
        <EditGrid initialVal={initialReport.remarks} editId="remarks" {...gridCommonProps} />
        <EditGrid initialVal={initialReport.rNote} editId="rNote" {...gridCommonProps} />
      </div>
    </div>

    <div className="weekly-report-footer">
    <div className="btn btn-common" onClick={handleClear}>清空</div>
      <div className="btn btn-common btn-primary" onClick={handleSave}>保存</div>
    </div>
  </div>
}

export default WeeklyReport;
