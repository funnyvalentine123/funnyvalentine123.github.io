import { useState, useEffect } from 'react';
import './index.css';
import { useToast } from '../../component/toast';
import { calculateTotalCount, formatAmount, splitArrayByLastN } from '../../component/utils';

const newsList = [
  '【增值优选理财】三个月后到期产品收益均达基准',
  '【重要公告】建设银行关于调整部分个人存款产品利率的公告（2026年第5号）',
  '【理财月报】多宝理财系列产品累计服务客户突破50万户',
  '【市场解读】央行今日开展1500亿元逆回购操作，利率维持不变',
  '【积分兑换】即日起至6月30日，理财积分可兑换话费及商超卡',
  '【风险提示】谨防以"高收益理财"为名的非法集资活动',
];

const FinancePage = ({
    data,
    goto,
    totalProfit,
    isPro = false
}) => {
  const { showToast } = useToast();
  const [newsIndex, setNewsIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setNewsIndex(prev => (prev + 1) % newsList.length);
        setFade(true);
      }, 300);
    }, 4000);
    return () => clearInterval(timer);
  }, []);
  const total = formatAmount(calculateTotalCount(data) + totalProfit)
  const dyb = formatAmount(calculateTotalCount(splitArrayByLastN(data, 6).backArr))
  const nnb = formatAmount(calculateTotalCount(splitArrayByLastN(data, 6).frontArr))
  return (
    <div className="finance-page">
      {/* 顶部红色背景（用于实现沉浸效果） */}
      <div className="top-red-bg"></div>
      
      {/* 顶部导航栏 */}
      <header className="finance-header">
        {/* <div className="back-button">←</div> */}
        <h1 className="page-title">金向阳花理财</h1>
        <div className="header-actions">
          {/* <span className="smile-icon">😊</span>
          <span className="notification-badge">47</span> */}
        </div>
      </header>

      {/* 资产总览区域（带半透明模糊效果） */}
      <div className="balance-card">
        <div className="card-filter">全部资产总揽</div>
        <div className="total-balance">{
          total
        }</div>
        <div className="balance-label">总金额(元)</div>
      </div>

      {/* 功能按钮区域 */}
      <div className="function-buttons">
        <div className="function-btn" onClick={() => {goto('mydt')}}>
          <div className="btn-icon">📅</div>
          <div className="btn-text">我的定投</div>
        </div>
        <div className="function-btn" onClick={() => {goto('traderecord')}}>
          <div className="btn-icon">🔄</div>
          <div className="btn-text">交易记录</div>
        </div>
        <div className="function-btn" onClick={() => {goto('profit')}}>
          <div className="btn-icon">📊</div>
          <div className="btn-text">收益明细</div>
        </div>
        <div className="function-btn" onClick={() => {goto('products')}}>
          <div className="btn-icon">...</div>
          <div className="btn-text">其他</div>
        </div>
      </div>

      {/* 推广信息 - 滚动新闻 */}
      <div className="promotion-card">
        <span className="tag">巡礼</span>
        <span className={`promo-text ${fade ? 'fade-in' : 'fade-out'}`} key={newsIndex}>{newsList[newsIndex]}</span>
      </div>

      {/* 持仓列表 */}
      <div className="holdings-section">
        <div className="holdings-header">
          <span>我的持仓</span>
          {/* <span className="expand-icon">⌄</span> */}
        </div>
        
        <div className="product-group">
          <div className="group-title">多宝理财  No. v323980</div>
          
          {!isPro && <div className="product-item" onClick={() => {
            showToast({ message: '该产品赎回入口还有137天开放,详情请咨询柜台' });
          }}>
            <div className="product-name">年年宝</div>
            <div className="product-details">
              <div className="holding-amount">{nnb}</div>
              <div className="holding-profit">{formatAmount(totalProfit * 2/3)}</div>
              <div className="redeem-status">半年后可申赎</div>
            </div>
            <div className="detail-labels">
              <span>持仓金额</span>
              <span>持仓收益</span>
              <span></span>
            </div>
          </div>}
          
          <div className="product-item" onClick={() => {
            showToast({ message: '该产品赎回入口还有129天开放,详情请咨询柜台' });
          }}>
            <div className="product-name">多月宝</div>
            <div className="product-details">
              <div className="holding-amount">{dyb}</div>
              <div className="holding-profit">{formatAmount(totalProfit * 1/3)}</div>
              <div className="redeem-status">4个月可申赎</div>
            </div>
            <div className="detail-labels">
              <span>持仓金额</span>
              <span>持仓收益</span>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      {/* 底部导航 */}
      <nav className="bottom-nav">
        <div className="nav-item" onClick={() => {goto('products')}}>
          <div className="nav-icon">📦</div>
          <div className="nav-text">产品</div>
        </div>
        <div className="nav-item active">
          <div className="nav-icon">💰</div>
          <div className="nav-text">持仓</div>
        </div>
      </nav>
    </div>
  );
};

export default FinancePage;