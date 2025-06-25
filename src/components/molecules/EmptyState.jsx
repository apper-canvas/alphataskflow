import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const EmptyState = ({ 
  icon = 'CheckSquare',
  title = 'No tasks yet',
  description = 'Create your first task to get started with TaskFlow',
  actionLabel = 'Add Task',
  onAction,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`text-center py-12 px-6 ${className}`}
    >
      <motion.div
        animate={{ 
          y: [0, -8, 0],
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="mb-6"
      >
        <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mx-auto">
          <ApperIcon 
            name={icon} 
            size={32} 
            className="text-surface-400" 
          />
        </div>
      </motion.div>
      
      <h3 className="text-lg font-display font-semibold text-surface-900 mb-2">
        {title}
      </h3>
      
      <p className="text-surface-600 mb-6 max-w-sm mx-auto">
        {description}
      </p>
      
      {onAction && (
        <Button
          onClick={onAction}
          variant="primary"
          icon="Plus"
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyState;