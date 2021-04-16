import React, { useCallback } from 'react';
import EventType from '../../common/eventType';
import { Identifier } from '../../types/common';
import './index.less';

interface GridProps {
  initialVal?: string | undefined; // 初始值
  isLocked?: boolean; // 是否锁定
  editId?: Identifier; // 唯一性
  status?: boolean; // 用以加删除线
  inputType?: string; // 类input的type类型：text、textarea
  className?: string[]; // 类名
}

export interface GridEmit {
  value: Identifier | undefined;
  editId: Identifier;
}

// @ts-ignore
const Bus = React.bus

const EditGrid: React.FC<GridProps> = props => {
  let { initialVal='', isLocked=false, editId='', status=false, inputType='text', className=[] } = props;

  const submit = () => {
    // 待增加功能
  }

  const handleInput = useCallback<React.ChangeEventHandler<HTMLInputElement>>(e => {
    Bus.emit(EventType.GRID_VALUE_CHANGE, {
      value: e.target.innerText,
      editId
    })
  }, [editId])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (inputType === 'text' && e.code === 'Enter') {
      e.preventDefault()
    }
  }
  
  // @ts-ignore
  return <div
    className={`grid ${className.join(' ')} ${status ? 'grid-line-through' : ''}`}
    contentEditable={!isLocked}
    dangerouslySetInnerHTML={{__html: initialVal}}
    onInput={handleInput}
    onBlur={submit}
    onKeyDown={e => handleKeyDown(e)}
    ></div>
}

export default EditGrid;

/**
 * - 传值、存值(防抖向上传值)
 * - 可供操作：删除，编辑
 * - 状态：是否可编辑
 */