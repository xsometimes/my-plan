import React, { useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TodoItem from './todoItem';
import { useIndexedDBStore } from '../../utils/hooks/useIndexeddb';
import { getTodayInfo } from '../../utils/date';
import { useChange } from '../../utils/hooks/form';
import { useSyncState } from '../../utils/hooks/lifetime';
import EventType from '../../common/eventType';
import { Identifier } from '../../types/common';
import { TodoEntity } from '../../types/todolist';
import './index.less';

// @ts-ignore
const Bus = React.bus

type ITodoList = TodoEntity[];

const TodoList: React.FC = () => {

  // 获取、处理日期
  const { date } = useParams<any>()
  const createDate = date.split('-').join('/')

  // indexedDB数据库方法
  const { add, update, getManyByIndex, deleteById } = useIndexedDBStore<TodoEntity>('todo')

  const contentNewAdd = useChange('');

  const [getList, setList] = useSyncState<ITodoList>([])

  // conponentDidMount 获取当天的todolist
  useEffect(() => {
    getManyByIndex('createDate', createDate).then(res => {
      setList(res)
    })
  }, [])

  // 新增todo、防抖
  const handleKeyUp = useCallback((e: any) => {
    if (!!contentNewAdd && !!(contentNewAdd.value as any).trim() && e.keyCode === 13) {
      const { today, timeStamp } = getTodayInfo()
      const obj = {
        id: `${new Date().getTime()}`,
        content: `${contentNewAdd.value}`,
        checked: false,
        updateDate: today,
        updateTime: timeStamp,
        createDate
      }
      setList([obj, ...getList()])
      add(obj)
      contentNewAdd.setValue('') // 此处除了清除输入框的功能，还有，刷新页面的功能
    }
  }, [contentNewAdd, add])

  // 删除todo
  useEffect(() => {
    const handleItemDel = (todoId: Identifier) => {
      setList(getList().filter(item => item.id !== todoId))
      deleteById(todoId)
    }

    Bus.on(EventType.TODO_ITEM_DELETE, handleItemDel)

    return () => {
      Bus.off(EventType.TODO_ITEM_DELETE, handleItemDel)
    }
  }, [])

  // 改变todo的status、content
  useEffect(() => {
    const handleChange = (payload: any) => {
      update(payload)
    }

    Bus.on(EventType.TODO_ITEM_CHANGE, handleChange)

    return () => {
      Bus.off(EventType.TODO_ITEM_CHANGE, handleChange)
    }
  }, [update])

  return <div className="todo">
    <div className="myplan-container">
        <header className="todo-header">
          <div>TODOLIST</div>
          <input placeholder="Enter new todo"
            onKeyUp={handleKeyUp}
            {...contentNewAdd.bindEvent} />
        </header>
        <main>
          
          <div className="todo-list">
            {
              getList().map((item, index) => <TodoItem {...item} key={item.id} />)
            }
          </div>
        </main>
    </div>
  </div>
}

export default TodoList;
