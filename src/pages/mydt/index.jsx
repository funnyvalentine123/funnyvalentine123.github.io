import React from 'react';
import './index.css';


const MyDt = ({
    data,
    onBack
}) => {

  return (
    <div className="transaction-page">
      {/* 顶部导航栏 */}
      <header className="transaction-header">
        <div className="back-button" onClick={onBack}>←</div>
        <h1 className="page-title">我的定投</h1>
        <div className="header-actions">
          {/* <span className="smile-icon">😊</span>
          <span className="notification-badge">47</span> */}
        </div>
      </header>
      <div style={{
        width: '100vw',
        height: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#868686'
      }}>
        <span>本产品暂无定投, 请去建行柜台现金或网上银行办理😊</span>
      </div>
    </div>
  );
};

export default MyDt;