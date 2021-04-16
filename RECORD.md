# 开发问题记录
1. eventEmitter的缺陷：

可能存在多个组件正在监听`Bus.on`同个事件，如在父组件中监听到列表中每个子组件的事件，这时候需要判断具体是哪个子组件，可通过id鉴别。

对eventBus的选择，我是受到之前项目采用责任链设计模式的偏好影响，加之本项目比较简单。

2. 使用div[contentEditable=true]的注意事项：光标容易错位。

针对这个问题，应该避免减少组件的re-render。

在本项目中，editGrid同时支持edit和view的功能，没有将这两者分页面处理，所以我只赋予div初始值（即，非受控组件），将用户每次输入改变的值emit到父组件中，useRef保存，这样就不会触发re-render了。

```ts
// 父组件TodoItem
const Bus = React.bus

const TodoItem = React.memo((props: TodoEntity) => {

  const { id, content, checked: initialChecked } = props;

  const todoRef = useRef(props)

  useEffect(() => {
    const handleValueChange = payload => {
      const { value, editId } = payload
      if (editId === id) {
        // doSth()
        todoRef.current = {
          ...todoRef.current,
          content: value,
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

  return <div className="todo-item">
    <EditGrid initialVal={content} editId={id} />
  </div>
})

export default TodoItem;
```


```ts
// 子组件EditGrid
const Bus = React.bus

const EditGrid: React.FC<GridProps> = props => {
  let { initialVal='', isLocked=false, editId='' } = props;

  const handleInput = useCallback<React.ChangeEventHandler<HTMLInputElement>>(e => {
    Bus.emit(EventType.GRID_VALUE_CHANGE, {
      value: e.target.innerText,
      editId
    })
  }, [editId])
  
  return <div
    className="grid"
    contentEditable={!isLocked}
    dangerouslySetInnerHTML={{__html: initialVal}}
    onInput={handleInput}
    onBlur={submit}
    ></div>
}

export default EditGrid;
```












## 参考文档
- [react 路由鉴权](https://juejin.cn/post/6844903924441284615)
- [使用 React Hooks 结合 EventEmitter](https://segmentfault.com/a/1190000023469546)
- [TypeScript 在 React 中干货分享](https://juejin.cn/post/6874831839224299528)
- [display:table布局总结](https://www.cnblogs.com/mengff/p/7711662.html)

