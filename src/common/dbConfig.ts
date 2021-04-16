import { IndexedDBConfig } from '../utils/hooks/useIndexeddb/type';

const databaseName = 'myplan';

export default class IDBConfig {
  static todo: IndexedDBConfig = {
    stores: [
      {
        name: 'todo', 
        id: { keyPath: 'id', autoIncrement: true },
        indices: [
          { name: 'content', keyPath: 'content', options: { unique: false } },
          { name: 'checked', keyPath: 'checked' },
          { name: 'updateDate', keyPath: 'updateDate' }, // todo：后面作为指标，计算todo延时完成的天数
          { name: 'createDate', keyPath: 'createDate' },
          { name: 'updateTime', keyPath: 'updateTime' } // 作为排序时间
        ]
      }
    ],
    databaseName
  }
  static weeklyReport: IndexedDBConfig = {
    stores: [
      {
        name: 'weeklyReport',
        id: { keyPath: 'id', autoIncrement: true },
        indices: [
          { name: 'plan', keyPath: 'plan' }, // 回顾目标
          { name: 'pNote', keyPath: 'pNote' },
          { name: 'evaluation', keyPath: 'evaluation' }, // 结果评估
          { name: 'eNote', keyPath: 'eNote' },
          { name: 'cause', keyPath: 'cause' }, // 分析原因
          { name: 'caNote', keyPath: 'caNote' },
          { name: 'conclusion', keyPath: 'conclusion' }, // 总结经验
          { name: 'coNote', keyPath: 'coNote' },
          { name: 'nextGoals', keyPath: 'nextGoals' }, // 工作计划
          { name: 'gNote', keyPath: 'gNote' },
          { name: 'remarks', keyPath: 'remarks' }, // 工作备注
          { name: 'createDate', keyPath: 'createDate', options: { unique: true } }
        ]
      }
    ],
    databaseName
  }
}