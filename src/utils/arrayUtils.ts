/**
 * 去除数组中重复元素
 * @param arr 
 * @returns 
 */
export function dedupe<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

/**
 * 获取俩数组的关系
 * @param arr1 
 * @param arr2 
 * @returns - type: 0无关系、1交叉、2子集、3俩数组相等 
 */
export function getRelationShipBetweenArr (arr1: any[], arr2: any[]): number {
  let type = 0; // 无关系
  const newArr1 = dedupe(arr1);
  const newArr2 = dedupe(arr2);
  const unionArr = Array.from(new Set([...newArr1, ...newArr2]));
  const len1 = newArr1.length;
  const len2 = newArr2.length;
  const uLen = unionArr.length;
  if (len1 + len2 > uLen) {
    type = 1; // 交叉
    const maxLen = Math.max(len1, len2)
    if (maxLen === uLen) {
      type = 2; // 其中一个数组是另一个数组的子集
      if (len1 === len2) {
        type = 3; // 俩数组相等
      }
    }
  }
  return type;
}
