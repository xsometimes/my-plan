export type Identifier = number | string;

export interface CommonItem {
  id: Identifier;
  isLock?: boolean; // 是否被锁定，不给操作
}

