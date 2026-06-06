import { useState } from 'react';
import { useToast } from '../../component/toast';
import './index.css';

const products = [
  {
    id: 1,
    name: '年年宝',
    code: 'No. v323980',
    type: '固定收益',
    expectedReturn: '4.38%',
    term: '365天',
    minAmount: '1000元',
    riskLevel: '低风险',
    description: '每日计息，到期自动兑付，支持提前赎回',
    tags: ['稳健', '热销'],
    buyMsg: '该产品为线下柜台专属产品，请携带身份证及银行卡至建行网点办理申购。线上渠道暂未开放。',
  },
  {
    id: 2,
    name: '多月宝',
    code: 'No. v323981',
    type: '固定收益',
    expectedReturn: '4.15%',
    term: '120天',
    minAmount: '500元',
    riskLevel: '低风险',
    description: '短期理财优选，灵活期限，收益稳定',
    tags: ['短期', '灵活'],
    buyMsg: '当前为非开放申购期。下一开放申购日为2026年6月15日，届时请关注产品公告。',
  },
  {
    id: 3,
    name: '双月宝',
    code: 'No. v323982',
    type: '固定收益',
    expectedReturn: '3.95%',
    term: '60天',
    minAmount: '500元',
    riskLevel: '低风险',
    description: '双月滚动，到期自动续投，资金利用高效',
    tags: ['短期', '滚动'],
    buyMsg: '本产品为自动滚续产品，申购成功后将自动续投下一期，暂不支持手动追加投资。',
  },
  {
    id: 4,
    name: '周周盈',
    code: 'No. v323983',
    type: '活期理财',
    expectedReturn: '3.20%',
    term: '7天',
    minAmount: '100元',
    riskLevel: '低风险',
    description: '每周结息，随存随取，流动性极佳',
    tags: ['活期', '高流动'],
    buyMsg: '本产品已对接余额自动转入功能，请在"我的账户-余额自动理财"中开启签约，签约后每日自动申购。',
  },
  {
    id: 5,
    name: '进取增利',
    code: 'No. v323984',
    type: '混合型',
    expectedReturn: '5.60%',
    term: '730天',
    minAmount: '5000元',
    riskLevel: '中风险',
    description: '偏股混合策略，博取更高收益，历史业绩优异',
    tags: ['进取', '长期'],
    buyMsg: '该产品为合格投资者专属产品，需完成风险测评（C4及以上）且单笔认购金额不低于30万元。请联系您的客户经理。',
  },
  {
    id: 6,
    name: '智享货币',
    code: 'No. v323985',
    type: '货币基金',
    expectedReturn: '2.85%',
    term: 'T+1',
    minAmount: '1元',
    riskLevel: '极低风险',
    description: '货币市场基金，低门槛随存随取，天天计息',
    tags: ['入门', '随存随取'],
    buyMsg: '本产品对接余额自动转入功能，请在"我的账户-余额自动理财"中开启签约，签约后每日自动申购。',
  },
];

const riskBadge = (level) => {
  const map = {
    '极低风险': { color: '#52c41a', bg: '#f6ffed' },
    '低风险': { color: '#1890ff', bg: '#e6f7ff' },
    '中风险': { color: '#fa8c16', bg: '#fff7e6' },
    '高风险': { color: '#f5222d', bg: '#fff1f0' },
  };
  const style = map[level] || map['低风险'];
  return <span className="risk-badge" style={{ color: style.color, backgroundColor: style.bg }}>{level}</span>;
};

export default ({ onBack }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const { showToast } = useToast();

  const filters = [
    { key: 'all', label: '全部' },
    { key: '固定收益', label: '固定收益' },
    { key: '活期理财', label: '活期理财' },
    { key: '混合型', label: '混合型' },
    { key: '货币基金', label: '货币基金' },
  ];

  const filtered = activeFilter === 'all'
    ? products
    : products.filter(p => p.type === activeFilter);

  return (
    <div className="product-page">
      <header className="product-header">
        <div className="back-button" onClick={onBack}>←</div>
        <h1 className="page-title">产品列表</h1>
        <div className="header-actions" />
      </header>

      <div className="filter-bar">
        {filters.map(f => (
          <span
            key={f.key}
            className={`filter-tag ${activeFilter === f.key ? 'active' : ''}`}
            onClick={() => setActiveFilter(f.key)}
          >
            {f.label}
          </span>
        ))}
      </div>

      <div className="product-list">
        {filtered.map(p => (
          <div key={p.id} className="product-card">
            <div className="product-card-top">
              <div className="product-card-name">
                <span className="product-name-text">{p.name}</span>
                <span className="product-code">{p.code}</span>
              </div>
              {riskBadge(p.riskLevel)}
            </div>
            <div className="product-card-return">
              <span className="return-rate">{p.expectedReturn}</span>
              <span className="return-label">预期年化收益率</span>
            </div>
            <div className="product-card-meta">
              <div className="meta-item">
                <span className="meta-label">期限</span>
                <span className="meta-value">{p.term}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">起投金额</span>
                <span className="meta-value">{p.minAmount}</span>
              </div>
            </div>
            <div className="product-card-desc">{p.description}</div>
            <div className="product-card-tags">
              {p.tags.map(t => <span key={t} className="product-tag">{t}</span>)}
            </div>
            <button className="buy-btn" onClick={() => {
              showToast({ message: p.buyMsg, type: 'warning', duration: 4000 });
            }}>立即申购</button>
          </div>
        ))}
      </div>
    </div>
  );
};