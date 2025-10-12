import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Breadcrumbs from '../components/Breadcrumbs';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-dark text-text-primary">
      {/* Background gradient */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-dark via-dark-elevated to-dark-card"></div>
      
      {/* Premium texture overlay */}
      <div className="fixed inset-0 -z-10 opacity-[0.03] bg-gradient-to-tr from-primary/5 via-transparent to-accent/5"></div>
      
      <div className="flex h-screen relative">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          {/* Header */}
          <Header toggleSidebar={toggleSidebar} />
          
          {/* Main Content Area */}
          <main className="flex-1 overflow-auto bg-gradient-to-br from-transparent via-dark-elevated/20 to-transparent">
            <div className="p-6 lg:p-8 max-w-7xl mx-auto">
              {/* Breadcrumbs */}
              <Breadcrumbs />
              
              {/* Page Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="space-y-8"
              >
                <Outlet />
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;