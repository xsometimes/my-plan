export interface UserInfo {
  account: string;
  password?: string;
  token?: string;
  admin: boolean; // 是否超级管理员
  dataServiceAdmin: boolean; // 是否数据服务管理员
  themeAdmin: boolean; // 是否主题管理员
}
