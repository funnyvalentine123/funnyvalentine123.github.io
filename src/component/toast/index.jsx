import React, { useState, useEffect, useRef } from 'react';
import './index.css';

// 创建Toast上下文，用于全局调用
const ToastContext = React.createContext();

// Toast提供者组件，需包裹在根组件外层
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const toastIdRef = useRef(1);

  // 核心方法：显示Toast
  const showToast = ({
    message = '操作提示',
    type = 'default', // default/success/error/warning
    duration = 3000, // 自动关闭时间（毫秒），0为不自动关闭
    position = 'bottom', // top/middle/bottom
    onClose = () => {} // 关闭回调
  }) => {
    const toastId = toastIdRef.current++;
    const newToast = {
      id: toastId,
      message,
      type,
      position,
      onClose
    };

    // 添加Toast
    setToasts(prev => [...prev, newToast]);

    // 自动关闭逻辑
    if (duration > 0) {
      setTimeout(() => {
        closeToast(toastId);
      }, duration);
    }

    // 返回关闭方法，支持手动关闭
    return () => closeToast(toastId);
  };

  // 关闭单个Toast
  const closeToast = (toastId) => {
    setToasts(prev => {
      const toast = prev.find(item => item.id === toastId);
      if (toast) toast.onClose(); // 执行关闭回调
      return prev.filter(item => item.id !== toastId);
    });
  };

  // 关闭所有Toast
  const closeAllToasts = () => {
    setToasts(prev => {
      prev.forEach(toast => toast.onClose());
      return [];
    });
  };

  return (
    <ToastContext.Provider value={{ showToast, closeAllToasts }}>
      {children}
      {/* Toast容器，渲染所有Toast */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`toast toast--${toast.type} toast--${toast.position}`}
            onClick={() => closeToast(toast.id)} // 点击关闭
          >
            {/* 图标 */}
            {toast.type !== 'default' && (
              <span className={`toast__icon toast__icon--${toast.type}`}>
                {toast.type === 'success' && '✓'}
                {toast.type === 'error' && '✕'}
                {toast.type === 'warning' && '!'}
              </span>
            )}
            {/* 文案 */}
            <span className="toast__message">{toast.message}</span>
            {/* 关闭按钮（仅非自动关闭时显示） */}
            {toast.duration === 0 && (
              <span className="toast__close-btn">✕</span>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// 自定义Hook，方便组件内调用
export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// 导出默认组件（如果需要直接渲染单个Toast，可单独使用）
const Toast = ({ message, type, duration, position, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300); // 等待动画结束后执行回调
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div className={`toast toast--${type} toast--${position}`}>
      {type !== 'default' && (
        <span className={`toast__icon toast__icon--${type}`}>
          {type === 'success' && '✓'}
          {type === 'error' && '✕'}
          {type === 'warning' && '!'}
        </span>
      )}
      <span className="toast__message">{message}</span>
      {duration === 0 && (
        <span className="toast__close-btn" onClick={onClose}>✕</span>
      )}
    </div>
  );
};

export default Toast;