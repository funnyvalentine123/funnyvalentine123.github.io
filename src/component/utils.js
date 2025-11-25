export const calculateTotalCount = (data) => {
  // reduce 累加：初始值为 0，每次叠加当前项的 count
  return data.reduce((total, item) => total + item.count, 0);
};

export const formatAmount = (amount) => {
  // 1. 校验并转换输入为数字（处理字符串类型输入、无效值）
  const num = Number(amount);
  if (isNaN(num)) {
    console.warn('输入金额无效，返回默认值 "0.000"');
    return '0.000';
  }

  // 2. 格式化核心逻辑：千分位分隔 + 保留3位小数
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 3, // 最小保留3位小数
    maximumFractionDigits: 3, // 最大保留3位小数
    useGrouping: true // 启用千分位分隔
  });
};

export const splitArrayByLastN = (arr, n) => {
  // 校验输入：非数组返回两个空数组
  if (!Array.isArray(arr)) {
    console.warn('输入不是数组，返回空数组');
    return { frontArr: [], backArr: [] };
  }

  // 处理n的边界值：n≤0 → backArr为空，frontArr为原数组；n≥数组长度 → backArr为原数组，frontArr为空
  const validN = Math.max(0, Math.min(n, arr.length));
  
  // 拆分逻辑：slice(-validN) 取后n个元素，slice(0, -validN) 取前面剩余元素
  const backArr = arr.slice(-validN);
  const frontArr = arr.slice(0, arr.length - validN); // 等价于 arr.slice(0, -validN)（n=0时slice(0,0)返回空）

  return { frontArr, backArr };
};

/**
 * 计算指定期间内的累计日收益和相关数据
 * @param {number} totalInvest - 总投资金额（元）
 * @param {string} startDateStr - 开始日期（格式：YYYY-MM-DD）
 * @param {string} [currentDateStr] - 当前日期（格式：YYYY-MM-DD，默认取系统当前日期）
 * @param {boolean} [includeToday=true] - 是否计入当前日期（未到自然日结束时可设为false）
 * @returns {Object} - 包含累计收益、工作日天数、日收益、实际年化等信息
 */
export const calculateProfit = (
  totalInvest,
  startDateStr,
  currentDateStr = new Date().toISOString().split('T')[0],
  includeToday = true
) => {
  // 基准年化利率（0.438%）
  const annualRate = 0.0438;
  // 日利率 = 年化利率 ÷ 365
  const dailyRate = annualRate / 365;

  // 格式化日期为 Date 对象
  const startDate = new Date(startDateStr);
  const currentDate = new Date(currentDateStr);

  // 校验日期有效性
  if (isNaN(startDate.getTime()) || isNaN(currentDate.getTime())) {
    throw new Error('日期格式错误，请传入 YYYY-MM-DD 格式的日期');
  }

  // 若开始日期晚于当前日期，返回0收益
  if (startDate > currentDate) {
    return {
      totalProfit: 0, // 累计收益（元）
      workingDays: 0, // 期间工作日天数
      dailyProfit: 0, // 单日收益（元）
      actualAnnualRate: 0, // 实际年化收益率（%）
    };
  }

  // 处理是否计入当前日期（若未到自然日结束，可排除当日）
  const endDate = new Date(currentDate);
  if (!includeToday) {
    endDate.setDate(endDate.getDate() - 1);
  }

  // 计算期间内的工作日天数
  let workingDays = 0;
  let tempDate = new Date(startDate);

  while (tempDate <= endDate) {
    const dayOfWeek = tempDate.getDay();
    // 排除周末（0=周日，6=周六）
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      workingDays++;
    }
    // 日期加1天
    tempDate.setDate(tempDate.getDate() + 1);
  }

  // 计算单日收益（保留4位小数，避免精度丢失）
  const dailyProfit = Math.round(totalInvest * dailyRate * 10000) / 10000;
  // 计算累计收益（保留2位小数，符合金额显示规范）
  const totalProfit = Math.round(dailyProfit * workingDays * 100) / 100;

  // 计算实际年化收益率（基于累计收益和投资天数，保留4位小数）
  const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1; // 总天数（含首尾）
  const actualAnnualRate = totalDays > 0 
    ? Math.round((totalProfit / totalInvest / (totalDays / 365)) * 10000) / 100 
    : 0;

  return {
    totalProfit, // 累计收益（元）
    workingDays, // 期间工作日天数
    dailyProfit, // 单日收益（元）
    actualAnnualRate, // 实际年化收益率（%）
    startDate: startDateStr,
    endDate: endDate.toISOString().split('T')[0],
  };
};