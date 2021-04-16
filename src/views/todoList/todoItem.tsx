import React, { useCallback, useEffect, useRef } from 'react';
import EditGrid from '../../components/editGrid/index';
import { useCheck } from '../../utils/hooks/form';
import { getTodayInfo } from '../../utils/date';
import EventType from '../../common/eventType';
import { TodoEntity } from '../../types/todolist';

// @ts-ignore
const Bus = React.bus

const TodoItem = React.memo((props: TodoEntity) => {

  const { id, content, checked: initialChecked } = props;

  const { checked: statusChecked, onChange: onStatusChange } = useCheck({
    id,
    initialChecked
  })

  const todoRef = useRef(props)

  const handleBtnClick = useCallback(() => {
    Bus.emit(EventType.TODO_ITEM_DELETE, id)
  }, [id])

  useEffect(() => {
    const handleValueChange = payload => {
      const { value, editId } = payload
      if (editId === id) {
        const { today, timeStamp } = getTodayInfo()
        todoRef.current = {
          ...todoRef.current,
          content: value,
          updateDate: today,
          updateTime: timeStamp,
          id
        }
        Bus.emit(EventType.TODO_ITEM_CHANGE, todoRef.current)
      }
    }

    Bus.on(EventType.GRID_VALUE_CHANGE, handleValueChange)

    return () => {
      Bus.off(EventType.GRID_VALUE_CHANGE, handleValueChange)
    }
  })

  useEffect(() => {
    const handleStatusChange = payload => {
      if (payload.id === id) {
        const { checked } = payload
        const { today, timeStamp } = getTodayInfo()
        todoRef.current = {
          ...todoRef.current,
          updateDate: today,
          updateTime: timeStamp,
          checked,
          id
        }
        Bus.emit(EventType.TODO_ITEM_CHANGE, todoRef.current)
      }
    }

    Bus.on(EventType.CHECKBOX_CHANGE, handleStatusChange)

    return () => {
      Bus.off(EventType.CHECKBOX_CHANGE, handleStatusChange)
    }
  })

  return <div className="todo-item">
    <input type="checkbox" checked={statusChecked} onChange={onStatusChange} className="mr20" />
    <EditGrid initialVal={content} editId={id} status={statusChecked} />
    <i className="fa fa-trash btn ml20" aria-hidden="true" onClick={handleBtnClick}></i>
  </div>
})

export default TodoItem;
