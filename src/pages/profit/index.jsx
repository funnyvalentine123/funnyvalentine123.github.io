import React, { useState, useEffect } from 'react';
import './index.css';
import { useToast } from '../../component/toast'; // 引入之前封装的Toast组件

const calculateTotalCount = (data) => {
  // reduce 累加：初始值为 0，每次叠加当前项的 count
  return data.reduce((total, item) => total + item.count, 0);
};

const ProfitDetail = ({
  data,
  onBack,
  totalProfit: _totalProfit
}) => {
  const { showToast } = useToast();
  const [profitList, setProfitList] = useState([]);
  const [totalProfit, setTotalProfit] = useState(0); // 总收益
  const [loading, setLoading] = useState(true);

  // 配置参数
  const config = {
    initialDate: '2025-08-30', // 初始日期
    totalInvest: calculateTotalCount(data), // 总投资金额（元）
    annualRate: 0.0428, // 年化利率4%
    maxDays: 100, // 最多显示100天
    updateTime: '23:00', // 每日更新时间
  };

  // 生成每日收益数据
  const generateProfitData = () => {
    const startDate = new Date(config.initialDate);
    const endDate = new Date(); // 当前日期
    const today = new Date();
    
    // 若当前时间未到23点，不包含今日数据
    if (today.getHours() < 23) {
      endDate.setDate(endDate.getDate() - 1);
    }

    const profitData = [];
    let currentDate = new Date(startDate);

    // 计算日利率（年化4% ÷ 365）
    const dailyRate = config.annualRate / 365;
    // 每日收益基准值（总投资 × 日利率）
    const baseProfit = config.totalInvest * dailyRate;

    while (currentDate <= endDate && profitData.length < config.maxDays) {
      // 排除周末（0=周日，6=周六）
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        // 随机波动：-30% 到 +50% 之间
        const fluctuation = 0.7 + (Math.random() - 0.7) * 2 * 0.8; // 0.7~1.5
        let dailyProfit = baseProfit * fluctuation;
        dailyProfit = Math.round(dailyProfit * 100) / 100; // 保留两位小数

        // 格式化日期为 YYYY-MM-DD
        const formattedDate = currentDate.toISOString().split('T')[0];

        profitData.push({
          date: formattedDate,
          profit: dailyProfit,
          profitClass: dailyProfit >= 0 ? 'profit-positive' : 'profit-negative',
        });
      }

      // 日期加1天
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // 按日期降序排列（最新在前）
    profitData.reverse();

    // 计算总收益
    const total = profitData.reduce((sum, item) => sum + item.profit, 0);
    setTotalProfit(Math.round(total * 100) / 100);
    setProfitList(profitData);
    setLoading(false);
  };

  useEffect(() => {
    generateProfitData();
    showToast({
      message: '收益数据已更新',
      type: 'success',
      duration: 2000,
    });
  }, []);

  // 格式化日期显示（添加星期）
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const weekDay = weekDays[date.getDay()];
    return `${dateStr} ${weekDay}`;
  };

  if (loading) {
    return (
      <div className="profit-page loading">
        <div className="loading-content">加载中...</div>
      </div>
    );
  }

  return (
    <div className="profit-page">
      {/* 顶部导航栏 */}
      <header className="profit-header">
        <div className="back-button" style={{
          color: '#fff'
        }} onClick={onBack}>←</div>
        <h1 className="page-title">每日收益明细</h1>
        <div className="header-actions">
          {/* <span className="refresh-icon" onClick={() => {
            setLoading(true);
            setTimeout(generateProfitData, 500); // 模拟刷新
          }}>🔄</span> */}
        </div>
      </header>

      {/* 收益概览卡片 */}
      <div className="profit-overview">
        <div className="overview-item">
          <div className="overview-label">总投资金额</div>
          <div className="overview-value">
            {config.totalInvest.toLocaleString('zh-CN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })} 元
          </div>
        </div>
        <div className="overview-item">
          <div className="overview-label">累计收益</div>
          <div className={`overview-value ${totalProfit >= 0 ? 'profit-positive' : 'profit-negative'}`}>
            {totalProfit >= 0 ? '+' : ''}{_totalProfit.toLocaleString('zh-CN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })} 元
          </div>
        </div>
        <div className="overview-item">
          <div className="overview-label">参考年化利率</div>
          <div className="overview-value">
            {(config.annualRate * 100).toFixed(2)}%
          </div>
        </div>
      </div>

      {/* 说明文字 */}
      <div className="profit-note">
        注：收益按年化为预估收益率，请以实际为准,仅工作日产生收益，每日23:00更新当日收益, 仅展示最近100天的收益数据.
      </div>

      {/* 收益列表 */}
      <div className="profit-list">
        {profitList.length > 0 ? (
          profitList.map((item, index) => (
            <div key={index} className="profit-item">
              <div className="profit-date">{formatDate(item.date)}</div>
              <div className={`profit-amount ${item.profitClass}`}>
                {item.profit >= 0 ? '+' : ''}{item.profit.toLocaleString('zh-CN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} 元
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">暂无收益数据</div>
        )}
      </div>
    </div>
  );
};

export default ProfitDetail;