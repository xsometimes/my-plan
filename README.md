
# My-Plan

一个关于个人计划、记事、复盘的网页端程序。

## 功能设计
- 日历表
  - ~~月视图~~
  - todo???：年视图
- ~~日todolist~~
- ~~周报复盘~~
- todo???：月总结（A本月最关键的事B学习计划C旅行计划D健康剑圣计划E理财计划）
- todo???：任务进度记录

## 技术选型
在create-react-app单页面的基础上，选择了：
- react hooks实践；
- 事件处理：用发布订阅模式event bus（eventEmitter）代替 props传给子组件的回调；
- 数据存储：context+indexedDB结合，将数据储存在浏览器端；
- 主要组件：
  - editGrid：div[contentEditable=true]代替传统的input、textarea

