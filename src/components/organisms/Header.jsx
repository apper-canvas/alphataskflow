import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';

const Header = ({ 
  onMobileMenuToggle, 
  onQuickAdd, 
  isMobileMenuOpen,
  onSearch 
}) => {
  return (
    <header className="flex-shrink-0 h-16 bg-white border-b border-surface-200 px-4 md:px-6 flex items-center justify-between z-40">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 hover:bg-surface-100 rounded-lg transition-colors"
        >
          <motion.div
            animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
          </motion.div>
        </motion.button>

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
            <ApperIcon name="CheckSquare" size={18} className="text-white" />
          </div>
          <h1 className="text-xl font-display font-bold text-primary-800 hidden sm:block">
            TaskFlow
          </h1>
        </div>
      </div>

      {/* Center - Search (Hidden on mobile) */}
      <div className="hidden md:block flex-1 max-w-md mx-8">
        <SearchBar 
          onSearch={onSearch}
          placeholder="Search tasks..."
        />
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        {/* Mobile Search Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="md:hidden p-2 hover:bg-surface-100 rounded-lg transition-colors"
        >
          <ApperIcon name="Search" size={20} className="text-surface-600" />
        </motion.button>

        {/* Quick Add Button */}
        <Button
          onClick={onQuickAdd}
          variant="primary"
          size="md"
          icon="Plus"
          className="shadow-sm"
        >
          <span className="hidden sm:inline">Add Task</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;