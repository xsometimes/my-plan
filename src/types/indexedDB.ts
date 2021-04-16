import { Identifier } from './common';

// store表的index列名
export interface ColumnConfig {
  id?: Identifier;
  name: string; // 表中对象的索引名
  keyPath: string; // 表中的键路径
  config: any; // 可配置选项
}

export type DBQueryRowResponse = object | object[] | undefined | null;

export interface DBOpenProps {
  target: IDBOpenDBRequest;
  [propsName: string]: any;
}