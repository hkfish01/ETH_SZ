import {BOTTLE_STATUS} from "@/enum/bottle";

/**
 * 返回酒瓶状态
 * @param bottleStatus 从后端获取的酒瓶状态
 * @param {string|null} bottleType 酒瓶标签类型
 * @param {string|null} bottleData 酒瓶标签条码
 * @returns {string|undefined}
 */
export const returnBottleStatusStr = (bottleStatus, bottleType, bottleData) => {
  /**
   * 通过 bottleType 和 bottleData 的长度区分标签
   * bottleType = b：新标签。使用新规则判断
   * bottleType !== b && bottleData.length > 105：老标签。使用老规则判断
   * 其它：无效标签
   */
  if (!bottleData || typeof bottleData !== "string") {
    return BOTTLE_STATUS[bottleStatus];
  }

  if (bottleType && typeof bottleType === "string") {
    if (bottleType.toLowerCase() === "b") {
      const tagStatus = bottleData.substring(bottleData.length - 7, bottleData.length - 6);
      if (tagStatus.toLowerCase() === "x") {
        return BOTTLE_STATUS[0];
      } else if (tagStatus.toLowerCase() === "y") {
        return BOTTLE_STATUS[1];
      }
    } else if (bottleType.toLowerCase() === 'c') {
      const tagStatus = bottleData.substring(bottleData.length - 8);
      if (tagStatus === '00000000') {
        return BOTTLE_STATUS[0]
      } else if (tagStatus === '01010101') {
        return BOTTLE_STATUS[1]
      }
    }
  } else if (bottleData.length > 105) {
    if (bottleData.substring(83, 91) === "00000000") {
      return BOTTLE_STATUS[0];
    } else {
      return BOTTLE_STATUS[1];
    }
  }
};
