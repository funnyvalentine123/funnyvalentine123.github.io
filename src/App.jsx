import React, { useState } from 'react';
import FinancePage from './pages/home'
import TransactionRecord from './pages/trade'
import MyDt from './pages/mydt'
import ProfitDetail from './pages/profit'
import {calculateTotalCount, calculateProfit} from './component/utils'
import { ToastProvider } from './component/toast';
import GlobalLoading from './component/loading';
import './App.css';

const datalist = [
  { date: '2026-01-16', count: 2000 },
  { date: '2025-12-19', count: 2000 },
  { date: '2025-11-23', count: 2000 },
  { date: '2025-11-14', count: 2000 },
  { date: '2025-10-31', count: 2000 },
  { date: '2025-10-17', count: 300 },
  { date: '2025-10-07', count: 2000 },
  { date: '2025-10-02', count: 1000 },
  // 10000
  { date: '2025-09-30', count: 3000 },
  { date: '2025-09-17', count: 300 },
  { date: '2025-09-10', count: 5000 },
  { date: '2025-09-05', count: 1000 },
  { date: '2025-08-31', count: 200 },
  { date: '2025-08-29', count: 1000 },
];

const result = calculateProfit(calculateTotalCount(datalist), '2025-08-30', new Date().toISOString().split('T')[0], true);

export default () => {
  const [currentPage, setCurrentPage] = useState('homepage');
  const [isLoading, setIsLoading] = useState(false);

  const jump = (pagename) => {
    setIsLoading(true)
    setTimeout(() => {
    setIsLoading(false)
      setCurrentPage(pagename)
    }, Math.floor(Math.random() * 500) + 500)
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'homepage':
        return <FinancePage data={datalist} totalProfit={result.totalProfit} goto={(page) => {jump(page)}}/>
      case 'traderecord':
        return <TransactionRecord data={datalist} onBack={() => {jump('homepage')}}/>
      case 'mydt':
        return <MyDt onBack={() => {jump('homepage')}}/>
      case 'profit':
        return <ProfitDetail data={datalist} totalProfit={result.totalProfit} onBack={() => {jump('homepage')}}/>
      default:
        return <></>;
    }
  }

  return <ToastProvider>
      {renderPage()}
      <GlobalLoading
        visible={isLoading} 
        text="加载中..."
      />
  </ToastProvider>
};