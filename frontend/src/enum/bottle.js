/**
 * 酒瓶状态
 * @description Sealed-0: 未开瓶 Opened-1: 已开瓶
 */
export const BOTTLE_STATUS = {
  0: "Sealed",
  1: "Opened",
};

/**
 * 酒瓶是否离开仓库
 * @description In Warehouse-0: 未离开 Taken-1: 已离开
 */
export const BOTTLE_WITHDRAW = {
  0: "In Warehouse",
  1: "Taken",
};

/**
 * 酒瓶交易状态
 * @description Normal-0: 正常 On Transaction-1: 交易中
 */
export const BOTTLE_ON_TRANSACTION = {
  0: "Normal",
  1: "On Transaction",
};
