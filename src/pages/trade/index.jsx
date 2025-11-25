import React from 'react';
import './index.css';

// 处理mypclist数据，按月份分组并生成交易记录格式
const formatTransactionData = (data, index) => {
  // 按月份分组
  const groupedData = {};
  
  data.forEach((item, index) => {
    // 提取年月（YYYY-MM）
    const month = item.date.slice(0, 7);
    // 格式化金额（添加千分位和"元"）
    const formattedAmount = item.count.toLocaleString('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + '元';
    
    // 生成交易记录项（默认按"购买"类型，可根据需求修改）
    const record = {
      type: '购买', // 可改为动态判断（如根据金额范围区分购买/赎回）
      productType: index <= 5 ? '季季宝' : '多月宝', // 可根据实际需求修改产品类型
      productName: index <= 5 ? '中邮理财灵活·鸿运最短持有120天3号' : '上行理财长期·金葵花长期持有365天1号', // 可根据实际需求修改产品名称
      amount: formattedAmount,
      date: item.date,
      extra: `份额为${(item.count / 1.02).toFixed(2)}份` // 模拟份额计算，可根据实际规则调整
    };
    
    // 按月份分组存储
    if (!groupedData[month]) {
      groupedData[month] = [];
    }
    groupedData[month].push(record);
  });
  
  // 转换为数组格式并按月份降序排序
  return Object.entries(groupedData)
    .map(([month, records]) => ({ month, records }))
    .sort((a, b) => new Date(b.month) - new Date(a.month));
};


const TransactionRecord = ({
    data,
    onBack
}) => {
  // 格式化后的交易数据
  const transactionData = formatTransactionData(data || []);

  return (
    <div className="transaction-page">
      {/* 顶部导航栏 */}
      <header className="transaction-header">
        <div className="back-button" onClick={onBack}>←</div>
        <h1 className="page-title">交易记录</h1>
        <div className="header-actions">
          {/* <span className="smile-icon">😊</span>
          <span className="notification-badge">47</span> */}
        </div>
      </header>

      {/* 筛选栏 */}
      {/* <div className="filter-bar">
        <span className="filter-item">全部类型 ▼</span>
        <span className="filter-item">全部状态 ▼</span>
        <span className="filter-item">近1年 ▼</span>
        <span className="filter-item">全部银行卡 ▼</span>
        <span className="search-icon">🔍</span>
      </div> */}

      {/* 交易记录列表 */}
      <div className="transaction-list">
        {transactionData.map((group, groupIndex) => (
          <div key={groupIndex} className="month-group">
            <div className="month-title">{group.month}</div>
            {group.records.map((record, recordIndex) => (
              <div key={recordIndex} className="transaction-item">
                {/* 交易类型（购买/赎回） */}
                <span 
                  className={`transaction-type ${record.type === '购买' ? 'type-buy' : 'type-redeem'}`}
                >
                  {record.type}
                </span>
                {/* 产品信息 */}
                <div className="product-info">
                  <div className="product-type">{record.productType}</div>
                  <div className="product-name">{record.productName}</div>
                </div>
                {/* 金额 */}
                <div className="transaction-amount">{record.amount}</div>
                {/* 日期和额外信息 */}
                <div className="transaction-meta">
                  <span className="transaction-date">{record.date}</span>
                  {record.extra && <span className="transaction-extra">{record.extra}</span>}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionRecord;