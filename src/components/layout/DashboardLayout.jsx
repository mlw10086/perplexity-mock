import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-background text-text-main font-sans selection:bg-primary/20">
      <Sidebar />
      <main className="flex-1 overflow-y-auto h-screen">
        {/* 页面内容 */}
        <div className="max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
