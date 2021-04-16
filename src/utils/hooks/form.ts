import React,  { useState, useCallback, useRef } from 'react';
import { Identifier } from '../../types/common';
import EventType from '../../common/eventType';

// @ts-ignore
const Bus = React.bus

interface InputProps {
  id: Identifier;
  initialValue?: Identifier | undefined;
}

interface InputCheckProps extends InputProps {
  initialChecked: boolean;
  name?: string | undefined;
}

/**
 * 简化表单onChange双向绑定
 * @param initial 初始值
 */
export function useChange<S>(initial?: S | (() => S)) {
  const [value, setValue] = useState<S | undefined>(initial)
  const onChange = useCallback(e => setValue(e.target.value), [])
  return {
    value,
    setValue,
    onChange,
    // 绑定到原生事件
    bindEvent: {
      onChange,
      value
    }
  }
}

export function useCheck({
  id = `${new Date().getTime()}`,
  initialValue = '',
  initialChecked = false,
  name = ''
}: InputCheckProps) {

  const [, setChecked] = useState(initialChecked)
  const checkedRef = useRef(initialChecked)

  const onChange = useCallback(e => {
    setChecked(() => e.target.checked)
    checkedRef.current = e.target.checked
    Bus.emit(EventType.CHECKBOX_CHANGE, {
      id,
      checked: checkedRef.current
    })
  }, [id])

  return {
    name,
    onChange,
    checked: checkedRef.current,
    value: initialValue,
    bindEvent: {
      name,
      onChange,
      checked: checkedRef.current,
      value: initialValue
    }
  }
}
