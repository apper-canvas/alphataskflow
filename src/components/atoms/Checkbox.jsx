import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Checkbox = ({ 
  checked = false, 
  onChange, 
  label, 
  disabled = false,
  size = 'md',
  className = '',
  ...props 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  };

  return (
    <label className={`inline-flex items-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
          {...props}
        />
        
        <motion.div
          initial={false}
          animate={{
            backgroundColor: checked ? '#10b981' : '#ffffff',
            borderColor: checked ? '#10b981' : '#d1d5db',
            scale: checked ? 1.05 : 1
          }}
          transition={{ 
            type: "spring", 
            stiffness: 500, 
            damping: 30,
            duration: 0.15 
          }}
          className={`
            ${sizes[size]} border-2 rounded-md flex items-center justify-center
            transition-all duration-150 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2
          `}
        >
          <motion.div
            initial={false}
            animate={{
              scale: checked ? 1 : 0,
              opacity: checked ? 1 : 0
            }}
            transition={{ 
              type: "spring", 
              stiffness: 500, 
              damping: 30,
              duration: 0.15 
            }}
          >
            <ApperIcon 
              name="Check" 
              size={iconSizes[size]} 
              className="text-white font-bold" 
            />
          </motion.div>
        </motion.div>
      </div>
      
      {label && (
        <span className="ml-2 text-sm text-surface-700">
          {label}
        </span>
      )}
    </label>
  );
};

export default Checkbox;