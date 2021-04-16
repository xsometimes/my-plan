import { CommonItem } from './common';

type Content = string | undefined;

export interface WeeklyEntity extends CommonItem {
  createDate: string;
  plan: Content;
  pNote: Content;
  evaluation: Content;
  eNote: Content;
  cause: Content;
  caNote: Content;
  conclusion: Content;
  coNote: Content;
  nextGoals: Content;
  gNote: Content;
  remarks: Content;
  rNote: Content;
};
