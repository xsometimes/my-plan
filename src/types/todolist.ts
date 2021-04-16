import { CommonItem } from './common';

export interface TodoEntity extends CommonItem {
  content: string;
  checked: boolean;
  // order: number;
  createDate: string;
  updateDate?: string;
  updateTime?: number;
}
