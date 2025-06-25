import React from 'react';
import { motion } from 'framer-motion';
import { format, isToday, isPast, parseISO } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Checkbox from '@/components/atoms/Checkbox';
import Badge from '@/components/atoms/Badge';

const TaskCard = ({ 
  task, 
  onToggleComplete, 
  onEdit, 
  onDelete,
  categoryColors = {},
  className = '' 
}) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const formatDueDate = (dateString) => {
    if (!dateString) return null;
    
    const date = parseISO(dateString);
    if (isToday(date)) return 'Today';
    if (isPast(date) && !isToday(date)) return `Overdue`;
    return format(date, 'MMM d');
  };

  const isDue = task.dueDate && (isToday(parseISO(task.dueDate)) || isPast(parseISO(task.dueDate))) && !task.completed;
  const categoryColor = categoryColors[task.categoryId] || '#6b7280';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ 
        scale: 1.01,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}
      transition={{ duration: 0.15 }}
      className={`
        bg-white border border-surface-200 rounded-lg p-4 
        transition-all duration-150 cursor-pointer
        ${task.completed ? 'opacity-60' : ''}
        ${className}
      `}
      style={{
        borderLeftWidth: '4px',
        borderLeftColor: getPriorityColor(task.priority)
      }}
    >
      <div className="flex items-start gap-3">
        <motion.div
          whileTap={{ scale: 0.95 }}
          className="mt-0.5"
        >
          <Checkbox
            checked={task.completed}
            onChange={(e) => onToggleComplete(task.Id, e.target.checked)}
            size="md"
          />
        </motion.div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h3 
              className={`font-medium text-surface-900 leading-snug ${
                task.completed ? 'line-through text-surface-500' : ''
              }`}
              onClick={() => onEdit?.(task)}
            >
              {task.title}
            </h3>
            
            <div className="flex items-center gap-2">
              {onEdit && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(task);
                  }}
                  className="p-1 text-surface-400 hover:text-surface-600 rounded"
                >
                  <ApperIcon name="Edit2" size={14} />
                </motion.button>
              )}
              
              {onDelete && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(task.Id);
                  }}
                  className="p-1 text-surface-400 hover:text-error rounded"
                >
                  <ApperIcon name="Trash2" size={14} />
                </motion.button>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            <Badge 
              variant="default"
              color={categoryColor}
              size="sm"
            >
              {task.categoryId}
            </Badge>
            
            <Badge 
              variant={task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'default'}
              size="sm"
            >
              {task.priority}
            </Badge>
            
            {task.dueDate && (
              <Badge 
                variant={isDue ? 'error' : 'default'}
                size="sm"
              >
                <ApperIcon name="Calendar" size={12} className="mr-1" />
                {formatDueDate(task.dueDate)}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;