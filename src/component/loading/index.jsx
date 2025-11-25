import React from 'react';
import './index.css';

// 定义Loading组件（接收控制属性）
const GlobalLoading = ({
  visible = false, // 是否显示
  text = '加载中...', // 加载文案
  background = 'rgba(255, 255, 255, 0.8)', // 背景色
  color = '#e53e3e', // 文字/图标颜色
}) => {
  if (!visible) return null; // 不显示时返回空

  return (
    <div 
      className="global-loading"
      style={{ backgroundColor: background }}
    >
      {/* 加载动画 */}
      <div 
        className="loading-spinner"
        style={{ 
          borderColor: `${color}33`, // 浅色边框（主题色透明30%）
          borderTopColor: color // 主题色边框
        }}
      ></div>
      {/* 加载文案 */}
      <div 
        className="loading-text"
        style={{ color }}
      >
        {text}
      </div>
    </div>
  );
};

export default GlobalLoading;